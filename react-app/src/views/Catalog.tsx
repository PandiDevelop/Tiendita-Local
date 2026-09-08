import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useStore } from '../store';
import { money, esc, inventorySold, setCategoryPricing, reorderCategoryProducts, groupedByCategory, storeCats, toEditablePromos, fromEditablePromos, uid, DEFAULT_PRODUCT_IMAGE } from '../lib/core';
import type { EditablePromo } from '../lib/core';
import { Image, Modal } from '../ui';
import type { Product } from '../types';

interface CatModalState {
  mode: 'new' | 'edit';
  name: string;
  price: string;
  cost: string;
  promos: EditablePromo[];
}

export function Catalog() {
  const { store, state, replace, setModal, setModalArg, toast } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const inv = s.inventory || {};
  const [catModal, setCatModal] = useState<CatModalState | null>(null);

  // Orden de categorias/productos mientras se arrastran (solo visual hasta
  // soltar); se limpia al terminar el arrastre, momento en el que se guarda
  // el orden final en la tienda.
  const [catDragOrder, setCatDragOrder] = useState<string[] | null>(null);
  const [draggingCat, setDraggingCat] = useState<string | null>(null);
  const [prodDrag, setProdDrag] = useState<{ cat: string; order: string[]; pid: string } | null>(null);

  const groups = groupedByCategory(s);

  // Orden de categorias a mostrar: el de siempre, salvo que haya un arrastre
  // en curso, en cuyo caso se usa el orden temporal (Sin categoría siempre
  // queda al final, no se puede mover).
  const realNames = groups.filter((g) => g.name !== 'Sin categoría').map((g) => g.name);
  const byName = new Map(groups.map((g) => [g.name, g]));
  const displayOrder = catDragOrder && catDragOrder.length === realNames.length ? catDragOrder : realNames;
  const orderedGroups = displayOrder.map((n) => byName.get(n)).filter((g): g is typeof groups[number] => !!g);
  if (byName.has('Sin categoría')) orderedGroups.push(byName.get('Sin categoría')!);

  function catOpen(cat: string) {
    return !state.openCats || !state.openCats[s.id] || state.openCats[s.id][cat] !== false;
  }
  function toggleCat(cat: string) {
    replace((d) => {
      d.openCats = d.openCats || {};
      d.openCats[s.id] = d.openCats[s.id] || {};
      d.openCats[s.id][cat] = !catOpen(cat);
    });
  }
  function addCategory() {
    setCatModal({ mode: 'new', name: '', price: '', cost: '', promos: [] });
  }
  function editCategoryPrice(cat: string) {
    const cp = s.categoryPricing && s.categoryPricing[cat];
    setCatModal({
      mode: 'edit',
      name: cat,
      price: cp ? String(cp.price) : '',
      cost: cp && cp.cost != null ? String(cp.cost) : '',
      promos: toEditablePromos(cp?.promos),
    });
  }
  function saveCatModal() {
    if (!catModal) return;
    const v = catModal.name.trim();
    if (!v) { setCatModal(null); return; }
    if (catModal.mode === 'new' && storeCats(s).includes(v)) { toast('Esa categoría ya existe.'); return; }
    const priceTxt = catModal.price.trim();
    let pr: number | null = null;
    if (priceTxt !== '') {
      pr = Number(priceTxt);
      if (!Number.isFinite(pr) || pr < 0) { toast('Añade un precio válido para la categoría.'); return; }
    } else if (catModal.mode === 'edit') {
      toast('Añade un precio para la categoría.');
      return;
    }
    const costTxt = catModal.cost.trim();
    const cst = costTxt === '' ? 0 : Number(costTxt);
    if (!Number.isFinite(cst) || cst < 0) { toast('Añade un costo válido para la categoría.'); return; }
    const promoList = fromEditablePromos(catModal.promos);
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.categories = st.categories || [];
      if (catModal.mode === 'new') {
        if (!st.categories.includes(v)) st.categories.push(v);
        d.openCats = d.openCats || {};
        d.openCats[s.id] = d.openCats[s.id] || {};
        d.openCats[s.id][v] = true;
      }
      if (pr != null) setCategoryPricing(st, v, pr, cst, promoList);
    });
    setCatModal(null);
    toast(catModal.mode === 'new' ? 'Categoría añadida.' : 'Precio y costo de categoría actualizados en todos sus productos.');
  }

  // Arrastrar para reordenar categorias (agarrando el ⠿ del encabezado).
  // Se usan Pointer Events (no drag & drop nativo) porque el drag & drop de
  // HTML5 no funciona con el dedo en la mayoría de navegadores móviles.
  function startCatDrag(e: ReactPointerEvent, name: string) {
    e.preventDefault();
    e.stopPropagation();
    let order = realNames.slice();
    setCatDragOrder(order);
    setDraggingCat(name);
    const handle = e.currentTarget as HTMLElement;
    try { handle.setPointerCapture(e.pointerId); } catch { /* noop */ }
    const move = (ev: PointerEvent) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const group = el && (el.closest('[data-cat]') as HTMLElement | null);
      const overName = group?.getAttribute('data-cat');
      if (!overName || overName === 'Sin categoría' || overName === name) return;
      const from = order.indexOf(name);
      const to = order.indexOf(overName);
      if (from === -1 || to === -1 || from === to) return;
      const next = order.slice();
      next.splice(from, 1);
      next.splice(to, 0, name);
      order = next;
      setCatDragOrder(next);
    };
    const finish = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', finish);
      document.removeEventListener('pointercancel', finish);
      setDraggingCat(null);
      setCatDragOrder(null);
      replace((d) => {
        const st = d.stores.find((x) => x.id === s.id)!;
        st.categories = order.slice();
      });
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', finish);
    document.addEventListener('pointercancel', finish);
  }

  // Arrastrar para reordenar productos dentro de una categoria.
  function startProdDrag(e: ReactPointerEvent, cat: string, pid: string, list: Product[]) {
    e.preventDefault();
    e.stopPropagation();
    let order = list.map((p) => p.id);
    setProdDrag({ cat, order, pid });
    const handle = e.currentTarget as HTMLElement;
    try { handle.setPointerCapture(e.pointerId); } catch { /* noop */ }
    const move = (ev: PointerEvent) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const row = el && (el.closest('[data-pid]') as HTMLElement | null);
      const overPid = row?.getAttribute('data-pid');
      if (!overPid || overPid === pid) return;
      const from = order.indexOf(pid);
      const to = order.indexOf(overPid);
      if (from === -1 || to === -1 || from === to) return;
      const next = order.slice();
      next.splice(from, 1);
      next.splice(to, 0, pid);
      order = next;
      setProdDrag({ cat, order, pid });
    };
    const finish = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', finish);
      document.removeEventListener('pointercancel', finish);
      setProdDrag(null);
      replace((d) => {
        const st = d.stores.find((x) => x.id === s.id)!;
        reorderCategoryProducts(st, order);
      });
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', finish);
    document.addEventListener('pointercancel', finish);
  }

  return (
    <div className="panel">
      <div className="panel-head"><div><h2>Catálogo de productos</h2><p className="muted">Precios, existencias y promociones de {esc(s.name)}, organizados por categoría. Usa ⠿ para arrastrar y cambiar el orden.</p></div></div>
      <div className="cat-actions">
        <button className="button primary" onClick={addCategory}>＋ Añadir categoría</button>
        <div className="cat-divider"></div>
        <button className="button primary" onClick={() => setModal('newProduct')}>＋ Añadir producto</button>
      </div>
      {s.products.length ? orderedGroups.map((g) => {
        const open = catOpen(g.name);
        const editable = g.name !== 'Sin categoría';
        const list = prodDrag && prodDrag.cat === g.name
          ? prodDrag.order.map((id) => g.list.find((p) => p.id === id)).filter((p): p is Product => !!p)
          : g.list;
        return (
          <div className={'cat-group' + (draggingCat === g.name ? ' dragging' : '')} key={g.name} data-cat={g.name}>
            <div className="cat-head">
              {editable && (
                <button type="button" className="icon-btn drag-handle" title="Arrastrar para reordenar" onPointerDown={(e) => startCatDrag(e, g.name)}>⠿</button>
              )}
              <button className="cat-head-toggle" onClick={() => toggleCat(g.name)}>
                <span className="cat-caret">{open ? '▾' : '▸'}</span><b>{esc(g.name)}</b>
                <span className="muted">· {g.list.length} producto{g.list.length === 1 ? '' : 's'}</span>
              </button>
              {editable && (
                <button className="icon-btn" title="Precio de la categoría" onClick={() => editCategoryPrice(g.name)}>💲</button>
              )}
            </div>
            {open && (
              <div className="cat-body">
                {list.length ? (
                  <table><thead><tr><th></th><th>Producto</th><th>Precio</th><th>Disponible</th><th>Promociones</th><th></th></tr></thead><tbody>
                    {list.map((p) => {
                      const base = inv[p.id];
                      const avail = base == null ? '—' : Math.max(0, base - (sold[p.id] || 0));
                      return (
                        <tr key={p.id} data-pid={p.id} className={prodDrag?.pid === p.id ? 'dragging' : ''}>
                          <td className="drag-cell"><button type="button" className="icon-btn drag-handle" title="Arrastrar para reordenar" onPointerDown={(e) => startProdDrag(e, g.name, p.id, g.list)}>⠿</button></td>
                          <td className="cat-bar"><div className="product-cell"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /><div className="product-name">{esc(p.name)}</div></div></td>
                          <td>{money(p.price)}</td><td>{avail}</td>
                          <td>{p.promos.length ? <div className="promo-stack">{p.promos.map((x) => <span className="promotion" key={x.id}>{esc(x.label)} · {money(x.price)}</span>)}</div> : <span className="muted">—</span>}</td>
                          <td><div className="actions">
                          <button className="icon-btn" title="Editar producto" onClick={() => { setModalArg(p.id); setModal('editProduct'); }}>⚙</button>
                        </div></td>
                        </tr>
                      );
                    })}
                  </tbody></table>
                ) : <div className="notice">Sin productos en esta categoría todavía.</div>}
              </div>
            )}
          </div>
        );
      }) : <div className="empty"><div className="emoji">📦</div><b>Tu catálogo está vacío</b><p>Agrega el primer producto para empezar.</p></div>}

      {catModal && (
        <Modal onClose={() => setCatModal(null)}>
          <h2>{catModal.mode === 'new' ? 'Nueva categoría' : 'Precio de la categoría'}</h2>
          <div className="field"><label>Nombre de la categoría</label>
            <input
              maxLength={30}
              placeholder="Ej. Bebidas"
              value={catModal.name}
              disabled={catModal.mode === 'edit'}
              onChange={(e) => setCatModal((m) => m && { ...m, name: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') saveCatModal(); }}
            />
          </div>
          <div className="field"><label>Precio {catModal.mode === 'new' ? '(opcional)' : ''}</label>
            <input min={0} type="number" placeholder="0" value={catModal.price} onChange={(e) => setCatModal((m) => m && { ...m, price: e.target.value })} />
            <p className="muted">Se aplica a todos los productos de esta categoría. Cada producto se puede editar después para tener un precio distinto.</p>
          </div>
          <div className="field"><label>Costo <span className="muted">(opcional)</span></label>
            <input min={0} type="number" placeholder="0" value={catModal.cost} onChange={(e) => setCatModal((m) => m && { ...m, cost: e.target.value })} />
            <p className="muted">También se copia a todos los productos de la categoría; cada uno se puede editar después para tener un costo distinto.</p>
          </div>
          <div className="field"><label>Promociones <span className="muted">(cada una se vende por separado)</span></label>
            <div id="cat-promo-list">
              {catModal.promos.map((x, n) => (
                <div className="promo-input" key={n}>
                  <input className="promo-label" maxLength={70} placeholder="Nombre de la promoción" value={x.label} onChange={(e) => setCatModal((m) => m && { ...m, promos: m.promos.map((y, i) => i === n ? { ...y, label: e.target.value } : y) })} />
                  <input className="promo-price" min={0} type="number" placeholder="Precio" value={x.price} onChange={(e) => setCatModal((m) => m && { ...m, promos: m.promos.map((y, i) => i === n ? { ...y, price: e.target.value } : y) })} />
                  <button className="icon-btn" onClick={() => setCatModal((m) => m && { ...m, promos: m.promos.filter((_, i) => i !== n) })}>×</button>
                </div>
              ))}
            </div>
            <button className="add-promo" onClick={() => setCatModal((m) => m && { ...m, promos: [...m.promos, { id: uid(), label: '', price: m.price || '0' }] })}>＋ Agregar promoción</button>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setCatModal(null)}>Cancelar</button>
            <button className="button primary" onClick={saveCatModal}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
