export const ACCOUNT_KEY = 'mi-tiendita-account';
const ACCOUNT_EMAIL_KEY = 'mi-tiendita-account-email';
const ACCOUNT_LEGACY_KEY = 'mi-tiendita-account-legacy';

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