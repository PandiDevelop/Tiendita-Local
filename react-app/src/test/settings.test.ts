// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { notifyEnabled, setNotifyEnabled, notifCatEnabled, setNotifCat } from '../lib/settings';

// Preferencias de notificación por dispositivo (localStorage). Una categoría
// que nunca se tocó equivale a ACTIVADA; el interruptor general de
// Notificaciones es independiente y apaga todo el sonido/vibración local.
describe('settings: notificaciones por categoría', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('por defecto todas las categorías están activas', () => {
    expect(notifyEnabled()).toBe(true);
    expect(notifCatEnabled('nota')).toBe(true);
    expect(notifCatEnabled('venta')).toBe(true);
    expect(notifCatEnabled('producto')).toBe(true);
    expect(notifCatEnabled('cargamento')).toBe(true);
  });

  it('apagar una categoría no afecta a las demás', () => {
    setNotifCat('venta', false);
    expect(notifCatEnabled('venta')).toBe(false);
    expect(notifCatEnabled('nota')).toBe(true);
    expect(notifyEnabled()).toBe(true);
  });

  it('el interruptor general sigue apagando el aviso local de todo', () => {
    setNotifyEnabled(false);
    expect(notifyEnabled()).toBe(false);
    expect(notifCatEnabled('nota')).toBe(true);
  });

  it('las preferencias sobreviven a un reinicio (persistencia)', () => {
    setNotifCat('cargamento', false);
    const reloaded = Object.fromEntries(Object.entries(localStorage));
    localStorage.clear();
    Object.entries(reloaded).forEach(([k, v]) => localStorage.setItem(k, v));
    expect(notifCatEnabled('cargamento')).toBe(false);
  });
});