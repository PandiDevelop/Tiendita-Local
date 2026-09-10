import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, esc, inventorySold, adoptInvLog, syncName, groupedByCategory, storeCats, reorderCategoryProducts, shortTag, productTags } from '../lib/core';
import { customConfirm } from '../lib/dialog';
import { GearMenu, Image, Modal, PencilIcon, TruckIcon } from '../ui';
import { notifyStorePush } from '../lib/push';
import { CategoryModal } from './CategoryModal';
import type { Product } from '../types';

// qty se maneja como texto mientras se edita para no forzar un '0' que no
// se pueda borrar; se interpreta como numero (0 si esta vacio) al guardar.
// who es quien hace el cambio (igual que el empleado en Registrar venta):
// arranca con el nombre configurado del dispositivo, pero se puede editar.
interface QtyPopup { p: Product; qty: string; who: string; }

function parseQty(v: string): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function Inventory() {
  const { store, state, replace, toast } = useStore();
  const s = store!;
  const [mode, setMode] = useState<'stock' | 'log'>('stock');
  const [edit, setEdit] = useState<QtyPopup | null>(null);
  const [cargo, setCargo] = useState<QtyPopup | null>(null);
  // Configuracion de categoria abierta con la tuerca del encabezado.
  const [catModal, setCatModal] = useState<string | null>(null);
  // Orden temporal de productos de UNA categoria mientras se arrastra (igual
  // que en el Catalogo); se guarda el orden final al soltar.
  const [prodDrag, setProdDrag] = useState<{ cat: string; order: string[]; pid: string } | null>(null);

  const sold = inventorySold(s);
  const base = s.inventory || {};
  const log = (s.invLog || []).slice();
  const byId = new Map(s.products.map((p) => [p.id, p]));
  const groups = groupedByCategory(s);

  // Buscador en vivo (solo vale en Existencias): mientras se escribe, se ven
  // los productos que coinciden por nombre o tag, manteniendo las categorías
  // (las de coincidencias se abren, las demás se ocultan).
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const productMatches = (p: Product) => p.name.toLowerCase().includes(q) || productTags(p).some((t) => t.toLowerCase().includes(q));
  const visibleGroups = searching
    ? groups.map((g) => ({ ...g, list: g.list.filter(productMatches) })).filter((g) => g.list.length > 0)
    : groups;
  const foundCount = visibleGroups.reduce((a, g) => a + g.list.length, 0);

  // Independencia de vistas: Catalog guarda sus categorias abiertas bajo la
  // clave "c:cat" y Inventario bajo "i:cat". Asi abrir una categoria aqui no
  // la abre en Catálogo ni al reves (ver Catalog.tsx).
  function catKey(cat: string) { return 'i:' + cat; }
  function catOpen(cat: string) {
    return !state.openCats || !state.openCats[s.id] || state.openCats[s.id][catKey(cat)] !== false;
  }
  function toggleCat(cat: string) {
    const k = catKey(cat);
    replace((d) => {
      d.openCats = d.openCats || {};
      d.openCats[s.id] = d.openCats[s.id] || {};
      d.openCats[s.id][k] = !catOpen(cat);
    });
  }

  function cur(p: Product): number {
    return Math.round(base[p.id] || 0);
  }

  // Eliminar categoria desde su menú de tuerca: los productos pasan a
  // "Sin categoría" (no se borran) para no perderlos.
  async function removeCategory(cat: string) {
    if (!(await customConfirm(`¿Eliminar la categoría "${cat}"? Sus productos pasarán a "Sin categoría".`))) return;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.categories = (st.categories || []).filter((c) => c !== cat);
      st.products.forEach((t) => { if ((t.category || '').trim() === cat) t.category = ''; });
      if (st.categoryPricing) delete st.categoryPricing[cat];
    });
    toast('Categoría eliminada.');
  }

  // Arrastrar para reordenar produtos dentro de una categoria (mismo orden
  // compartido con el Catalogo: el campo 'order' del producto). Misma
  // implementacion con Pointer Events que en Catalog.tsx.
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

  function bump(p: Product, delta: number) {
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      adoptInvLog(st, p.id, delta, '');
    });
  }

  // Lápiz: fijar la cantidad exacta (sin proveedor).
  function openEdit(p: Product) {
    setEdit({ p, qty: String(cur(p)), who: syncName() });
  }

  // Cargamento: añadir un lote nuevo con distribuidor.
  function openCargo(p: Product) {
    setCargo({ p, qty: '', who: syncName() });
  }

  function saveEdit() {
    if (!edit) return;
    const q = parseQty(edit.qty);
    const delta = q - cur(edit.p);
    if (delta !== 0) {
      replace((x) => {
        const st = x.stores.find((y) => y.id === s.id)!;
        adoptInvLog(st, edit.p.id, delta, '', edit.who);
      });
    }
    toast('Cantidad actualizada.');
    setEdit(null);
  }

  function saveCargo() {
    if (!cargo) return;
    const q = parseQty(cargo.qty);
    if (q <= 0) return toast('Escribe una cantidad mayor a 0.');
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      adoptInvLog(st, cargo.p.id, q, cargoSupplier, cargo.who);
    });
    if (s.syncKey) notifyStorePush(s.syncKey, syncName() + ' recibió un cargamento', (cargo.p.name || 'Producto') + ' · ' + q + (q === 1 ? ' unidad' : ' unidades'), 'cargamento');
    toast('Cargamento registrado.');
    setCargo(null);
    setCargoSupplier('');
  }

  const [cargoSupplier, setCargoSupplier] = useState('');

  const nameOf = (pid: string) => byId.get(pid)?.name || 'Producto eliminado';

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Inventario</h2><p className="muted">Controla lo que hay en bodega. Las ventas descuentan solas.</p></div>
        <div className="inv-modes">
          <button type="button" className={'inv-mode' + (mode === 'stock' ? ' on' : '')} onClick={() => setMode('stock')}>Existencias</button>
          <button type="button" className={'inv-mode' + (mode === 'log' ? ' on' : '')} onClick={() => setMode('log')}>Historial de cambios</button>
        </div>
      </div>

      {mode === 'log' ? (
        log.length ? (
          <table><thead><tr><th>Fecha</th><th>Hora</th><th>Producto</th><th>Cantidad</th><th>Quién</th><th>Proveedor</th></tr></thead><tbody>
            {log.map((e) => (
              <tr key={e.id}>
                <td className="muted">{esc(e.date || '—')}</td>
                <td className="muted">{esc(e.time || '—')}</td>
                <td className="product-name">{esc(nameOf(e.productId))}</td>
                <td className={'inv-qty ' + (e.qty >= 0 ? 'add' : 'sub')}>{e.qty >= 0 ? '+' + e.qty : e.qty}</td>
                <td className="muted">{esc(e.byName || 'Alguien')}</td>
                <td className="muted">{e.supplier ? esc(e.supplier) : '—'}</td>
              </tr>
            ))}
          </tbody></table>
        ) : <div className="notice">Aún no hay cambios registrados en el inventario.</div>
      ) : <>
          <div className="panel-search">
            <input type="search" inputMode="search" placeholder="Buscar producto…" value={query} onChange={(e) => setQuery(e.target.value)} />
            {searching && <button type="button" className="panel-search-clear" title="Limpiar búsqueda" onClick={() => setQuery('')}>×</button>}
          </div>
          {searching && <p className="muted panel-search-info">{foundCount} resultado{foundCount === 1 ? '' : 's'} para «{esc(query.trim())}».</p>}
          {s.products.length || storeCats(s).length ? (
          searching && !visibleGroups.length ? (
            <div className="notice">No se encontraron productos para «{esc(query.trim())}».</div>
          ) : (
            visibleGroups.map((g) => {
              const open = searching ? true : catOpen(g.name);
              const editable = g.name !== 'Sin categoría';
              return (
                <div className="cat-group" key={g.name}>
                  <div className="cat-head">
                    <button className="cat-head-toggle" onClick={() => toggleCat(g.name)}>
                      <span className="cat-caret">{open ? '▾' : '▸'}</span><b>{esc(g.name)}</b>
                      <span className="muted">· {g.list.length} producto{g.list.length === 1 ? '' : 's'}</span>
                    </button>
                    {editable && (
                      <GearMenu items={[
                        { label: 'Editar categoría', onClick: () => setCatModal(g.name) },
                        { label: 'Eliminar categoría', danger: true, onClick: () => void removeCategory(g.name) },
                      ]} />
                    )}
                  </div>
                  {open && (
                    <div className="cat-body">
                      {g.list.length ? (
                        <table><thead><tr><th></th><th>Producto</th><th>Disponible</th><th>Vendido</th><th>Adquirido</th><th>Ajustar</th></tr></thead><tbody>
                          {g.list.map((p) => {
                            const has = base[p.id] != null;
                            const buy = has ? Math.round(base[p.id]) : null;
                            const soldQty = sold[p.id] || 0;
                            const avail = has ? Math.max(0, buy! - soldQty) : null;
                            return (
                              <tr key={p.id} data-pid={p.id} className={prodDrag?.pid === p.id ? 'dragging' : ''}>
                                <td className="drag-cell">{!searching && <button type="button" className="icon-btn drag-handle" title="Arrastrar para reordenar" onPointerDown={(e) => startProdDrag(e, g.name, p.id, g.list)}>⠿</button>}</td>
                                <td className="cat-bar"><div className="product-cell"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /><div className="product-name">{esc(p.name)}{productTags(p).map((t) => <span className="prod-tag" key={t} title={esc(t)}>{esc(shortTag(t))}</span>)}</div></div></td>
                                <td>{avail == null ? '—' : avail}</td>
                                <td>{soldQty}</td>
                                <td>{buy == null ? '—' : buy}</td>
                                <td className="inv-actions">
                                  <div className="inv-stepper">
                                    <button className="qty-btn" title="Restar 1" onClick={() => bump(p, -1)}>−</button>
                                    <button className="icon-btn" title="Editar cantidad exacta" onClick={() => openEdit(p)}><PencilIcon size={14} /></button>
                                    <button className="qty-btn" title="Sumar 1" onClick={() => bump(p, 1)}>+</button>
                                    <button className="inv-cargo" title="Nuevo cargamento" onClick={() => openCargo(p)}><TruckIcon size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody></table>
                      ) : <div className="notice">Sin productos en esta categoría todavía.</div>}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : <div className="empty"><div className="emoji">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-line)', display: 'block', margin: '0 auto' }}>
            <path d="M4 8l8 -4 8 4 -8 4z" /><path d="M4 8v8l8 4 8 -4V8" /><path d="M12 12v8" />
          </svg>
        </div><b>Aún no hay productos en el catálogo.</b><p>Agrega productos al catálogo para verlos aquí y llevar el control de existencias.</p></div>}
        </>}

      {catModal && (
        <CategoryModal mode="edit" catName={catModal} onClose={() => setCatModal(null)} />
      )}

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h2>Editar existencias</h2>
          <div className="field"><label>Producto</label>
            <div className="product-name" style={{ fontWeight: 700 }}>{esc(edit.p.name)}</div>
          </div>
          <div className="field"><label>Cantidad que tiene el producto</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: String(Math.max(0, parseQty(edit.qty) - 1)) })}>−</button>
              <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={edit.qty} onChange={(e) => setEdit({ ...edit, qty: e.target.value })} />
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: String(parseQty(edit.qty) + 1) })}>+</button>
            </div>
            <p className="muted">El total que compraste o produjiste.</p>
          </div>
          <div className="field"><label>Quién hace el ajuste</label>
            <input maxLength={40} placeholder="Tu nombre" value={edit.who} onChange={(e) => setEdit({ ...edit, who: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setEdit(null)}>Cancelar</button>
            <button className="button primary" onClick={saveEdit}>Guardar</button>
          </div>
        </Modal>
      )}

      {cargo && (
        <Modal onClose={() => setCargo(null)}>
          <h2>Nuevo cargamento</h2>
          <div className="field"><label>Producto</label>
            <div className="product-name" style={{ fontWeight: 700 }}>{esc(cargo.p.name)}</div>
          </div>
          <div className="field"><label>Unidades del lote</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setCargo({ ...cargo, qty: String(Math.max(0, parseQty(cargo.qty) - 1)) })}>−</button>
              <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={cargo.qty} onChange={(e) => setCargo({ ...cargo, qty: e.target.value })} />
              <button type="button" className="qty-btn" onClick={() => setCargo({ ...cargo, qty: String(parseQty(cargo.qty) + 1) })}>+</button>
            </div>
            <p className="muted">Llega ahora y se suma a las existencias.</p>
          </div>
          <div className="field"><label>Distribuidor / proveedor</label>
            <input maxLength={60} placeholder="Ej. Distribuidora del Sur" value={cargoSupplier} onChange={(e) => setCargoSupplier(e.target.value)} />
          </div>
          <div className="field"><label>Quién recibe el cargamento</label>
            <input maxLength={40} placeholder="Tu nombre" value={cargo.who} onChange={(e) => setCargo({ ...cargo, who: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setCargo(null)}>Cancelar</button>
            <button className="button primary" onClick={saveCargo}>Registrar cargamento</button>
          </div>
        </Modal>
      )}
    </div>
  );
}