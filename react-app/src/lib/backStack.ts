// El botón ATRÁS del celular (o el gesto de volver) no debe cerrar la app
// entera de una: si hay alguna ventana abierta encima (modal, hilo, catálogo
// virtual, diálogo, foto en grande, menú lateral...) el "atrás" debe cerrar
// primero esa ventana, y solo cuando ya no quede ninguna, salir de la app.
//
// Cada ventana llama a pushOverlay(close) mientras está abierta y devuelve un
// cleanup para cuando se cierra. Mientras haya ventanas se mantiene una
// entrada sintética en el historial del navegador (pushState sin URL nueva):
// así el "atrás" dispara un evento popstate que este módulo usa para cerrar
// la ventana de encima, en vez de que el navegador navegue para fuera. Cuando
// se cierra la última ventana (por botón X, por tocar afuera, o por el
// "atrás" mismo) la entrada sintética se descarta y el "atrás" siguiente ya
// sale de la app con normalidad.

const ENTRY = { __mtOverlay: true };
const stack: Array<{ id: string; close: () => void }> = [];
let seq = 0;

function realUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}

function syncHistory(): void {
  if (!stack.length) {
    if (history.state && history.state.__mtOverlay) history.replaceState(null, '', realUrl());
    return;
  }
  if (!(history.state && history.state.__mtOverlay)) history.pushState(ENTRY, '');
}

// Registra una ventana abierta. Devuelve el cleanup para llamarlo al cerrar
// (se puede usar directo como retorno de un useEffect).
export function pushOverlay(close: () => void): () => void {
  const id = 'ov' + (++seq);
  const wasEmpty = stack.length === 0;
  stack.push({ id, close });
  if (wasEmpty) syncHistory();
  return () => popOverlay(id);
}

function popOverlay(id: string): void {
  const i = stack.findIndex((o) => o.id === id);
  if (i === -1) return;
  stack.splice(i, 1);
  syncHistory();
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    const top = stack.pop();
    if (!top) return; // sin ventanas abiertas: el atrás sale de la app, normal
    syncHistory();
    try { top.close(); } catch { /* la ventana ya se cerró sola */ }
  });
}