import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName } from '../lib/sync';
import { Modal } from '../ui';

export function JoinModal({ onClose }: { onClose: () => void }) {
  const { join, toast } = useStore();
  const myName = syncName();
  const [name, setName] = useState(myName === 'Trabajador' ? '' : myName);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    if (!pin.trim()) return toast('Escribe el código.');
    if (name.trim()) syncSetName(name.trim());
    setBusy(true);
    try {
      await join(pin.trim());
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2>Unirme a una tienda</h2>
      <div className="field"><label>Tu nombre</label>
        <input id="sync-name" maxLength={30} placeholder="Cómo te llaman tus compañeros" value={name} onChange={(e) => setName(e.target.value)} autoFocus={myName === 'Trabajador'} />
      </div>
      <div className="field"><label>¿Tienes el código de tu tienda?</label>
        <input id="sync-pin" maxLength={30} placeholder="Código compartido" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus={myName !== 'Trabajador'} />
      </div>
      <p className="muted">Pega el código que te dio quien creó la tienda. Sus productos y ventas aparecerán aquí.</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancelar</button>
        <button className="button primary" onClick={submit} disabled={busy}>{busy ? 'Vinculando…' : 'Vincular'}</button>
      </div>
    </Modal>
  );
}