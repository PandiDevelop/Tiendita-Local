export const ACCOUNT_KEY = 'mi-tiendita-account';
const ACCOUNT_EMAIL_KEY = 'mi-tiendita-account-email';
const ACCOUNT_LEGACY_KEY = 'mi-tiendita-account-legacy';
const ACCOUNT_SESSION_KEY = 'mi-tiendita-account-session';
const ACCOUNT_NAME_KEY = 'mi-tiendita-account-name';

// Id de la cuenta (Firebase Auth uid) con sesión en este dispositivo. Mientras
// exista, la identidad de la app (syncClientId en core.ts) es ESTE id; sin
// cuenta, sigue siendo el id aleatorio del dispositivo. Todo se guarda en
// localStorage para que sea síncrono y funcione sin conexión.
export function accountId(): string | null {
  try { return localStorage.getItem(ACCOUNT_KEY); } catch { return null; }
}

export function setAccountId(uid: string | null): void {
  try {
    if (uid) localStorage.setItem(ACCOUNT_KEY, uid);
    else localStorage.removeItem(ACCOUNT_KEY);
  } catch { /* cuota llena / modo privado: no crítico */ }
}

export function accountEmail(): string | null {
  try { return localStorage.getItem(ACCOUNT_EMAIL_KEY); } catch { return null; }
}

export function setAccountEmail(email: string | null): void {
  try {
    if (email) localStorage.setItem(ACCOUNT_EMAIL_KEY, email);
    else localStorage.removeItem(ACCOUNT_EMAIL_KEY);
  } catch { /* no crítico */ }
}

// Nombre de usuario elegido al crear la cuenta (el displayName de Firebase).
// Es el nombre que la cuenta usa SIEMPRE y el que cada teléfono que inicie
// sesión adopta como propio (ver initAccountAuth/signInAccount en account.ts).
export function accountName(): string | null {
  try { return localStorage.getItem(ACCOUNT_NAME_KEY); } catch { return null; }
}

export function setAccountName(v: string | null): void {
  try {
    if (v) localStorage.setItem(ACCOUNT_NAME_KEY, v);
    else localStorage.removeItem(ACCOUNT_NAME_KEY);
  } catch { /* no crítico */ }
}

// Ids que esta MISMA persona tuvo antes de vincular su cuenta (el id aleatorio
// del dispositivo y, encadenando, los anteriores). Se usan para que samePerson
// siga reconociendo notas, ventas y cargamentos viejos firmados con un id
// ancestral, aunque el actual ya sea el de la cuenta.
export function legacyAccountIds(): string[] {
  try {
    const raw = localStorage.getItem(ACCOUNT_LEGACY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

export function rememberLegacyId(id: string): void {
  if (!id) return;
  try {
    const cur = legacyAccountIds();
    if (cur.includes(id)) return;
    cur.push(id);
    localStorage.setItem(ACCOUNT_LEGACY_KEY, JSON.stringify(cur));
  } catch { /* no crítico */ }
}

export function clearLegacyIds(): void {
  try { localStorage.removeItem(ACCOUNT_LEGACY_KEY); } catch { /* no crítico */ }
}

// La "sesión" (Firebase Auth) activa en este navegador, separada de la
// identidad: accountId() identifica los datos (y se conserva aunque cierres
// sesión); este flag marca si AHORA hay una sesión de usuario iniciada, que
// es lo que decide si Opciones muestra "Estás conectado a…".
export function sessionActive(): boolean {
  try { return localStorage.getItem(ACCOUNT_SESSION_KEY) === '1' && !!localStorage.getItem(ACCOUNT_KEY); } catch { return false; }
}

export function setSessionActive(on: boolean): void {
  try {
    if (on) localStorage.setItem(ACCOUNT_SESSION_KEY, '1');
    else localStorage.removeItem(ACCOUNT_SESSION_KEY);
  } catch { /* no crítico */ }
}