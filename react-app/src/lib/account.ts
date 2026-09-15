import type { AppState } from '../types';
import { accountId, rememberLegacyId, setAccountId, setAccountEmail } from './accountStore';
import { buildRekeyedStore } from './identity';
import { CLIENT_KEY, resetClientId } from './core';
import { firebaseApp, firestoreDb } from './sync';

let initialized = false;
const subscribers = new Set<(uid: string | null) => void>();

export function onAccountChange(cb: (uid: string | null) => void): () => void {
  subscribers.add(cb);
  return () => { subscribers.delete(cb); };
}

function emit(uid: string | null) {
  subscribers.forEach((cb) => cb(uid));
}

export function accountEnabled(): boolean {
  return !!accountId();
}

// Id que está usando este dispositivo HOY, antes de que el uid de la cuenta
// se haga efectivo: la cuenta si ya había una, o si no el id aleatorio del
// dispositivo guardado en CLIENT_KEY.
export function currentIdentity(): string {
  return accountId() || (localStorage.getItem(CLIENT_KEY) || '');
}

// Suscribe el estado de sesión de Firebase Auth. Al arrancar restaura la
// sesión persistida: si ya había una cuenta en este navegador, la identidad
// vuelve a ser la de esa cuenta.
export async function initAccountAuth(): Promise<void> {
  if (initialized) return;
  const app = firebaseApp();
  if (!app) return;
  try {
    const { getAuth, onAuthStateChanged } = await import('firebase/auth');
    const auth = getAuth(app);
    initialized = true;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAccountEmail(user.email || null);
        if (accountId() !== user.uid) {
          setAccountId(user.uid);
          resetClientId();
        }
      }
      emit(user ? user.uid : null);
    });
  } catch (e) {
    console.warn('Auth no disponible en este navegador:', e);
  }
}

function authMessage(e: unknown): string {
  const code = (e as { code?: string })?.code || 'error';
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
    'auth/invalid-email': 'Ese correo no parece válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentar.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu red.',
    'auth/operation-not-allowed': 'Todavía no está activado el acceso con correo en Firebase (Authentication → Sign-in method → Email/Password).',
    'auth/api-key-not-valid': 'La Firebase Auth no quedó bien configurada en la consola.',
  };
  return map[code] || 'No se pudo completar la operación. Revisa tu conexión.';
}

export async function signInAccount(email: string, pw: string): Promise<{ ok: boolean; uid?: string; email?: string; message: string }> {
  try {
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    const cred = await signInWithEmailAndPassword(getAuth(firebaseApp()!), email.trim(), pw);
    return { ok: true, uid: cred.user.uid, email: cred.user.email || undefined, message: 'Sesión iniciada.' };
  } catch (e) {
    return { ok: false, message: authMessage(e) };
  }
}

export async function registerAccount(email: string, pw: string): Promise<{ ok: boolean; uid?: string; email?: string; message: string }> {
  try {
    const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(getAuth(firebaseApp()!), email.trim(), pw);
    return { ok: true, uid: cred.user.uid, email: cred.user.email || undefined, message: 'Cuenta creada.' };
  } catch (e) {
    return { ok: false, message: authMessage(e) };
  }
}

export async function sendPasswordReset(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const { getAuth, sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(getAuth(firebaseApp()!), email.trim());
    return { ok: true, message: 'Revisa tu correo para restablecer la contraseña.' };
  } catch (e) {
    return { ok: false, message: authMessage(e) };
  }
}

// Cierra la sesión de Firebase SIN desvincular al dispositivo: la identidad
// local se conserva (ACCOUNT_KEY no se toca), así las tiendas de este equipo
// siguen funcionando aunque se cierre sesión aquí.
export async function signOutAccount(): Promise<{ ok: boolean; message: string }> {
  try {
    const { getAuth, signOut } = await import('firebase/auth');
    await signOut(getAuth(firebaseApp()!));
    emit(null);
    return { ok: true, message: 'Sesión cerrada. Este dispositivo conserva sus tiendas.' };
  } catch (e) {
    return { ok: false, message: authMessage(e) };
  }
}

export interface LinkResult { stores: number; remote: number; }

// Re-vincula las tiendas locales que esta persona tenía con el id "from" para
// que ahora queden con el id "to" (el uid de la cuenta). Mueve la membresía y
// el rol de dueño (createdBy) en copias locales NUEVAS y, para las tiendas
// sincronizadas, sube el mismo cambio a la nube (members/pushTokens/pushPrefs/
// createdBy) para que el resto del equipo vea al nuevo id. Deja un registro
// "legacy" para que samePerson siga reconociendo lo firmado con el id viejo.
export async function linkStoresToAccount(to: string, from: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void): Promise<LinkResult> {
  const res: LinkResult = { stores: 0, remote: 0 };
  if (!to || !from || from === to) return res;
  for (const st of getState().stores) {
    const rekeyed = buildRekeyedStore(st, from, to);
    if (!rekeyed) continue;
    res.stores += 1;
    mutate((d) => {
      const i = d.stores.findIndex((x) => x.id === st.id);
      if (i >= 0) d.stores[i] = rekeyed;
    });
    if (!rekeyed.syncKey) continue;
    try {
      const { doc, collection, getDoc, setDoc, deleteField } = await import('firebase/firestore');
      const db = firestoreDb();
      if (!db) continue;
      const ref = doc(collection(db, 'stores'), rekeyed.syncKey);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : null;
      const del = deleteField();
      const upd: Record<string, unknown> = { updatedBy: to };
      upd.members = { [to]: (rekeyed.members && rekeyed.members[to]) || null, [from]: del };
      if (data) {
        const pt = (data.pushTokens || {}) as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(pt, from)) upd.pushTokens = { [to]: pt[from], [from]: del };
        const pp = (data.pushPrefs || {}) as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(pp, from)) upd.pushPrefs = { [to]: pp[from], [from]: del };
        if (data.createdBy === from) upd.createdBy = to;
      }
      await setDoc(ref, upd, { merge: true });
      res.remote += 1;
    } catch (e) {
      console.warn('No se pudo re-vincular la tienda remota:', e);
    }
  }
  if (res.stores) rememberLegacyId(from);
  return res;
}