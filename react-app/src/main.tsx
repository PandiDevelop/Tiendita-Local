import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { applyTheme } from './lib/theme';
import { AppProvider } from './store';
import { App } from './App';

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