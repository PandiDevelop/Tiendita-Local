// Pequeño "bus" para mostrar cualquier foto de la app en grande (ver
// producto, tienda, etc.) al tocarla, con el mismo patron que lib/dialog.ts:
// un componente (ImageLightboxHost en ui.tsx) se monta una sola vez y
// escucha, y cualquier <Image> puede abrir la foto en grande sin tener que
// pasar estado por props entre componentes.
type Listener = (src: string | null) => void;

let current: string | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l(current));
}

export function subscribeLightbox(fn: Listener): () => void {
  listeners.add(fn);
  fn(current);
  return () => { listeners.delete(fn); };
}

export function openLightbox(src: string): void {
  if (!src) return;
  current = src;
  emit();
}

export function closeLightbox(): void {
  current = null;
  emit();
}
