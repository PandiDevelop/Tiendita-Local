import { useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useStore } from '../store';
import { money, esc, inventorySold, reorderCategoryProducts, groupedByCategory, storeCats, shortTag, promoText, DEFAULT_PRODUCT_IMAGE, productTags } from '../lib/core';
import { customConfirm } from '../lib/dialog';
import { GearMenu, Image, StorefrontIcon } from '../ui';
import { CategoryModal } from './CategoryModal';
import { VirtualCatalog } from './VirtualCatalog';
import type { Product } from '../types';

export function Catalog() {
  const { store, state, replace, setModal, setModalArg, toast } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const inv = s.inventory || {};
  // Categoria cuya configuracion se abre con la tuerca del encabezado.
  const [catModal, setCatModal] = useState<{ mode: 'new' | 'edit'; name: string } | null>(null);
  // Buscador en vivo: mientras se escribe, solo se ven los productos que
  // coinciden (por nombre o tag), manteniendo las categorías.
  const [query, setQuery] = useState('');
  // Libro de catálogo virtual a pantalla completa (todos los productos con
  // su foto, separados por categoría).
  const [bookOpen, setBookOpen] = useState(false);

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

  // Independencia de vistas: el estado expandir/colapsar de cada categoria
  // se guarda por PESTAÑA (Catalog usa la clave "c:cat", Inventario "i:cat").
  // Antes ambas ventanas compartian el mismo estado (openCats[store][cat]),
  // asi que abrir una categoria en Catálogo la abria tambien en Inventario
  // y viceversa; ahora cada pestaña recuerda sus propias categorias abiertas.
  function catKey(cat: string) { return 'c:' + cat; }
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
  function addCategory() {
    setCatModal({ mode: 'new', name: '' });
  }
  function editCategoryPrice(cat: string) {
    setCatModal({ mode: 'edit', name: cat });
  }

  // Filtro del buscador (por nombre o tag, sin distinguir mayúsculas), igual
  // que el de Registro de venta. Mientras se busca, las categorías con
  // coincidencias se muestran abiertas y las vacías se ocultan.
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const productMatches = (p: Product) => p.name.toLowerCase().includes(q) || productTags(p).some((t) => t.toLowerCase().includes(q));
  const visibleGroups = searching
    ? orderedGroups.map((g) => ({ ...g, list: g.list.filter(productMatches) })).filter((g) => g.list.length > 0)
    : orderedGroups;
  const foundCount = visibleGroups.reduce((a, g) => a + g.list.length, 0);

  // Eliminar producto desde el menú de la tuerca: sale del catálogo y del
  // inventario (sus ventas viejas se siguen viendo como "Producto eliminado").
  async function removeProduct(p: Product) {
    if (!(await customConfirm(`¿Eliminar el producto "${p.name}"?`))) return;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.products = st.products.filter((x) => x.id !== p.id);
      if (st.inventory) delete st.inventory[p.id];
    });
    toast('Producto eliminado.');
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
      <div className="panel-head"><div><h2>Catálogo de productos</h2><p className="muted">Productos por categoría con su precio y existencias. Arrastra ⠿ para ordenar.</p></div></div>
      <div className="cat-actions">
        <div className="cat-actions-row">
          <button className="button primary" onClick={addCategory}>＋ Categoría</button>
          <button className="button primary" onClick={() => setModal('newProduct')}>＋ Producto</button>
        </div>
        <div className="cat-actions-row">
          <div className="panel-search" style={{ flex: 1, margin: 0 }}>
            <input type="search" inputMode="search" placeholder="Buscar producto…" value={query} onChange={(e) => setQuery(e.target.value)} />
            {searching && <button type="button" className="panel-search-clear" title="Limpiar búsqueda" onClick={() => setQuery('')}>×</button>}
          </div>
          <button className="button outline" disabled={!s.products.length} onClick={() => setBookOpen(true)} style={{ whiteSpace: 'nowrap' }}><StorefrontIcon size={16} /> Ver catálogo</button>
        </div>
      </div>
      {searching && <p className="muted panel-search-info">{foundCount} resultado{foundCount === 1 ? '' : 's'} para «{esc(query.trim())}».</p>}
      {s.products.length || storeCats(s).length ? (searching && !visibleGroups.length ? (
        <div className="notice">No se encontraron productos para «{esc(query.trim())}».</div>
      ) : visibleGroups.map((g) => {
        const open = searching ? true : catOpen(g.name);
        const editable = g.name !== 'Sin categoría';
        const list = prodDrag && prodDrag.cat === g.name
          ? prodDrag.order.map((id) => g.list.find((p) => p.id === id)).filter((p): p is Product => !!p)
          : g.list;
        return (
          <div className={'cat-group' + (draggingCat === g.name ? ' dragging' : '')} key={g.name} data-cat={g.name}>
            <div className="cat-head">
              {editable && !searching && (
                <button type="button" className="icon-btn drag-handle" title="Arrastrar para reordenar" onPointerDown={(e) => startCatDrag(e, g.name)}>⠿</button>
              )}
              <button className="cat-head-toggle" onClick={() => toggleCat(g.name)}>
                <span className="cat-caret">{open ? '▾' : '▸'}</span><b>{esc(g.name)}</b>
                <span className="muted">· {g.list.length} producto{g.list.length === 1 ? '' : 's'}</span>
              </button>
              {editable && (
                <GearMenu items={[
                  { label: 'Editar categoría', onClick: () => editCategoryPrice(g.name) },
                  { label: 'Eliminar categoría', danger: true, onClick: () => void removeCategory(g.name) },
                ]} />
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
                          <td className="drag-cell">{!searching && <button type="button" className="icon-btn drag-handle" title="Arrastrar para reordenar" onPointerDown={(e) => startProdDrag(e, g.name, p.id, g.list)}>⠿</button>}</td>
                          <td className="cat-bar"><div className="product-cell"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /><div className="product-name">{esc(p.name)}{productTags(p).map((t) => <span className="prod-tag" key={t} title={esc(t)}>{esc(shortTag(t))}</span>)}</div></div></td>
                          <td>{money(p.price)}</td><td>{avail}</td>
                          <td>{p.promos.length ? <div className="promo-stack">{p.promos.map((x) => <span className="promotion" key={x.id}>{promoText(x)}</span>)}</div> : <span className="muted">—</span>}</td>
                          <td><div className="actions">
                          <GearMenu items={[
                            { label: 'Editar producto', onClick: () => { setModalArg(p.id); setModal('editProduct'); } },
                            { label: 'Eliminar producto', danger: true, onClick: () => void removeProduct(p) },
                          ]} />
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
      })) : <div className="empty"><div className="emoji">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-line)', display: 'block', margin: '0 auto' }}>
            <path d="M4 4h10l6 6v10h-10l-6 -6z" /><circle cx="9" cy="9" r="1.3" fill="currentColor" stroke="none" />
          </svg>
        </div><b>Tu catálogo está vacío</b><p>Agrega el primer producto para empezar.</p></div>}

      {catModal && (
        <CategoryModal
          mode={catModal.mode}
          catName={catModal.mode === 'edit' ? catModal.name : undefined}
          onClose={() => setCatModal(null)}
          onSaved={(n) => {
            replace((d) => {
              d.openCats = d.openCats || {};
              d.openCats[s.id] = d.openCats[s.id] || {};
              d.openCats[s.id]['c:' + n] = true;
            });
          }}
        />
      )}
    {bookOpen && (
        <VirtualCatalog onClose={() => setBookOpen(false)} />
      )}
    </div>
  );
}
