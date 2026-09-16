import { useState } from 'react';
import { useStore } from '../store';
import { storeTags, insertTagSorted, renameStoreTag, removeStoreTag } from '../lib/core';
import { Modal, CloseIcon, SaveIcon } from '../ui';

interface Props {
  // Solo para editar: la etiqueta cuyo nombre se cambia (o se borra).
  mode: 'new' | 'edit';
  tagName?: string;
  onClose: () => void;
}

// Editor de etiquetas de la tienda: crea una nueva (se agrega a la lista de
// sugerencias del Catálogo y del formulario de producto) o edita/borra una
// existente. Solo tiene nombre: a diferencia de una categoría no hay precio ni
// costo base, la etiqueta es un índice para agrupar productos.
export function TagModal({ mode, tagName, onClose }: Props) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [name, setName] = useState(tagName || '');

  function save() {
    const v = name.trim();
    if (!v) { onClose(); return; }
    if (storeTags(s).some((t) => t !== tagName && t === v)) { toast('Esa etiqueta ya existe.'); return; }
    const wasNew = mode === 'new';
    const from = tagName;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (wasNew) insertTagSorted(st, v);
      else if (from) renameStoreTag(st, from, v);
    });
    onClose();
    toast(wasNew ? 'Etiqueta añadida.' : 'Etiqueta actualizada.');
  }

  function remove() {
    if (mode !== 'edit' || !tagName) return;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      removeStoreTag(st, tagName);
    });
    onClose();
    toast('Etiqueta eliminada.');
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cancelar" aria-label="Cancelar" onClick={onClose}><CloseIcon size={15} /></button>
        <button type="button" className="icon-btn float-save" title="Guardar" aria-label="Guardar" onClick={save}><SaveIcon size={15} /></button>
      </div>
      <h2>{mode === 'new' ? 'Nueva etiqueta' : 'Editar etiqueta'}</h2>
      <div className="field"><label>Nombre de la etiqueta</label>
        <input
          maxLength={30}
          placeholder="Ej. oferta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
        <p className="muted">Se usa para agrupar productos; solo se aplica al guardar un producto con esa etiqueta.</p>
      </div>
      <div className="field">
        {mode === 'edit' && (
          <button type="button" className="button danger" onClick={remove}>Eliminar etiqueta</button>
        )}
      </div>
    </Modal>
  );
}