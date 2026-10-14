// En la app nativa (Capacitor) se le avisa al plugin capacitor-updater que la
// version cargada arranco bien (notifyAppReady). Si este aviso no llega, el
// plugin revierte al ultimo bundle bueno. En el navegador (PWA) no hace nada.
type UpdaterPlugin = {
  notifyAppReady?: () => Promise<void>;
};
type CapgoGlobal = {
  isNativePlatform?: () => boolean;
  isNative?: boolean;
  Plugins?: { CapacitorUpdater?: UpdaterPlugin };
};

function plugin(): UpdaterPlugin | undefined {
  const cap = (globalThis as unknown as { Capacitor?: CapgoGlobal }).Capacitor;
  if (!cap) return undefined;
  const native = typeof cap.isNativePlatform === 'function' ? cap.isNativePlatform() : !!cap.isNative;
  if (!native) return undefined;
  return cap.Plugins?.CapacitorUpdater;
}

// El plugin IGNORA (no rechaza) un notifyAppReady que llega antes de que su
// "guard" de generacion envuelva window.Capacitor.nativePromise; si se ignora,
// al pasar el timeout el plugin revierte el bundle (y activar un OTA falla).
// Reintentar es inofensivo (semaphoreDown se salta si no hay espera pendiente)
// y cubre esa carrera, ademas del caso de que el plugin tarde en estar listo.
export function initCapUpdater(attempt = 0): void {
  const updater = plugin();
  if (!updater || typeof updater.notifyAppReady !== 'function') {
    if (attempt < 10) window.setTimeout(() => initCapUpdater(attempt + 1), 300);
    return;
  }
  notifyReady(5);
}

function notifyReady(remaining: number): void {
  const updater = plugin();
  if (!updater || typeof updater.notifyAppReady !== 'function') return;
  updater.notifyAppReady().catch(() => {});
  if (remaining > 0) window.setTimeout(() => notifyReady(remaining - 1), 1000);
}
