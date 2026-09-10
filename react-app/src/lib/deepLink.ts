// Deep link de las notificaciones push: cuando alguien toca un aviso, la app
// se abre (o navega) hacia una URL con ?tab=notas&n=<id> (ver pushLinkFor en
// lib/push.ts). Este módulo lee esos parámetros una sola vez y limpia la URL
// para que no queden pegados: si el usuario recarga la app luego, no debe
// volver a saltar a esa nota.

import type { Tab } from '../types';

const TABS: Tab[] = ['inicio', 'ganancias', 'eventos', 'productos', 'inventario', 'empleados', 'notas'];

let pendingNoteId: string | null = null;

function readParam(name: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

// Pestaña pedida por la URL (si es un tab válido), al abrir la app.
export function readDeepTab(): Tab | null {
  const t = readParam('tab');
  return (t && (TABS as string[]).includes(t)) ? t as Tab : null;
}

// Id de nota pedido por la URL; se consume una sola vez (Notes lo lee al
// montarse) para abrir el hilo directo.
export function consumeDeepNote(): string | null {
  const n = pendingNoteId;
  pendingNoteId = null;
  return n;
}

// Se llama una vez al arrancar la app: guarda la nota pendiente y limpia los
// parámetros ?tab=...&n=... de la URL (con history.replaceState, que no deja
// entrada nueva en el historial).
export function initDeepLink(): void {
  const note = readParam('n');
  if (note) pendingNoteId = note;
  const tab = readParam('tab');
  if (note || tab) {
    try {
      const base = window.location.href.split('?')[0];
      window.history.replaceState(null, '', base);
    } catch { /* ignorar */ }
  }
}