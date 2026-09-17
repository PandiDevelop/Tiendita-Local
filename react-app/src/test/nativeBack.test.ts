// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { initNativeBack } from '../lib/nativeBack';
import { pushOverlay } from '../lib/backStack';

type CapHolder = { Capacitor?: unknown };

type Listener = { event: string; cb: () => void };

function installCapacitor(native: boolean, exitApp: () => void): { listeners: Listener[] } {
  const listeners: Listener[] = [];
  (globalThis as CapHolder).Capacitor = {
    isNativePlatform: () => native,
    Plugins: { App: { addListener: (event: string, cb: () => void) => listeners.push({ event, cb }), exitApp } },
  };
  return { listeners };
}

afterEach(() => {
  delete (globalThis as CapHolder).Capacitor;
  vi.restoreAllMocks();
});

describe('Atrás del celular (app nativa)', () => {
  it('fuera de la app nativa no registra nada', () => {
    const { listeners } = installCapacitor(false, () => {});
    initNativeBack();
    expect(listeners).toHaveLength(0);
  });

  it('registra backButton y sale de la app si no hay ventanas abiertas', () => {
    const exitApp = vi.fn();
    const { listeners } = installCapacitor(true, exitApp);
    initNativeBack();
    expect(listeners[0].event).toBe('backButton');
    listeners[0].cb();
    expect(exitApp).toHaveBeenCalledTimes(1);
  });

  it('con una ventana abierta retrocede en vez de salir', () => {
    const exitApp = vi.fn();
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
    const { listeners } = installCapacitor(true, exitApp);
    const close = pushOverlay(() => {});
    initNativeBack();
    listeners[0].cb();
    expect(back).toHaveBeenCalledTimes(1);
    expect(exitApp).not.toHaveBeenCalled();
    close();
  });
});
