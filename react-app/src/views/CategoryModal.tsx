import { useState } from 'react';
import { useStore } from '../store';
import { insertCatSorted, storeCats, setCategoryPricing, toEditablePromos, fromEditablePromos, esc } from '../lib/core';
import type { EditablePromo } from '../lib/core';
import { Modal, CloseIcon, SaveIcon, CaretIcon } from '../ui';
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
// de cada categoria), y adentro trae una lista colapsable con las categorías
// de la tienda (máximo unas 5 a la vez) para poder saltar a editar cualquiera
// sin cerrar la ventana.
export function CategoryModal({ mode, catName, onClose, onSaved }: Props) {
  const { store, replace, toast } = useStore();
  const s = store!;
  // Categoria que se esta creando/que se esta configurando en este momento.
  // Arranca con la que dijo el boton que la abrio, y cambia al elegir otra en
  // la lista. `isNew` separa "crear" de "editar" sin depender del prop.
  const [editing, setEditing] = useState<string | null>(mode === 'edit' ? (catName || '') : null);
  const [isNew, setIsNew] = useState(mode === 'new');
  const [name, setName] = useState(catName || '');
  const [price, setPrice] = useState(() => {
    const cp = catName && s.categoryPricing ? s.categoryPricing[catName] : undefined;
    return cp ? String(cp.price) : '';
  });
  const [cost, setCost] = useState(() => {
    const cp = catName && s.categoryPricing ? s.categoryPricing[catName] : undefined;
    return cp && cp.cost != null ? String(cp.cost) : '';
  });
  const [supplier, setSupplier] = useState(() => {
    const cp = catName && s.categoryPricing ? s.categoryPricing[catName] : undefined;
    return cp?.supplier || '';
  });
  const [promos, setPromos] = useState<EditablePromo[]>(() => {
    const cp = catName && s.categoryPricing ? s.categoryPricing[catName] : undefined;
    return toEditablePromos(cp?.promos);
  });
  // Lista colapsable de categorías de la tienda (cerrada por defecto).
  const [listOpen, setListOpen] = useState(false);
  const cats = storeCats(s).filter((c) => c !== editing);

  function loadCat(c: string) {
    const cp = s.categoryPricing ? s.categoryPricing[c] : undefined;
    setName(c);
    setPrice(cp ? String(cp.price) : '');
    setCost(cp && cp.cost != null ? String(cp.cost) : '');
    setSupplier(cp?.supplier || '');
    setPromos(toEditablePromos(cp?.promos));
    setEditing(c);
    setIsNew(false);
    setListOpen(false);
  }

  function newCat() {
    setName('');
    setPrice('');
    setCost('');
    setSupplier('');
    setPromos([]);
    setEditing(null);
    setIsNew(true);
    setListOpen(false);
  }

  function save() {
    const v = name.trim();
    if (!v) { onClose(); return; }
    if (storeCats(s).some((c) => c !== editing && c === v)) { toast('Esa categoría ya existe.'); return; }
    const priceTxt = price.trim();
    let pr: number | null = null;
    if (priceTxt !== '') {
      pr = Number(priceTxt);
      if (!Number.isFinite(pr) || pr < 0) { toast('Añade un precio válido para la categoría.'); return; }
    } else if (!isNew) {
      toast('Añade un precio para la categoría.');
      return;
    }
    const costTxt = cost.trim();
    const cst = costTxt === '' ? 0 : Number(costTxt);
    if (!Number.isFinite(cst) || cst < 0) { toast('Añade un costo válido para la categoría.'); return; }
    const promoList = fromEditablePromos(promos);
    const sup = supplier.trim();
    const wasNew = isNew;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (wasNew) {
        insertCatSorted(st, v);
      } else if (editing && v !== editing) {
        // Renombrar: actualiza el nombre en el orden de categorias, en cada
        // producto que la usa y en la base de precio/costo/promos propia.
        st.categories = (st.categories || []).map((c) => (c === editing ? v : c));
        st.products.forEach((t) => { if ((t.category || '').trim() === editing) t.category = v; });
        if (st.categoryPricing && st.categoryPricing[editing]) {
          st.categoryPricing[v] = st.categoryPricing[editing];
          delete st.categoryPricing[editing];
        }
      }
      if (pr != null) {
        setCategoryPricing(st, v, pr, cst, promoList, sup || undefined);
      }
    });
    onClose();
    toast(wasNew ? 'Categoría añadida.' : 'Categoría actualizada.');
    if (onSaved && wasNew) onSaved(v);
  }

  // Quitar una categoría se hace desde la tuerca del Catálogo/Inventario
  // (Eliminar categoría), no desde aquí: esta ventana es solo para
  // crear/configurar, así no hay dos caminos para lo mismo.
  return (
    <Modal onClose={onClose}>
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cancelar" aria-label="Cancelar" onClick={onClose}><CloseIcon size={15} /></button>
        <button type="button" className="icon-btn float-save" title="Guardar" aria-label="Guardar" onClick={save}><SaveIcon size={15} /></button>
      </div>
      <h2>{isNew ? 'Nueva categoría' : 'Configurar la categoría'}</h2>
      <div className="cat-switch">
        <button type="button" className="cat-switch-toggle" onClick={() => setListOpen((o) => !o)}>
          <span>Categorías de la tienda</span>
          <span className="dd-caret"><CaretIcon size={13} deg={listOpen ? 180 : 0} /></span>
        </button>
        {listOpen && (
          <div className="cat-switch-list">
            <button type="button" className="cat-switch-new" onClick={newCat}>＋ Crear una nueva categoría</button>
            {cats.length ? cats.map((c) => (
              <button type="button" key={c} className={editing === c ? 'on' : ''} onClick={() => loadCat(c)}>{esc(c)}</button>
            )) : <div className="cat-suggest-empty">No hay otras categorías.</div>}
          </div>
        )}
      </div>
      <div className="field"><label>Nombre de la categoría</label>
        <input
          maxLength={30}
          placeholder="Ej. Bebidas"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        />
      </div>
      <div className="field"><label>Precio {isNew ? '(opcional)' : ''}</label>
        <input min={0} type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        <p className="muted">Precio por defecto de esta categoría.</p>
      </div>
      <div className="field"><label>Costo <span className="muted">(opcional)</span></label>
        <input min={0} type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        <p className="muted">Costo por defecto de esta categoría.</p>
      </div>
      <div className="field"><label>Proveedor <span className="muted">(opcional)</span></label>
        <input
          maxLength={40}
          placeholder="Ej. Ceres"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          onFocus={(e) => e.target.select()}
        />
        <p className="muted">Quién surte esta categoría. Su tag corto se suma al guardar.</p>
      </div>
      <div className="field"><label>Promociones <span className="muted">(se aplican solas al vender)</span></label>
        <PromoEditor promos={promos} onChange={setPromos} priceHint={price} />
      </div>
    </Modal>
  );
}