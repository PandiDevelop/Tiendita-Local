import { useState } from 'react';
import { useStore } from '../store';
import { storeTags, insertTagSorted, renameStoreTag, removeStoreTag, esc } from '../lib/core';
import { Modal, CloseIcon } from '../ui';

interface Props {
  onClose: () => void;
}

// Ventana de etiquetas de la tienda: arriba un campo para escribir y agregar
// una etiqueta nueva (Enter o el botón); abajo, las existentes se muestran
// como los cuadritos redondeados de los productos. Tocar el texto de un chip
// lo deja en modo renombrar; la x lo borra. Se aplica todo al momento, por eso
// solo lleva el botón de cerrar (X).
export function TagModal({ onClose }: Props) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [draft, setDraft] = useState('');
  // Etiqueta cuyo nombre se está renombrando dentro de su chip.
  const [renameTag, setRenameTag] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  function add() {
    const v = draft.trim();
    if (!v) return;
    if (storeTags(s).some((t) => t === v)) { toast('Esa etiqueta ya existe.'); return; }
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      insertTagSorted(st, v);
    });
    setDraft('');
    toast('Etiqueta añadida.');
  }

  function commitRename() {
    if (renameTag === null) return;
    const v = renameVal.trim();
    if (v && v !== renameTag) {
      if (storeTags(s).some((t) => t !== renameTag && t === v)) {
        toast('Esa etiqueta ya existe.');
      } else {
        replace((d) => {
          const st = d.stores.find((x) => x.id === s.id)!;
          renameStoreTag(st, renameTag, v);
        });
      }
    }
    setRenameTag(null);
  }

  function remove(t: string) {
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      removeStoreTag(st, t);
    });
    toast('Etiqueta eliminada.');
  }

  const tags = storeTags(s);
  return (
    <Modal onClose={onClose}>
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cerrar" aria-label="Cerrar" onClick={onClose}><CloseIcon size={15} /></button>
      </div>
      <h2>Etiquetas de la tienda</h2>
      <div className="field"><label>Nueva etiqueta</label>
        <div className="tag-add-row">
          <input
            maxLength={30}
            placeholder="Ej. oferta"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          />
          <button type="button" className="button primary" onClick={add}>Agregar</button>
        </div>
        <p className="muted">Las etiquetas salen al escribir en un producto para agruparlos.</p>
      </div>
      <div className="field"><label>Etiquetas de la tienda</label>
        {tags.length ? (
          <div className="tag-chips tag-manager-chips">
            {tags.map((t) => (
              renameTag === t ? (
                <input
                  key={'r:' + t}
                  className="tag-rename"
                  maxLength={30}
                  autoFocus
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename();
                    if (e.key === 'Escape') setRenameTag(null);
                  }}
                />
              ) : (
                <span className="tag-chip" key={t}>
                  <button type="button" className="tag-chip-label" title="Renombrar" onClick={() => { setRenameTag(t); setRenameVal(t); }}>{esc(t)}</button>
                  <button type="button" title={'Quitar ' + t} aria-label={'Quitar ' + t} onClick={() => remove(t)}>×</button>
                </span>
              )
            ))}
          </div>
        ) : <p className="muted">Todavía no hay etiquetas. Crea la primera arriba.</p>}
      </div>
    </Modal>
  );
}