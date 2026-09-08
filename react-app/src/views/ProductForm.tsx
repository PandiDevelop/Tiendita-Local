import { useState } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, compressImage, storeCats, adoptInvLog, setCategoryPricing, toEditablePromos, fromEditablePromos, uid } from '../lib/core';
import type { EditablePromo } from '../lib/core';
import { Dropdown } from '../Dropdown';
import { ImagePicker, Modal } from '../ui';

export function ProductForm({ editingId, onClose }: { editingId?: string; onClose: () => void }) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const p = editingId ? s.products.find((x) => x.id === editingId) : undefined;
  const cats = [{ v: '__new__', label: '＋ Añadir categoría' }, { v: '', label: 'Sin categoría' }, ...storeCats(s).map((c) => ({ v: c, label: c }))];
  const [cat, setCat] = useState((p?.category || '').trim());
  const [catNew, setCatNew] = useState('');
  const [name, setName] = useState(p?.name || '');
  const [price, setPrice] = useState(p?.price != null ? String(p.price) : '');
  const [cost, setCost] = useState(p?.cost != null ? String(p.cost) : '');
  const [image, setImage] = useState(p?.image || '');
  const [qty, setQty] = useState('');
  const [promos, setPromos] = useState<EditablePromo[]>(toEditablePromos(p?.promos));

  const showCatNew = cat === '__new__';

  function onFile(f: File | undefined) {
    if (!f) return;
    compressImage(f).then((data) => setImage(data));
  }

  function save() {
    const nm = name.trim();
    const pr = Number(price);
    const costTxt = cost.trim();
    const cst = costTxt === '' ? 0 : Number(costTxt);
    if (!nm) return toast('Escribe el nombre del producto.');
    if (!Number.isFinite(pr) || pr < 0) return toast('Añade un precio válido.');
    if (!Number.isFinite(cst) || cst < 0) return toast('Añade un costo válido.');
    const catVal = showCatNew ? catNew.trim() : cat;
    const promoList = fromEditablePromos(promos);
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.categories = st.categories || [];
      // Antes solo se fijaba el precio/promos base de la categoria cuando
      // esta se creaba en este mismo formulario ("categoria nueva"). Pero
      // una categoria tambien puede existir sin precio todavia (p.ej.
      // creada desde Catalogo dejando el precio en blanco, o vacia): en ese
      // caso el primer producto que se le agregue debe fijar la base igual.
      const catHasNoPricing = !!catVal && !(st.categoryPricing && st.categoryPricing[catVal]);
      const catHasNoOtherProducts = !!catVal && !st.products.some((x) => (x.category || '').trim() === catVal && x.id !== editingId);
      const shouldSeedPricing = catHasNoPricing && catHasNoOtherProducts;
      if (catVal && !st.categories.includes(catVal)) st.categories.push(catVal);
      if (editingId) {
        const t = st.products.find((x) => x.id === editingId);
        if (t) Object.assign(t, { name: nm, price: pr, cost: cst, image: image || DEFAULT_PRODUCT_IMAGE, promos: promoList, category: catVal });
      } else {
        st.products.push({ id: uid(), name: nm, price: pr, cost: cst, image: image || DEFAULT_PRODUCT_IMAGE, promos: promoList, category: catVal });
      }
      if (shouldSeedPricing) setCategoryPricing(st, catVal, pr, cst, promoList);
      if (!editingId && qty.trim() !== '') {
        const q = Math.round(Number(qty));
        if (Number.isFinite(q) && q >= 0) {
          st.inventory = st.inventory || {};
          const pid = st.products[st.products.length - 1].id;
          adoptInvLog(st, pid, q, 'Catálogo');
        }
      }
    });
    onClose();
    toast('Producto guardado.');
  }

  return (
    <Modal onClose={onClose}>
      <h2>{editingId ? 'Editar producto' : 'Añadir producto'}</h2>
      <div className="field"><label>Categoría</label>
        <Dropdown value={cat} ph="Sin categoría" items={cats} onPick={(v) => {
          setCat(v);
          if (v === '__new__') { setCatNew(''); return; }
          if (!editingId && v && s.categoryPricing && s.categoryPricing[v]) {
            const cp = s.categoryPricing[v];
            setPrice(String(cp.price));
            setCost(cp.cost != null ? String(cp.cost) : '');
            setPromos(toEditablePromos(cp.promos));
          }
        }} />
        {showCatNew && <div className="field" style={{ marginTop: 8 }}><input maxLength={30} placeholder="Nombre de la nueva categoría" value={catNew} onChange={(e) => setCatNew(e.target.value)} /></div>}
      </div>
      <div className="field"><label>Nombre del producto</label>
        <input maxLength={80} placeholder="Ej. Caja de galletas" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field"><label>Precio del producto</label>
        <input min={0} type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="field"><label>Costo del producto <span className="muted">(opcional)</span></label>
        <input min={0} type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        <p className="muted">Lo que te cuesta producirlo o comprarlo. Se usa para calcular la ganancia en la sección de Ganancias.</p>
      </div>
      <div className="field"><label>Imagen del producto</label>
        <ImagePicker id="product-image" src={image || DEFAULT_PRODUCT_IMAGE} cls="image-preview product-preview" hint="Foto o logo opcional del producto." onFile={onFile} />
      </div>
      {!editingId && (
        <div className="field"><label>Cantidad en inventario</label>
          <input min={0} step={1} type="number" inputMode="numeric" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} />
          <p className="muted">Se guarda como existencias del producto y se descuenta solo con cada venta. Despues podras ajustarla desde Catalogo o Inventario.</p>
        </div>
      )}
      <div className="field"><label>Promociones <span className="muted">(cada una se vende por separado)</span></label>
        <div id="promo-list">
          {promos.map((x, n) => (
            <div className="promo-input" key={n}>
              <input className="promo-label" maxLength={70} placeholder="Nombre de la promoción" value={x.label} onChange={(e) => setPromos((l) => l.map((y, i) => i === n ? { ...y, label: e.target.value } : y))} />
              <input className="promo-price" min={0} type="number" placeholder="Precio" value={x.price} onChange={(e) => setPromos((l) => l.map((y, i) => i === n ? { ...y, price: e.target.value } : y))} />
              <button className="icon-btn" onClick={() => setPromos((l) => l.filter((_, i) => i !== n))}>×</button>
            </div>
          ))}
        </div>
        <button className="add-promo" onClick={() => setPromos((l) => [...l, { id: uid(), label: '', price: price || '0' }])}>＋ Agregar promoción</button>
      </div>
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancelar</button>
        <button className="button primary" onClick={save}>Guardar producto</button>
      </div>
    </Modal>
  );
}