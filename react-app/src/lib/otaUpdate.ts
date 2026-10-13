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
//
// Ademas del intento silencioso, checkForUpdate() permite disparar la
// comprobacion a mano (desde Ajustes) y DEVUELVE que paso, para poder
// diagnosticar en el propio telefono por que no llegaba una version.

import { APP_VERSION } from './version';
import { isNativeApp } from './nativeBack';

type Updater = {
  download?: (opts: { url: string; version: string }) => Promise<{ id: string }>;
  set?: (opts: { id: string }) => Promise<void>;
  reload?: () => Promise<void>;
};
type ReadyUpdater = {
  download: (opts: { url: string; version: string }) => Promise<{ id: string }>;
  set: (opts: { id: string }) => Promise<void>;
  reload: () => Promise<void>;
};
type CapgoGlobal = {
  isNativePlatform?: () => boolean;
  isNative?: boolean;
  Plugins?: { CapacitorUpdater?: Updater; App?: { addListener?: (event: string, cb: (s: { isActive?: boolean }) => void) => void } };
};

const LATEST_URL = 'https://pandidevelop.github.io/Tiendita-Local/bundles/latest.json';

type LatestBundle = { version?: string; url?: string };

// Resultado de una comprobacion de actualizacion (para el aviso de Ajustes).
export type UpdateCheckResult =
  | { kind: 'unsupported' } // navegador: la PWA se actualiza sola
  | { kind: 'up-to-date'; current: string } // ya estamos al dia
  | { kind: 'updated'; version: string } // se descargo y se va a aplicar (recarga)
  | { kind: 'busy' } // ya habia una comprobacion en curso
  | { kind: 'error'; message: string }; // fallo (red, servidor o plugin)

function cmpVersions(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function getCapacitor(): CapgoGlobal | undefined {
  return (globalThis as unknown as { Capacitor?: CapgoGlobal }).Capacitor;
}

function getUpdater(): ReadyUpdater | null {
  const updater = getCapacitor()?.Plugins?.CapacitorUpdater;
  if (!updater?.download || !updater.set || !updater.reload) return null;
  return updater as ReadyUpdater;
}

let checking = false;
let lastCheck = 0;
let appliedVersion = '';

async function runCheck(): Promise<UpdateCheckResult> {
  if (!isNativeApp()) return { kind: 'unsupported' };
  if (checking) return { kind: 'busy' };
  checking = true;
  try {
    let res: Response;
    try {
      res = await fetch(LATEST_URL, { cache: 'no-store' });
    } catch {
      return { kind: 'error', message: 'no se pudo conectar con el servidor' };
    }
    if (!res.ok) return { kind: 'error', message: 'el servidor respondió ' + res.status };

    let latest: LatestBundle;
    try {
      latest = (await res.json()) as LatestBundle;
    } catch {
      return { kind: 'error', message: 'la respuesta del servidor no se pudo leer' };
    }
    if (!latest.version || !latest.url) return { kind: 'error', message: 'la respuesta del servidor está incompleta' };
    if (cmpVersions(latest.version, APP_VERSION) <= 0) return { kind: 'up-to-date', current: APP_VERSION };
    if (appliedVersion === latest.version) return { kind: 'up-to-date', current: latest.version };

    const updater = getUpdater();
    if (!updater) return { kind: 'error', message: 'hay una versión nueva (' + latest.version + ') pero el actualizador aún no está listo' };

    try {
      const { id } = await updater.download({ url: latest.url, version: latest.version });
      await updater.set({ id });
      // set() ya aplica y recarga; el reload es idempotente por si el primer
      // set no llego a recargar.
      appliedVersion = latest.version;
      await updater.reload?.();
      return { kind: 'updated', version: latest.version };
    } catch {
      return { kind: 'error', message: 'se encontró la versión ' + latest.version + ' pero no se pudo aplicar' };
    }
  } finally {
    checking = false;
  }
}

function trigger(): void {
  const now = Date.now();
  if (now - lastCheck < 8000) return;
  lastCheck = now;
  void runCheck();
}

// Comprobacion manual (Ajustes): no aplica el throttle entre intentos y
// devuelve el resultado para poder mostrarlo.
export function checkForUpdate(): Promise<UpdateCheckResult> {
  lastCheck = Date.now();
  return runCheck();
}

function initOtaUpdate(attempt = 0): void {
  if (!isNativeApp()) return;

  if (!getUpdater()) {
    // El plugin puede tardar un instante en estar listo; reintenta un poco.
    if (attempt < 15) window.setTimeout(() => initOtaUpdate(attempt + 1), 300);
    return;
  }

  trigger();
  window.setInterval(trigger, 60_000);
  try {
    getCapacitor()?.Plugins?.App?.addListener?.('appStateChange', (s) => { if (s.isActive) window.setTimeout(trigger, 1500); });
  } catch { /* plugin App ausente: no es crítico */ }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') window.setTimeout(trigger, 1500);
  });
}

export { initOtaUpdate };
