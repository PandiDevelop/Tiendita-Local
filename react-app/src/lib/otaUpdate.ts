// Actualizacion OTA sin servicio externo (gratis). En la app nativa
// (Capacitor) se revisa bundles/latest.json del GitHub Pages propio; si ahi
// hay un bundle con version mas nueva que la compilada (APP_VERSION), se
// descarga el zip y se aplica con el plugin @capgo/capacitor-updater. En el
// navegador (PWA) no hace nada: la PWA ya se actualiza sola con el service
// worker.
import { APP_VERSION } from './version';

type Updater = {
  download?: (opts: { url: string; version: string }) => Promise<{ id: string }>;
  set?: (opts: { id: string }) => Promise<void>;
  reload?: () => Promise<void>;
};
type CapgoGlobal = {
  isNativePlatform?: () => boolean;
  isNative?: boolean;
  Plugins?: { CapacitorUpdater?: Updater };
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
    if (attempt < 10) window.setTimeout(() => initOtaUpdate(attempt + 1), 300);
    return;
  }

  void (async () => {
    try {
      const res = await fetch(LATEST_URL, { cache: 'no-store' });
      if (!res.ok) return;
      const latest = (await res.json()) as LatestBundle;
      if (!latest.version || !latest.url) return;
      if (cmpVersions(latest.version, APP_VERSION) <= 0) return;

      const { id } = await download({ url: latest.url, version: latest.version });
      await set({ id });
      await reload();
    } catch {
      // Silencioso: si no hay red o algo falla, se continua con la version actual.
    }
  })();
}

export { initOtaUpdate };