import { useState } from 'react';
import { useStore } from '../store';
import { money, esc, inventorySold, adoptInvLog, DEFAULT_PRODUCT_IMAGE } from '../lib/core';
import { Image, Modal } from '../ui';
import type { Product } from '../types';

export function Catalog() {
  const { store, state, replace, setModal, setModalArg, toast } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const inv = s.inventory || {};
  const [edit, setEdit] = useState<{ p: Product; qty: number } | null>(null);
  const [newCat, setNewCat] = useState<string | null>(null);

  function cur(p: Product): number {
    return Math.round(inv[p.id] || 0);
  }
  function bump(p: Product, delta: number) {
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      adoptInvLog(st, p.id, delta, '');
    });
  }
  function saveEdit() {
    if (!edit) return;
    const q = Math.round(edit.qty);
    if (!Number.isFinite(q) || q < 0) return toast('Escribe una cantidad válida.');
    const delta = q - cur(edit.p);
    if (delta !== 0) {
      replace((d) => {
        const st = d.stores.find((x) => x.id === s.id)!;
        adoptInvLog(st, edit.p.id, delta, '');
      });
    }
    toast('Cantidad actualizada.');
    setEdit(null);
  }

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
    setNewCat('');
  }
  function saveNewCategory() {
    const v = (newCat || '').trim();
    if (!v) { setNewCat(null); return; }
    if (storeCats().includes(v)) { toast('Esa categoría ya existe.'); return; }
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id);
      st!.categories = st!.categories || [];
      st!.categories.push(v);
      d.openCats = d.openCats || {};
      d.openCats[s.id] = d.openCats[s.id] || {};
      d.openCats[s.id][v] = true;
    });
    setNewCat(null);
    toast('Categoría añadida.');
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
        return (
          <div className="cat-group" key={g.name}>
            <button className="cat-head" onClick={() => toggleCat(g.name)}>
              <span className="cat-caret">{open ? '▾' : '▸'}</span><b>{esc(g.name)}</b>
              <span className="muted">· {g.list.length} producto{g.list.length === 1 ? '' : 's'}</span>
            </button>
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
                          <span className="cat-qty">
                            <button className="qty-btn" title="Restar 1" onClick={() => bump(p, -1)}>−</button>
                            <button className="icon-btn" title="Editar cantidad exacta" onClick={() => setEdit({ p, qty: cur(p) })}>✎</button>
                            <button className="qty-btn" title="Sumar 1" onClick={() => bump(p, 1)}>+</button>
                          </span>
                          <button className="icon-btn" onClick={() => { setModalArg(p.id); setModal('editProduct'); }}>⚙</button>
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

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h2>Editar existencias</h2>
          <div className="field"><label>Producto</label>
            <div className="product-name" style={{ fontWeight: 700 }}>{esc(edit.p.name)}</div>
          </div>
          <div className="field"><label>Cantidad que tiene el producto</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: Math.max(0, edit.qty - 1) })}>−</button>
              <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={edit.qty} onChange={(e) => setEdit({ ...edit, qty: Math.max(0, Number(e.target.value) || 0) })} />
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: edit.qty + 1 })}>+</button>
            </div>
            <p className="muted">Escribe el total de unidades compradas (no lo que queda tras las ventas).</p>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setEdit(null)}>Cancelar</button>
            <button className="button primary" onClick={saveEdit}>Guardar</button>
          </div>
        </Modal>
      )}

      {newCat !== null && (
        <Modal onClose={() => setNewCat(null)}>
          <h2>Nueva categoría</h2>
          <div className="field"><label>Nombre de la categoría</label>
            <input
              maxLength={30}
              placeholder="Ej. Bebidas"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveNewCategory(); }}
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setNewCat(null)}>Cancelar</button>
            <button className="button primary" onClick={saveNewCategory}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
