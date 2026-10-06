// Actualizacion OTA sin servicio externo (gratis). En la app nativa
// (Capacitor) se revisa bundles/latest.json del GitHub Pages propio; si ahi
// hay un bundle con version mas nueva que la compilada (APP_VERSION), se
// descarga el zip y se aplica con el plugin @capgo/capacitor-updater. En el
// navegador (PWA) no hace nada: la PWA ya se actualiza sola con el service
// worker.
//
// El check no corre UNA sola vez al abrir: GitHub Pages cachea ~10 minutos
// (si la app arranca dentro de esa ventana o sin red, el primer intento ve
// una version vieja o falla), y los telefonos suspenden la app en segundo
// plano. Por eso se reintenta: al volver a primer plano (resume del Capacitor
// y visibilitychange) y con un loop cada 1 minuto, hasta que baja.

import { APP_VERSION } from './version';

type Updater = {
  download?: (opts: { url: string; version: string }) => Promise<{ id: string }>;
  set?: (opts: { id: string }) => Promise<void>;
  reload?: () => Promise<void>;
};
type CapgoGlobal = {
  isNativePlatform?: () => boolean;
  isNative?: boolean;
  Plugins?: { CapacitorUpdater?: Updater; App?: { addListener?: (event: string, cb: (s: { isActive?: boolean }) => void) => void } };
};

const LATEST_URL = 'https://pandidevelop.github.io/Tiendita-Local/bundles/latest.json';

type LatestBundle = { version?: string; url?: string };

function cmpVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

let checking = false;
let lastCheck = 0;
let appliedVersion = '';

function trigger(): void {
  const now = Date.now();
  if (now - lastCheck < 8000) return;
  lastCheck = now;
  void applyOnce();
}

async function applyOnce(): Promise<void> {
  if (checking) return;
  checking = true;
  try {
    const res = await fetch(LATEST_URL, { cache: 'no-store' });
    if (!res.ok) return;
    const latest = (await res.json()) as LatestBundle;
    if (!latest.version || !latest.url) return;
    if (cmpVersions(latest.version, APP_VERSION) <= 0) return;
    if (appliedVersion === latest.version) return;

    const cap = (globalThis as unknown as { Capacitor?: CapgoGlobal }).Capacitor;
    const updater = cap?.Plugins?.CapacitorUpdater;
    if (!updater?.download || !updater.set || !updater.reload) return;

    const { id } = await updater.download({ url: latest.url, version: latest.version });
    await updater.set({ id });
    // set() ya aplica y recarga; este reload es idempotente por si el primer
    // set no llego a recargar.
    appliedVersion = latest.version;
    await updater.reload();
  } catch {
    // Silencioso: si no hay red o algo falla, se continua con la version actual.
  } finally {
    checking = false;
  }
}

function initOtaUpdate(attempt = 0): void {
  const cap = (globalThis as unknown as { Capacitor?: CapgoGlobal }).Capacitor;
  if (!cap) return;
  const native = typeof cap.isNativePlatform === 'function' ? cap.isNativePlatform() : !!cap.isNative;
  if (!native) return;

  const updater = cap.Plugins?.CapacitorUpdater;
  const download = updater?.download;
  const set = updater?.set;
  const reload = updater?.reload;
  if (!download || !set || !reload) {
    // El plugin puede tardar un instante en estar listo; reintenta un poco.
    if (attempt < 15) window.setTimeout(() => initOtaUpdate(attempt + 1), 300);
    return;
  }

  trigger();
  window.setInterval(trigger, 60_000);
  try {
    cap.Plugins?.App?.addListener?.('appStateChange', (s) => { if (s.isActive) window.setTimeout(trigger, 1500); });
  } catch { /* plugin App ausente: no es crítico */ }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') window.setTimeout(trigger, 1500);
  });
}

export { initOtaUpdate };