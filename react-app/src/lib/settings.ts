// Ajustes simples de la app guardados en este dispositivo (localStorage), no
// viajan por Firestore: el nombre se sigue guardando con syncSetName (ese si
// se expone al equipo), pero preferencias como las notificaciones son por
// persona y por dispositivo.
const NOTIF_KEY = 'mt_notif';
// Clave vieja (una sola opcion de "sonido"): se respeta como valor inicial la
// primera vez que esta version se ejecuta, para no re-activar sonido a quien
// ya lo habia silenciado.
const SOUND_KEY = 'mt_sound';

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