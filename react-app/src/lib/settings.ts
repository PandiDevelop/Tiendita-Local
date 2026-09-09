// Ajustes simples de la app guardados en este dispositivo (localStorage), no
// viajan por Firestore: el nombre se sigue guardando con syncSetName (ese si
// se expone al equipo), pero preferencias como el sonido son por persona.
const SOUND_KEY = 'mt_sound';

export function soundEnabled(): boolean {
  try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch { return true; }
}

export function setSoundEnabled(v: boolean): void {
  try { localStorage.setItem(SOUND_KEY, v ? 'on' : 'off'); } catch { /* ignorar */ }
}