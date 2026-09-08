// Reemplazo de alert()/confirm() nativos por un dialogo personalizado con el
// mismo look & feel del resto de la app (Modal). No es un componente en si:
// expone funciones que cualquier modulo (incluido lib/sync.ts, que no es un
// componente de React) puede llamar como si fueran alert/confirm, mas un
// pequeno "bus" de suscripcion que el componente DialogHost usa para
// mostrar el mensaje en pantalla y resolver la promesa cuando el usuario
// responde.
export type DialogKind = 'alert' | 'confirm';
export interface DialogRequest {
  id: number;
  kind: DialogKind;
  message: string;
}

type Listener = (req: DialogRequest | null) => void;

let current: DialogRequest | null = null;
let resolver: ((v: boolean) => void) | null = null;
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l(current));
}

export function subscribeDialog(fn: Listener): () => void {
  listeners.add(fn);
  fn(current);
  return () => { listeners.delete(fn); };
}

function open(kind: DialogKind, message: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Si ya hay un dialogo abierto (no deberia pasar en flujo normal),
    // lo resolvemos como cancelado antes de abrir el nuevo.
    if (resolver) { const r = resolver; resolver = null; r(false); }
    current = { id: nextId++, kind, message };
    resolver = resolve;
    emit();
  });
}

// Reemplazo de window.alert(): solo informa, siempre se resuelve al aceptar.
export function customAlert(message: string): Promise<void> {
  return open('alert', message).then(() => undefined);
}

// Reemplazo de window.confirm(): true si el usuario confirma, false si cancela.
export function customConfirm(message: string): Promise<boolean> {
  return open('confirm', message);
}

export function resolveDialog(v: boolean): void {
  if (!resolver) return;
  const r = resolver;
  resolver = null;
  current = null;
  emit();
  r(v);
}
