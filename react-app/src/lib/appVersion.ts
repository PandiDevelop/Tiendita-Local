import { useEffect, useState } from 'react';
import { APP_VERSION } from './core';

// La version que se muestra es, como minimo, la de esta compilacion
// (APP_VERSION, que queda grabada en el index.html de cada despliegue), asi
// el numero del menu siempre refleja lo que esta desplegado. Si el service
// worker activo responde con otra (la real de public/sw.js), se pisa con esa
// y se refresca sola cuando el navegador activa uno nuevo o la pestanya vuelve
// a primer plano, sin que nadie tenga que recargar la pagina.

function askSwVersion(): Promise<string> {
  const sw = navigator.serviceWorker?.controller;
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
  const [v, setV] = useState<string>(APP_VERSION);
  useEffect(() => {
    let live = true;
    const got = (nv: string) => {
      if (!live || !nv) return;
      setV((prev) => (prev === nv ? prev : nv));
    };
    const check = () => { askSwVersion().then(got); };
    check();
    const onCtrl = check;
    const onVis = () => { if (document.visibilityState === 'visible') check(); };
    navigator.serviceWorker?.addEventListener('controllerchange', onCtrl);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      live = false;
      navigator.serviceWorker?.removeEventListener('controllerchange', onCtrl);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return v;
}