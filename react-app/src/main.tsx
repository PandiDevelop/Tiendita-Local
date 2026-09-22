import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { applyTheme } from './lib/theme';
import { AppProvider } from './store';
import { App } from './App';
import { initAccountAuth } from './lib/account';
import { initNativeBack } from './lib/nativeBack';
import { initCapUpdater } from './lib/capUpdater';
import { initOtaUpdate } from './lib/otaUpdate';

// Se aplica el tema guardado (o el automático del teléfono) antes del primer
// render, para que no haya un "destello" con el tema por defecto.
applyTheme();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);

// Restaura la sesión de Firebase Auth si este navegador ya tenía una (para
// que la identidad vuelva a ser la de la cuenta). No bloquea el arranque.
initAccountAuth().catch(() => {});

// En la app nativa, conecta el botón/gesto atrás con las ventanas abiertas
// para que no cierre la app a la primera.
initNativeBack();

// En la app nativa, avisa al plugin de updates que la versión cargada arrancó
// bien (para el rollback OTA). En el navegador no hace nada.
initCapUpdater();

// En la app nativa, revisa si hay un bundle más nuevo en el GitHub Pages
// propio y lo aplica en silencio (OTA gratis, sin servicio externo).
initOtaUpdate();