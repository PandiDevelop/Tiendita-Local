// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_VERSION } from '../lib/version';
import { checkForUpdate } from '../lib/otaUpdate';

type CapHolder = { Capacitor?: unknown };

function installCapacitor(native: boolean, updater?: unknown): void {
  (globalThis as CapHolder).Capacitor = {
    isNativePlatform: () => native,
    Plugins: updater ? { CapacitorUpdater: updater } : {},
  };
}

function jsonResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

afterEach(() => {
  delete (globalThis as CapHolder).Capacitor;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Actualización OTA (comprobación manual)', () => {
  it('fuera de la app nativa no comprueba nada', async () => {
    installCapacitor(false);
    const r = await checkForUpdate();
    expect(r).toEqual({ kind: 'unsupported' });
  });

  it('sin conexión devuelve un error explicable', async () => {
    installCapacitor(true, { download: vi.fn(), set: vi.fn(), reload: vi.fn() });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const r = await checkForUpdate();
    expect(r.kind).toBe('error');
  });

  it('si ya estamos al día lo indica', async () => {
    installCapacitor(true, { download: vi.fn(), set: vi.fn(), reload: vi.fn() });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: APP_VERSION, url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r).toEqual({ kind: 'up-to-date', current: APP_VERSION });
  });

  it('con una versión nueva descarga y aplica el bundle', async () => {
    const download = vi.fn().mockResolvedValue({ id: 'b1' });
    const set = vi.fn().mockResolvedValue(undefined);
    const reload = vi.fn().mockResolvedValue(undefined);
    installCapacitor(true, { download, set, reload });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: '99.0.0', url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r).toEqual({ kind: 'updated', version: '99.0.0' });
    expect(download).toHaveBeenCalledWith({ url: 'https://x/latest.zip', version: '99.0.0' });
    expect(set).toHaveBeenCalledWith({ id: 'b1' });
  });

  it('con una versión nueva pero sin plugin devuelve error', async () => {
    installCapacitor(true);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: '98.0.0', url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r.kind).toBe('error');
    if (r.kind === 'error') expect(r.message).toContain('98.0.0');
  });

  it('si el bundle en ejecución ya es la última, no reinstala (evita el bucle)', async () => {
    const download = vi.fn();
    const set = vi.fn();
    installCapacitor(true, { download, set, current: vi.fn().mockResolvedValue({ bundle: { version: '50.0.0' } }) });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: '50.0.0', url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r).toEqual({ kind: 'up-to-date', current: '50.0.0' });
    expect(download).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it('si falla la descarga lo explica con el detalle', async () => {
    const download = vi.fn().mockRejectedValue(new Error('boom-42'));
    const set = vi.fn();
    installCapacitor(true, { download, set, current: vi.fn().mockResolvedValue({ bundle: { version: '1.0.0' } }) });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: '51.0.0', url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r.kind).toBe('error');
    if (r.kind === 'error') {
      expect(r.message).toContain('51.0.0');
      expect(r.message).toContain('descarga');
      expect(r.message).toContain('boom-42');
    }
    expect(set).not.toHaveBeenCalled();
  });

  it('si falla la activación lo explica con el detalle', async () => {
    const download = vi.fn().mockResolvedValue({ id: 'b9' });
    const set = vi.fn().mockRejectedValue(new Error('reload failed'));
    installCapacitor(true, { download, set, current: vi.fn().mockResolvedValue({ bundle: { version: '1.0.0' } }) });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ version: '52.0.0', url: 'https://x/latest.zip' })));
    const r = await checkForUpdate();
    expect(r.kind).toBe('error');
    if (r.kind === 'error') {
      expect(r.message).toContain('52.0.0');
      expect(r.message).toContain('activar');
      expect(r.message).toContain('reload failed');
    }
  });
});
