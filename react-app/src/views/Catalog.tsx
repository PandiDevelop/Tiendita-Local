import { useState } from 'react';
import { useStore } from '../store';
import { money, esc, inventorySold, setCategoryPricing, uid, DEFAULT_PRODUCT_IMAGE } from '../lib/core';
import { Image, Modal } from '../ui';
import type { Promo } from '../types';

interface CatModalState {
  mode: 'new' | 'edit';
  name: string;
  price: string;
  promos: Promo[];
}

export function Catalog() {
  const { store, state, replace, setModal, setModalArg, toast } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const inv = s.inventory || {};
  const [catModal, setCatModal] = useState<CatModalState | null>(null);

  const storeCats = () => {
    const cats: string[] = [];
    (s.categories || []).forEach((c) => { const v = (c || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
    s.products.forEach((p) => { const v = (p.category || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
    return cats;
  };

  const grouped: Record<string, typeof s.products> = {};
  s.products.forEach((p) => { const c = (p.category || '').trim() || 'Sin categoría'; (grouped[c] = grouped[c] || []).push(p); });
  const groups = storeCats().map((c) => ({ name: c, list: grouped[c] || [] }));
  if (grouped['Sin categoría']) groups.push({ name: 'Sin categoría', list: grouped['Sin categoría'] });

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
    setCatModal({ mode: 'new', name: '', price: '', promos: [] });
  }
  function editCategoryPrice(cat: string) {
    const cp = s.categoryPricing && s.categoryPricing[cat];
    setCatModal({
      mode: 'edit',
      name: cat,
      price: cp ? String(cp.price) : '',
      promos: cp ? JSON.parse(JSON.stringify(cp.promos || [])) : [],
    });
  }
  function saveCatModal() {
    if (!catModal) return;
    const v = catModal.name.trim();
    if (!v) { setCatModal(null); return; }
    if (catModal.mode === 'new' && storeCats().includes(v)) { toast('Esa categoría ya existe.'); return; }
    const priceTxt = catModal.price.trim();
    let pr: number | null = null;
    if (priceTxt !== '') {
      pr = Number(priceTxt);
      if (!Number.isFinite(pr) || pr < 0) { toast('Añade un precio válido para la categoría.'); return; }
    } else if (catModal.mode === 'edit') {
      toast('Añade un precio para la categoría.');
      return;
    }
    const promoList = catModal.promos.filter((x) => x.label.trim() && Number.isFinite(x.price) && x.price >= 0);
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.categories = st.categories || [];
      if (catModal.mode === 'new') {
        if (!st.categories.includes(v)) st.categories.push(v);
        d.openCats = d.openCats || {};
        d.openCats[s.id] = d.openCats[s.id] || {};
        d.openCats[s.id][v] = true;
      }
      if (pr != null) setCategoryPricing(st, v, pr, promoList);
    });
    setCatModal(null);
    toast(catModal.mode === 'new' ? 'Categoría añadida.' : 'Precio de categoría actualizado en todos sus productos.');
  }

  return (
    <div className="panel">
      <div className="panel-head"><div><h2>Catálogo de productos</h2><p className="muted">Precios, existencias y promociones de {esc(s.name)}, organizados por categoría.</p></div></div>
      <div className="cat-actions">
        <button className="button primary" onClick={addCategory}>＋ Añadir categoría</button>
        <div className="cat-divider"></div>
        <button className="button primary" onClick={() => setModal('newProduct')}>＋ Añadir producto</button>
      </div>
      {s.products.length ? groups.map((g) => {
        const open = catOpen(g.name);
        const editable = g.name !== 'Sin categoría';
        return (
          <div className="cat-group" key={g.name}>
            <div className="cat-head">
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
                {g.list.length ? (
                  <table><thead><tr><th>Producto</th><th>Precio</th><th>Disponible</th><th>Promociones</th><th></th></tr></thead><tbody>
                    {g.list.map((p) => {
                      const base = inv[p.id];
                      const avail = base == null ? '—' : Math.max(0, base - (sold[p.id] || 0));
                      return (
                        <tr key={p.id}>
                          <td className="cat-bar"><div className="product-cell"><div className="product-name">{esc(p.name)}</div><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /></div></td>
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
              autoFocus={catModal.mode === 'new'}
            />
          </div>
          <div className="field"><label>Precio {catModal.mode === 'new' ? '(opcional)' : ''}</label>
            <input min={0} type="number" placeholder="0" value={catModal.price} onChange={(e) => setCatModal((m) => m && { ...m, price: e.target.value })} autoFocus={catModal.mode === 'edit'} />
            <p className="muted">Se aplica a todos los productos de esta categoría. Cada producto se puede editar después para tener un precio distinto.</p>
          </div>
          <div className="field"><label>Promociones <span className="muted">(cada una se vende por separado)</span></label>
            <div id="cat-promo-list">
              {catModal.promos.map((x, n) => (
                <div className="promo-input" key={n}>
                  <input className="promo-label" maxLength={70} placeholder="Nombre de la promoción" value={x.label} onChange={(e) => setCatModal((m) => m && { ...m, promos: m.promos.map((y, i) => i === n ? { ...y, label: e.target.value } : y) })} />
                  <input className="promo-price" min={0} type="number" placeholder="Precio" value={x.price == null ? '' : String(x.price)} onChange={(e) => setCatModal((m) => m && { ...m, promos: m.promos.map((y, i) => i === n ? { ...y, price: Number(e.target.value) } : y) })} />
                  <button className="icon-btn" onClick={() => setCatModal((m) => m && { ...m, promos: m.promos.filter((_, i) => i !== n) })}>×</button>
                </div>
              ))}
            </div>
            <button className="add-promo" onClick={() => setCatModal((m) => m && { ...m, promos: [...m.promos, { id: uid(), label: '', price: Number(m.price) || 0 }] })}>＋ Agregar promoción</button>
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
