import { useStore } from '../store';
import { esc } from '../lib/core';
import { Modal, StoreImage } from '../ui';

// Ventana de selección de tienda: aparece al conectarse a una cuenta que tiene
// más de una tienda, para elegir con cuál entrar. Si la cuenta solo tiene una,
// no se muestra (se entra directo). Ver AuthLanding.
export function StorePicker() {
  const { state, pickStore, closePicker } = useStore();
  return (
    <Modal onClose={closePicker} modalClassName="store-picker-modal">
      <h2>Elige una tienda</h2>
      <p className="muted">Tu cuenta tiene varias tiendas. Elige con cuál quieres entrar.</p>
      <div className="store-picker-list">
        {state.stores.map((s) => (
          <button key={s.id} className="store-picker-item" onClick={() => pickStore(s.id)}>
            <StoreImage src={s.image} cls="store-thumb" alt={'Logo de ' + esc(s.name)} enlarge={false} />
            <span>{esc(s.name)}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
