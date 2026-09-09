// Ajustes simples de la app guardados en este dispositivo (localStorage), no
// viajan por Firestore: el nombre se sigue guardando con syncSetName (ese si
// se expone al equipo), pero preferencias como las notificaciones son por
// persona y por dispositivo.
const NOTIF_KEY = 'mt_notif';
// Clave vieja (una sola opcion de "sonido"): se respeta como valor inicial la
// primera vez que esta version se ejecuta, para no re-activar sonido a quien
// ya lo habia silenciado.
const SOUND_KEY = 'mt_sound';
// Preferencia por categoria de aviso (NotifCat): un mapa {cat: boolean} por
// dispositivo. Si una categoria no aparece, se asume ACTIVADA (true) - asi un
// dispositivo que nunca toco Opciones sigue recibiendo todo igual que antes.
const NOTIF_CATS_KEY = 'mt_notif_cats';

// Un unico interruptor de "Notificaciones" controla todo lo que suena o
// vibra aca: la campanita, la vibracion (ver playNoteChime en sound.ts) y el
// aviso del sistema/push que se activa desde Opciones.
export function notifyEnabled(): boolean {
  try {
    if (localStorage.getItem(NOTIF_KEY) !== null) return localStorage.getItem(NOTIF_KEY) !== 'off';
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setNotifyEnabled(v: boolean): void {
  try {
    localStorage.setItem(NOTIF_KEY, v ? 'on' : 'off');
    localStorage.removeItem(SOUND_KEY);
  } catch { /* ignorar */ }
}

// Notificaciones activas por tipo (ver NotifCat en types.ts): solo se avisa
// (campanita local Y push del Worker) de las categorias encendidas. Si el
// interruptor principal de Notificaciones esta apagado, esto no importa: se
// silencia todo de todas formas.
export function notifCats(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(NOTIF_CATS_KEY);
    const o = raw ? JSON.parse(raw) : null;
    return (o && typeof o === 'object') ? o as Record<string, boolean> : {};
  } catch {
    return {};
  }
}

export function notifCatEnabled(cat: string): boolean {
  const m = notifCats();
  return m[cat] === undefined ? true : !!m[cat];
}

export function setNotifCat(cat: string, v: boolean): void {
  try {
    const m = notifCats();
    m[cat] = v;
    localStorage.setItem(NOTIF_CATS_KEY, JSON.stringify(m));
  } catch { /* ignorar */ }
}