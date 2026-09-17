import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { applyTheme } from './lib/theme';
import { AppProvider } from './store';
import { App } from './App';
import { initAccountAuth } from './lib/account';
import { initNativeBack } from './lib/nativeBack';

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