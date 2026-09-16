import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_TAG, esc, compressImage, storeCats, adoptInvLog, setCategoryPricing, insertProductAlphabetically, insertCatSorted, toEditablePromos, fromEditablePromos, uid, syncClientId, syncName, productTags, nextSuppTag, recordSupplierPrice, setSupplierCost, ensureCost } from '../lib/core';
import { notifyStorePush } from '../lib/push';
import type { EditablePromo } from '../lib/core';
import { ImagePicker, Modal, CategorySuggest, SaveIcon, CloseIcon } from '../ui';
import { PromoEditor } from './PromoEditor';

export function ProductForm({ editingId, onClose }: { editingId?: string; onClose: () => void }) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const p = editingId ? s.products.find((x) => x.id === editingId) : undefined;
  const cats = storeCats(s);
  const [cat, setCat] = useState((p?.category || '').trim());
  const [name, setName] = useState(p?.name || '');
  const [price, setPrice] = useState(p?.price != null ? String(p.price) : '');
  const [cost, setCost] = useState(p?.cost != null ? String(p.cost) : '');
  const [supplier, setSupplier] = useState(p?.supplier || '');
  const [image, setImage] = useState(p?.image || '');
  const [qty, setQty] = useState('');
  const [promos, setPromos] = useState<EditablePromo[]>(toEditablePromos(p?.promos));
  // Los tags son opcionales y editables (hasta 3). En un producto nuevo el
  // area arranca vacia con "General" como texto fantasma; si se guarda sin
  // ninguno se agrega automaticamente el tag por defecto.
  const [tags, setTags] = useState<string[]>(editingId ? productTags(p) : []);
  const [tagDraft, setTagDraft] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  // Aviso transitorio "Max. 3 etiquetas por producto." que aparece sobre el
  // cuadro de tags unos segundos cuando se intenta agregar una cuarta (en
  // vez de un texto fijo que estorba siempre o una ventana de confirmación).
  const [tagLimitNote, setTagLimitNote] = useState(false);
  const tagTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (tagTimer.current) clearTimeout(tagTimer.current); }, []);

  // Tags que ya se usan: los de la lista de la tienda (botón "Etiqueta" del
  // Catálogo) más los de los productos, para sugerirlos al escribir (se puede
  // escribir uno nuevo o elegir uno existente con un clic). La lista sale
  // siempre que el campo tiene el foco, aunque ya se haya elegido un tag, y en
  // orden alfabetico.
  const existingTags = [...new Set([...(s.tags || []), ...s.products.flatMap((x) => productTags(x))])];
  const q = tagDraft.trim().toLowerCase();
  const tagMatches = existingTags
    .filter((t) => !tags.includes(t) && (!q || t.toLowerCase().includes(q)))
    .sort((a, b) => a.localeCompare(b, 'es'));

  function flashTagLimit() {
    setTagLimitNote(true);
    if (tagTimer.current) clearTimeout(tagTimer.current);
    tagTimer.current = setTimeout(() => setTagLimitNote(false), 2500);
  }

  function commitTag(raw: string) {
    const t = raw.trim();
    if (!t) return;
    if (tags.includes(t)) { setTagDraft(''); setTagOpen(false); return; }
    if (tags.length >= 3) { flashTagLimit(); setTagDraft(''); return; }
    setTags((arr) => [...arr, t]);
    setTagDraft('');
    setTagOpen(false);
  }

  function onFile(f: File | undefined) {
    if (!f) return;
    compressImage(f).then((data) => setImage(data));
  }

  function save() {
    const nm = name.trim();
    const pr = Number(price);
    const costTxt = cost.trim();
    const cst = costTxt === '' ? 0 : Number(costTxt);
    const sup = supplier.trim();
    if (!nm) return toast('Escribe el nombre del producto.');
    if (!Number.isFinite(pr) || pr < 0) return toast('Añade un precio válido.');
    if (!Number.isFinite(cst) || cst < 0) return toast('Añade un costo válido.');
    const catVal = cat.trim();
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
      if (catVal) insertCatSorted(st, catVal);
      if (shouldSeedPricing) setCategoryPricing(st, catVal, pr, cst, promoList, sup || undefined);
      const tagList = tags.map((t) => t.trim()).filter(Boolean).slice(0, 3);
      const tagsVal = tagList.length ? tagList : !editingId ? [DEFAULT_PRODUCT_TAG] : [];
      const tag0 = tagsVal[0];
      const prodTag = sup ? (cst > 0 ? setSupplierCost(st, sup, cst) : nextSuppTag(st, sup)) : undefined;
      if (editingId) {
        const t = st.products.find((x) => x.id === editingId);
        if (t) Object.assign(t, { name: nm, price: pr, cost: cst, image: image || DEFAULT_PRODUCT_IMAGE, promos: promoList, category: catVal, tags: tagsVal, tag: tag0 || undefined, supplier: sup || undefined, supplierTag: prodTag });
      } else {
        // Un producto nuevo entra en la posicion alfabetica de su categoria
        // (aun si la categoria ya fue reordenada a mano); ver
        // insertProductAlphabetically en lib/core.
        insertProductAlphabetically(st, { id: uid(), by: syncClientId(), name: nm, price: pr, cost: cst, image: image || DEFAULT_PRODUCT_IMAGE, promos: promoList, category: catVal, tags: tagsVal, tag: tag0 || undefined, supplier: sup || undefined, supplierTag: prodTag });
      }
      // Cada costo que se guarda en un producto (con su proveedor) queda en el
      // historial unico de costos: reutiliza el registro si ese costo ya se
      // uso antes, si no lo crea. El costo actual del producto puede cambiar
      // despues sin tocar los costos viejos.
      const prodId = editingId || (st.products.length ? st.products[st.products.length - 1].id : '');
      const cid = sup && cst > 0 && prodId ? ensureCost(st, prodId, sup, cst, prodTag || '') : '';
      if (sup && catVal && !shouldSeedPricing && st.categoryPricing && st.categoryPricing[catVal]) {
        recordSupplierPrice(st, catVal, sup, cst);
      }
      if (!editingId && qty.trim() !== '') {
        const q = Math.round(Number(qty));
        if (Number.isFinite(q) && q >= 0) {
          st.inventory = st.inventory || {};
          const pid = st.products[st.products.length - 1].id;
          adoptInvLog(st, pid, q, 'Catálogo', undefined, undefined, cst > 0 ? cst : undefined, cid);
        }
      }
    });
    if (!editingId && s.syncKey) {
      notifyStorePush(s.syncKey, syncName() + ' creó el producto "' + nm + '"', catVal ? 'Categoría: ' + catVal : 'Nuevo producto en el catálogo', 'producto');
    }
    onClose();
    toast('Producto guardado.');
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cancelar" aria-label="Cancelar" onClick={onClose}><CloseIcon size={15} /></button>
        <button type="button" className="icon-btn float-save" title="Guardar" aria-label="Guardar" onClick={save}><SaveIcon size={15} /></button>
      </div>
      <h2>{editingId ? 'Editar producto' : 'Añadir producto'}</h2>
      <div className="field"><label>Categoría <span className="muted">(opcional)</span></label>
        <CategorySuggest cats={cats} value={cat} onChange={setCat} placeholder="Escribe o elige una categoría" newLabel="Nueva categoría"
          onPick={(c) => {
            setCat(c);
            if (!editingId && c && s.categoryPricing && s.categoryPricing[c]) {
              const cp = s.categoryPricing[c];
              setPrice(String(cp.price));
              setCost(cp.cost != null ? String(cp.cost) : '');
              setSupplier(cp.supplier || '');
              setPromos(toEditablePromos(cp.promos));
            }
          }}
          onNewPick={() => undefined} />
      </div>
      <div className="field"><label>Nombre del producto</label>
        <input maxLength={80} placeholder="Ej. Caja de galletas" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field"><label>Etiqueta / tag <span className="muted">(opcional, hasta 3)</span></label>
        <div className="tag-editor">
          <div className="cat-suggest tag-suggest">
            <input maxLength={30} placeholder={tags.length ? 'Agregar otro tag…' : (editingId ? 'Ej. general' : 'General')} value={tagDraft}
              onChange={(e) => { setTagDraft(e.target.value); setTagOpen(true); }}
              onFocus={() => setTagOpen(true)}
              onClick={() => setTagOpen(true)}
              onBlur={() => { commitTag(tagDraft); setTagOpen(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTag(tagDraft); }
                else if (e.key === 'Backspace' && tagDraft === '' && tags.length) setTags((arr) => arr.slice(0, -1));
              }} />
            {tagOpen && (
              <div className="cat-suggest-list">
                {tagMatches.map((t) => (
                  <button type="button" key={t} onMouseDown={(e) => { e.preventDefault(); commitTag(t); }}>{esc(t)}</button>
                ))}
                {!tagMatches.length && <div className="cat-suggest-empty">No hay más etiquetas disponibles.</div>}
              </div>
            )}
          </div>
          <div className="tag-chips">
            {tags.map((t) => (
              <span className="tag-chip" key={t}>{esc(t)}<button type="button" title={'Quitar ' + t} aria-label={'Quitar ' + t} onClick={() => setTags((arr) => arr.filter((x) => x !== t))}>×</button></span>
            ))}
          </div>
          {tagLimitNote && <p className="tag-limit-note" role="status">Max. 3 etiquetas por producto.</p>}
        </div>
      </div>
      <div className="field"><label>Precio del producto</label>
        <input min={0} type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="field"><label>Costo del producto <span className="muted">(opcional)</span></label>
        <input min={0} type="number" placeholder="0" value={cost} onChange={(e) => setCost(e.target.value)} />
        <p className="muted">Lo que te cuesta. Se usa para la ganancia.</p>
      </div>
      <div className="field"><label>Proveedor <span className="muted">(opcional)</span></label>
        <input maxLength={40} placeholder="Ej. Ceres" value={supplier} onChange={(e) => setSupplier(e.target.value)} onFocus={(e) => e.target.select()} />
        <p className="muted">Quién surte el producto. Su tag corto se suma al guardar.</p>
      </div>
      <div className="field"><label>Imagen del producto</label>
        <ImagePicker id="product-image" src={image || DEFAULT_PRODUCT_IMAGE} cls="image-preview product-preview" hint="Foto o logo opcional del producto." onFile={onFile} />
      </div>
      {!editingId && (
        <div className="field"><label>Cantidad en inventario</label>
          <input min={0} step={1} type="number" inputMode="numeric" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} />
          <p className="muted">Existencias iniciales. Se descuentan con cada venta.</p>
        </div>
      )}
      <div className="field"><label>Promociones <span className="muted">(se aplican solas al vender)</span></label>
        <PromoEditor promos={promos} onChange={setPromos} priceHint={price} />
      </div>
    </Modal>
  );
}