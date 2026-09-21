import type { AppState } from '../types';
import { accountId, rememberLegacyId, setAccountId, setAccountEmail, setAccountName, setSessionActive } from './accountStore';
import { buildRekeyedStore } from './identity';
import { CLIENT_KEY, resetClientId, syncSetName } from './core';
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
        setSessionActive(true);
        setAccountEmail(user.email || null);
        // El nombre de usuario elegido al crear la cuenta se conserva como
        // displayName de Firebase: cada teléfono que inicie sesión lo adopta
        // como su nombre, para que siempre sea el mismo en todo el equipo.
        if (user.displayName && user.displayName.trim()) {
          setAccountName(user.displayName.trim());
          syncSetName(user.displayName.trim());
        }
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
    'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains); agrega el dominio de tu página.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  };
  return map[code] || 'No se pudo completar la operación. Revisa tu conexión.';
}

export async function signInAccount(email: string, pw: string): Promise<{ ok: boolean; uid?: string; email?: string; message: string }> {
  const priorId = accountId();
  try {
    const { getAuth, signInWithEmailAndPassword, signOut, sendEmailVerification } = await import('firebase/auth');
    const auth = getAuth(firebaseApp()!);
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pw);
    const user = cred.user;
    if (!user.emailVerified) {
      // No se puede usar la cuenta sin confirmar el correo: se cierra la
      // sesión (Firebase la deja iniciada al crearla/entrar), se reenvía el
      // enlace de confirmación y se restaura la identidad anterior para que
      // las tiendas de este teléfono sigan funcionando igual.
      try { await sendEmailVerification(user); } catch { /* el reenvío no es crítico */ }
      await signOut(auth);
      if (accountId() === user.uid) { setAccountId(priorId || null); resetClientId(); }
      setSessionActive(false);
      return { ok: false, message: 'Tu correo todavía no está confirmado. Te reenviamos el enlace de confirmación: revísalo (y el spam) y vuelve a intentarlo.' };
    }
    setSessionActive(true);
    if (user.displayName && user.displayName.trim()) {
      setAccountName(user.displayName.trim());
      syncSetName(user.displayName.trim());
    }
    return { ok: true, uid: user.uid, email: user.email || undefined, message: 'Sesión iniciada.' };
  } catch (e) {
    return { ok: false, message: authMessage(e) };
  }
}

export async function registerAccount(email: string, pw: string, name?: string): Promise<{ ok: boolean; uid?: string; email?: string; message: string }> {
  const priorId = accountId();
  try {
    const { getAuth, createUserWithEmailAndPassword, signOut, sendEmailVerification, updateProfile } = await import('firebase/auth');
    const auth = getAuth(firebaseApp()!);
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pw);
    const user = cred.user;
    // El nombre de usuario que se pide al crear la cuenta pasa a ser el
    // displayName de Firebase: es el nombre que la cuenta usa SIEMPRE en
    // notas, ventas e inventario, y que se adopta en cada teléfono que
    // inicie sesión (ver initAccountAuth/signInAccount).
    const display = (name && name.trim()) ? name.trim() : '';
    try { if (display) await updateProfile(user, { displayName: display }); } catch { /* best-effort: no es crítico */ }
    if (display) {
      setAccountName(display);
      syncSetName(display);
    }
    // Confirmación obligatoria antes de usar la cuenta: se manda el correo de
    // verificación y se sale de la sesión recién creada (no se vincula nada
    // hasta que el usuario confirme el correo y entre con Iniciar sesión).
    let verifOk = true;
    try { await sendEmailVerification(user); } catch { verifOk = false; }
    await signOut(auth);
    if (accountId() === user.uid) { setAccountId(priorId || null); resetClientId(); }
    setSessionActive(false);
    const userEmail = user.email || undefined;
    if (verifOk) return { ok: true, uid: user.uid, email: userEmail, message: 'Cuenta creada. Te enviamos un correo para confirmarla: revísalo (y el spam) y luego inicia sesión.' };
    return { ok: false, uid: user.uid, email: userEmail, message: 'Cuenta creada, pero no se pudo enviar el correo de confirmación ahora. Espera un momento y usa "¿Olvidaste tu contraseña?" con tu correo para recibir un enlace.' };
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
    setSessionActive(false);
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
      // El índice de membresía (ver "memberIds" en sync.ts) también se
      // re-vincula: se quita el id viejo y se agrega el de la cuenta, para
      // que un teléfono nuevo que inicie sesión encuentre la tienda sola.
      if (data) {
        const pt = (data.pushTokens || {}) as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(pt, from)) upd.pushTokens = { [to]: pt[from], [from]: del };
        const pp = (data.pushPrefs || {}) as Record<string, unknown>;
        if (Object.prototype.hasOwnProperty.call(pp, from)) upd.pushPrefs = { [to]: pp[from], [from]: del };
        if (data.createdBy === from) upd.createdBy = to;
        const mIds = new Set<string>(Array.isArray(data.memberIds) ? (data.memberIds as string[]) : Object.keys(rekeyed.members || {}));
        if (mIds.has(from)) mIds.delete(from);
        mIds.add(to);
        upd.memberIds = Array.from(mIds);
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