import { hasOverlay } from './backStack';

// El botón atrás del celular (y el gesto de volver). Capacitor no lo maneja
// por sí solo: sin esto, el atrás cierra la Activity de golpe y se sale de la
// app. Cuando corre dentro de la app nativa nos conectamos al plugin App
// (@capacitor/app) para que el atrás cierre primero la ventana de encima
// (modal, formulario de bienvenida, selector de tienda...) y solo salga cuando
// ya no quede ninguna. En el navegador (PWA) esto no hace nada: allí el atrás
// y el popstate nativo ya cierran las ventanas por sí solos.
type BackButtonApp = {
  addListener: (event: string, cb: () => void) => void;
  exitApp?: () => void;
};
type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  isNative?: boolean;
  Plugins?: { App?: BackButtonApp };
};

export function isNativeApp(): boolean {
  const cap = (globalThis as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (!cap) return false;
  return typeof cap.isNativePlatform === 'function' ? cap.isNativePlatform() : !!cap.isNative;
}

export function initNativeBack(attempt = 0): void {
  const cap = (globalThis as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  if (!cap || !isNativeApp()) return;

  const App = cap.Plugins?.App;
  if (!App || typeof App.addListener !== 'function') {
    // El plugin puede tardar un instante en estar listo; reintenta un poco.
    if (attempt < 10) window.setTimeout(() => initNativeBack(attempt + 1), 300);
    return;
  }

  App.addListener('backButton', () => {
    if (hasOverlay()) { window.history.back(); return; }
    App.exitApp?.();
  });
}
