import { isNativeApp } from './nativeBack';

// En la app nativa (Capacitor) los plugins solo quedan disponibles en
// window.Capacitor.Plugins si su JS se importa y se "registra" (registerPlugin
// de @capacitor/core). El resto del código los llama por el global
// (cap.Plugins.App, cap.Plugins.CapacitorUpdater...), así que hay que cargar
// los plugins que la app usa nativamente AQUÍ, al arrancar. Los imports son
// dinámicos y solo corren en la app para no meterlos en la PWA (navegador),
// donde no existen y no deben ejecutarse.
export async function initNativePlugins(): Promise<void> {
  if (!isNativeApp()) return;
  try {
    await import('@capacitor/app');
    await import('@capgo/capacitor-updater');
  } catch (e) {
    console.error('No se pudieron cargar los plugins nativos:', e);
  }
}