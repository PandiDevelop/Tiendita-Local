import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName } from '../lib/sync';
import { Modal, CloseIcon } from '../ui';

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
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cerrar" aria-label="Cerrar" onClick={onClose}><CloseIcon size={15} /></button>
      </div>
      <h2>Unirme a una tienda</h2>
      <div className="field"><label>Tu nombre</label>
        <input id="sync-name" maxLength={30} placeholder="Cómo te llaman tus compañeros" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field"><label>¿Tienes el código de tu tienda?</label>
        <input id="sync-pin" maxLength={6} autoCapitalize="characters" autoCorrect="off" spellCheck={false} placeholder="Código de 6 caracteres" value={pin} onChange={(e) => setPin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} />
      </div>
      <p className="muted">Pega el código que te dieron y verás la tienda aquí.</p>
      <div className="modal-actions">
        <button className="button primary" onClick={submit} disabled={busy}>{busy ? 'Vinculando…' : 'Vincular'}</button>
      </div>
    </Modal>
  );
}