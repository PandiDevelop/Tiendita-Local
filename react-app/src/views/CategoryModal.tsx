import { useState } from 'react';
import { useStore } from '../store';
import { insertCatSorted, storeCats, setCategoryPricing, toEditablePromos, fromEditablePromos } from '../lib/core';
import type { EditablePromo } from '../lib/core';
import { Modal } from '../ui';
import { PromoEditor } from './PromoEditor';

interface Props {
  mode: 'new' | 'edit';
  // Solo para editar: la categoria cuya base de precio/costo/promos se cambia.
  catName?: string;
  onClose: () => void;
  // Se llama tras guardar con el nombre de la categoria (creada o editada).
  onSaved?: (name: string) => void;
}

// Editor de la configuracion de una categoria: su nombre (solo al crearla) y
// la base de precio, costo y promociones que se copian a sus productos. Lo
// usan tanto el Catálogo como el Inventario (boton de tuerca en el encabezado
// de cada categoria).
export function CategoryModal({ mode, catName, onClose, onSaved }: Props) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const cp = catName && s.categoryPricing ? s.categoryPricing[catName] : undefined;
  const [name, setName] = useState(catName || '');
  const [price, setPrice] = useState(cp ? String(cp.price) : '');
  const [cost, setCost] = useState(cp && cp.cost != null ? String(cp.cost) : '');
  const [promos, setPromos] = useState<EditablePromo[]>(toEditablePromos(cp?.promos));

  function save() {
    const v = name.trim();
    if (!v) { onClose(); return; }
    if (mode === 'new' && storeCats(s).includes(v)) { toast('Esa categoría ya existe.'); return; }
    const priceTxt = price.trim();
    let pr: number | null = null;
    if (priceTxt !== '') {
      pr = Number(priceTxt);
      if (!Number.isFinite(pr) || pr < 0) { toast('Añade un precio válido para la categoría.'); return; }
    } else if (mode === 'edit') {
      toast('Añade un precio para la categoría.');
      return;
    }
    const costTxt = cost.trim();
    const cst = costTxt === '' ? 0 : Number(costTxt);
    if (!Number.isFinite(cst) || cst < 0) { toast('Añade un costo válido para la categoría.'); return; }
    const promoList = fromEditablePromos(promos);
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (mode === 'new') insertCatSorted(st, v);
      if (pr != null) setCategoryPricing(st, v, pr, cst, promoList);
    });
    onClose();
    toast(mode === 'new' ? 'Categoría añadida.' : 'Precio y costo de categoría actualizados en todos sus productos.');
    if (onSaved && mode === 'new') onSaved(v);
  }

  return (
    <Modal onClose={onClose}>
      <h2>{mode === 'new' ? 'Nueva categoría' : 'Configurar la categoría'}</h2>
      <div className="field"><label>Nombre de la categoría</label>
        <input
          maxLength={30}
          placeholder="Ej. Bebidas"
          value={name}
          disabled={mode === 'edit'}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
      </div>
      <div className="field"><label>Precio {mode === 'new' ? '(opcional)' : ''}</label>
        <input min={0} type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        <p className="muted">Se aplica a todos los productos de esta categoría. Cada producto se puede editar después para tener un precio distinto.</p>
      </div>
      <div className="field"><label>Costo <span className="muted">(opcional)</span></label>
        <input min={0} type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        <p className="muted">También se copia a todos los productos de la categoría; cada uno se puede editar después para tener un costo distinto.</p>
      </div>
      <div className="field"><label>Promociones <span className="muted">(se aplican solas en la venta según su condición)</span></label>
        <PromoEditor promos={promos} onChange={setPromos} priceHint={price} />
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancelar</button>
        <button className="button primary" onClick={save}>Guardar</button>
      </div>
    </Modal>
  );
}