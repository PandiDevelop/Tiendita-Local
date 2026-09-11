// Instalacion de la app como si fuera una app nativa (PWA instalada). La app
// siempre se puede instalar desde el navegador (el icono de instalar de la barra
// de Chrome), pero ademas ofrecemos el boton "Instalar la app" en Opciones: el
// evento beforeinstallprompt permite lanzar el cuadro de instalacion desde
// nuestro propio boton si el navegador lo permite.
import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone(): boolean {
  return !!(typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
}

export function useInstallable(): { ready: boolean; installed: boolean; install: () => void } {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(isStandalone);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setReady(true);
    };
    const onInstalled = () => {
      setDeferred(null);
      setReady(false);
      setInstalled(true);
    };
    const onDisplay = () => setInstalled(isStandalone());
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if ('matchMedia' in window) {
      const mql = window.matchMedia('(display-mode: standalone)');
      if (mql.addEventListener) mql.addEventListener('change', onDisplay);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      if ('matchMedia' in window) {
        const mql = window.matchMedia('(display-mode: standalone)');
        if (mql.removeEventListener) mql.removeEventListener('change', onDisplay);
      }
    };
  }, []);

  function install() {
    if (!deferred) return;
    void deferred.prompt();
    setDeferred(null);
    setReady(false);
  }

  return { ready, installed, install };
}