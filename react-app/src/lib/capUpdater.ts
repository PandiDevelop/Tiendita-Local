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

export function initCapUpdater(attempt = 0): void {
  const cap = (globalThis as unknown as { Capacitor?: CapgoGlobal }).Capacitor;
  if (!cap) return;
  const native = typeof cap.isNativePlatform === 'function' ? cap.isNativePlatform() : !!cap.isNative;
  if (!native) return;

  const updater = cap.Plugins?.CapacitorUpdater;
  if (!updater || typeof updater.notifyAppReady !== 'function') {
    // El plugin puede tardar un instante en estar listo; reintenta un poco.
    if (attempt < 10) window.setTimeout(() => initCapUpdater(attempt + 1), 300);
    return;
  }

  updater.notifyAppReady().catch(() => {});
}