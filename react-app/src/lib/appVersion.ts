import { useEffect, useState } from 'react';
import { APP_VERSION } from './core';

// La version que muestra la app es la del service worker que de verdad esta
// activo (ver public/sw.js): asi el numero refleja lo que esta desplegado y
// solo cambia cuando la actualizacion llega a este dispositivo (no cuando
// alguien olvida subir una constante). APP_VERSION es solo el valor de
// arranque: en cuanto el SW responde (o toma el control en el proximo
// arranque) se pisa con la real.
const CACHE_KEY = 'mt_app_version';

function current(): string {
  try { const v = localStorage.getItem(CACHE_KEY); if (v) return v; } catch { /* ignorar */ }
  return APP_VERSION;
}

function save(v: string): void {
  const s = String(v || '').trim();
  if (!s) return;
  try { localStorage.setItem(CACHE_KEY, s); } catch { /* ignorar */ }
}

function askSwVersion(): Promise<string> {
  const sw = 'serviceWorker' in navigator ? navigator.serviceWorker?.controller : null;
  if (!sw || typeof MessageChannel === 'undefined') return Promise.resolve(APP_VERSION);
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    const t = window.setTimeout(() => resolve(APP_VERSION), 1200);
    ch.port1.onmessage = (e) => {
      window.clearTimeout(t);
      resolve(String(e.data || APP_VERSION));
    };
    try { sw.postMessage({ type: 'MT_VERSION' }, [ch.port2]); }
    catch { window.clearTimeout(t); resolve(APP_VERSION); }
  });
}

export function useAppVersion(): string {
  const [v, setV] = useState<string>(() => current());
  useEffect(() => {
    let live = true;
    const got = (nv: string) => { if (live && nv) { setV(nv); save(nv); } };
    askSwVersion().then(got);
    // Si el SW activo cambia (el navegador instala/activa uno nuevo por un
    // despliegue), la version se actualiza sola sin recargar la pagina.
    const onCtrl = () => { askSwVersion().then(got); };
    navigator.serviceWorker?.addEventListener('controllerchange', onCtrl);
    return () => { live = false; navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl); };
  }, []);
  return v;
}