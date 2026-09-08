import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, catLabel, money, saleCatsOf, sortByOrder, syncName, today, uid } from '../lib/core';
import { Dropdown } from '../Dropdown';
import { Image, Modal } from '../ui';
import type { Product } from '../types';

interface Line { pid: string; price: number; cost: number; qty: number; }

const SALE_PAGE_SIZE = 4;

export function SaleRegistration({ onClose }: { onClose: () => void }) {
  const { store, state, replace, toast } = useStore();
  const s = store!;
  const draft = state.saleDraft && state.saleDraft.storeId === s.id ? state.saleDraft : null;
  const [employee, setEmployee] = useState(draft?.employee ?? syncName());
  const [category, setCategory] = useState(draft?.category ?? '');
  const [lines, setLines] = useState<Line[]>(draft ? JSON.parse(JSON.stringify(draft.lines)) : []);
  // Texto que se esta escribiendo en el input de cantidad de cada linea,
  // separado del numero confirmado: asi se puede borrar un '0' y escribir
  // otra cosa sin que el campo se reponga solo en cada tecla.
  const [qtyDraft, setQtyDraft] = useState<Record<number, string>>({});
  // Buscador de producto dentro de la categoria seleccionada (filtra por
  // nombre y por tag). Al buscar o cambiar de categoria se vuelve a la
  // primera pagina de productos.
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const pagerRef = useRef<HTMLDivElement>(null);

  const cats = saleCatsOf(s).map((c) => ({ v: c, label: c, count: s.products.filter((p) => catLabel(p) === c).length }));
  const catsOpen = cats.length;
  // Sin categoria seleccionada se muestran TODOS los productos (paginados);
  // al elegir una, solo los de esa categoria. Asi el buscador siempre tiene
  // algo que filtrar, aunque la persona nunca toque el selector.
  const list = sortByOrder(category ? s.products.filter((p) => catLabel(p) === category) : s.products);
  // Filtro por lo que se escribe en el buscador (nombre o tag).
  const q = query.trim().toLowerCase();
  const filtered = q
    ? list.filter((p) => (p.tag && p.tag.trim().toLowerCase().includes(q)) || p.name.toLowerCase().includes(q))
    : list;
  // Paginado: solo se muestran 4 productos a la vez y el resto se desliza
  // (fila horizontal con ajuste de pagina).
  const pages: Product[][] = [];
  for (let i = 0; i < filtered.length; i += SALE_PAGE_SIZE) pages.push(filtered.slice(i, i + SALE_PAGE_SIZE));
  const maxPage = Math.max(0, pages.length - 1);
  const curPage = Math.min(page, maxPage);
  const total = lines.reduce((n, l) => n + l.price * l.qty, 0);

  // Al cambiar de categoria o de texto en el buscador se reinicia la pagina.
  useEffect(() => { setPage(0); if (pagerRef.current) pagerRef.current.scrollLeft = 0; }, [category, query]);

  function goPage(n: number) {
    const next = Math.max(0, Math.min(maxPage, n));
    setPage(next);
    const el = pagerRef.current;
    if (el) {
      const w = el.clientWidth || el.scrollWidth / (pages.length || 1);
      el.scrollTo({ left: next * w, behavior: 'smooth' });
    }
  }

  function onPagerScroll() {
    const el = pagerRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== page && i >= 0 && i <= maxPage) setPage(i);
  }

  function persist(next: { employee?: string; category?: string; lines?: Line[] }, immediate = false) {
    const d = {
      employee: next.employee !== undefined ? next.employee : employee,
      category: next.category !== undefined ? next.category : category,
      lines: next.lines !== undefined ? next.lines : lines,
    };
    if (immediate) setEmployee(d.employee);
    if (immediate) setCategory(d.category);
    if (immediate) setLines(d.lines);
    replace((x) => { x.saleDraft = { storeId: s.id, employee: d.employee, category: d.category, lines: JSON.parse(JSON.stringify(d.lines)) }; });
  }

  function clearDraft() {
    replace((x) => { x.saleDraft = null; });
    setEmployee(''); setCategory(''); setLines([]);
    toast('Venta en curso borrada.');
  }

  function addLine(p: Product) {
    const next = [...lines, { pid: p.id, price: p.price, cost: p.cost ?? 0, qty: 0 }];
    setLines(next);
    persist({ lines: next }, false);
    // Antes esto enfocaba a la fuerza el input de cantidad recien
    // agregado, lo que en celular abre el teclado solo sin que la persona
    // haya tocado nada. Owen ya habia pedido que nada abra el teclado
    // automaticamente: se deja la linea agregada sin enfocar, el usuario
    // toca el campo cuando quiera escribir la cantidad.
  }

  function setLine(n: number, patch: Partial<Line>) {
    const next = lines.map((l, i) => i === n ? { ...l, ...patch } : l);
    setLines(next);
    persist({ lines: next }, false);
  }

  function setQtyText(n: number, raw: string) {
    setQtyDraft((d) => ({ ...d, [n]: raw }));
    const num = raw.trim() === '' ? 0 : Math.max(0, Math.round(Number(raw)) || 0);
    setLine(n, { qty: num });
  }

  function clearQtyDraft(n: number) {
    setQtyDraft((d) => { if (!(n in d)) return d; const c = { ...d }; delete c[n]; return c; });
  }

  function removeLine(n: number) {
    const next = lines.filter((_, i) => i !== n);
    setLines(next);
    persist({ lines: next }, false);
  }

  function register() {
    const emp = (employee.trim() || syncName());
    const items = lines.filter((l) => l.qty > 0).map((l) => ({ productId: l.pid, promotionId: null, qty: l.qty, price: l.price, cost: l.cost }));
    if (!items.length) return toast('Añade al menos un producto con cantidad mayor a cero.');
    const now = new Date();
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      st.sales.push({ id: uid(), date: today(), time: now.toTimeString().slice(0, 5), employee: emp, items: JSON.parse(JSON.stringify(items)), closed: false });
      x.saleDraft = null;
    });
    onClose();
    toast('Venta registrada.');
  }

  if (!s.products.length) {
    return (
      <Modal onClose={onClose}>
        <h2>Registrar una venta</h2>
        <div className="empty"><div className="emoji">🧾</div><b>Aún no hay productos para vender</b><p>Agrega productos al catálogo para poder registrarlos.</p></div>
        <div className="modal-actions"><span style={{ flex: 1 }}></span><button className="button primary" onClick={onClose}>Cerrar</button></div>
      </Modal>
    );
  }

  // Tarjeta de un producto dentro de una pagina del selector (4 por pagina).
  // Fuera de la grilla se usa el mismo estilo en miniatura de lineas.
  const productCard = (p: Product) => (
    <div className="sale-prod-card" key={p.id}>
      <div className="sale-brand"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-sale" /><div><div className="product-name">{p.name}</div><div className="muted">{money(p.price)}</div></div></div>
      <button type="button" className="icon-btn sale-add" title="Añadir a la venta" onClick={() => addLine(p)}>＋</button>
    </div>
  );

  const priceItemsFor = (p: Product): { v: string; label: string }[] => {
    const items = [{ v: String(p.price), label: 'Precio normal · ' + money(p.price) }];
    (p.promos || []).forEach((pr) => { if (Number.isFinite(pr.price)) items.push({ v: String(pr.price), label: pr.label + ' · ' + money(pr.price) }); });
    return items;
  };

  const lineRow = (l: Line, n: number) => {
    const p = s.products.find((x) => x.id === l.pid);
    if (!p) return null;
    const priceItems = priceItemsFor(p);
    const priceDrop = priceItems.length > 1 ? (
      <Dropdown value={String(l.price)} ph="Precio" items={priceItems} onPick={(v) => setLine(n, { price: Number(v) || 0 })} />
    ) : undefined;
    return (
      <div className="sale-builder-line" data-pid={p.id} data-price={l.price} key={n}>
        <div className="sale-builder-head">
          <div className="sale-brand"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-sale" /><div className="sale-builder-name">{p.name}</div></div>
          <button className="icon-btn sale-del" title="Quitar" onClick={() => removeLine(n)}>×</button>
        </div>
        <div className="sale-builder-price">{money(l.price)} <span className="muted">c/u</span></div>
        {priceDrop && <div className="sale-promo">{priceDrop}</div>}
        <div className="sale-builder-qty">
          <button type="button" className="qty-btn" onClick={() => { clearQtyDraft(n); setLine(n, { qty: Math.max(0, l.qty - 1) }); }}>−</button>
          <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={qtyDraft[n] !== undefined ? qtyDraft[n] : String(l.qty)} onChange={(e) => setQtyText(n, e.target.value)} onBlur={() => clearQtyDraft(n)} />
          <button type="button" className="qty-btn" onClick={() => { clearQtyDraft(n); setLine(n, { qty: l.qty + 1 }); }}>+</button>
        </div>
      </div>
    );
  };

  return (
    <Modal onClose={onClose}>
      <div className="sale-window">
        <div className="sale-modal-head">
          <h2 style={{ margin: 0 }}>Registrar una venta</h2>
          <button type="button" className="x-close" title="Salir sin guardar" onClick={onClose}>✕</button>
        </div>
        <p className="muted" style={{ margin: '8px 0 14px' }}>La venta en curso se mantiene aunque cierres esta ventana.</p>
        <div className="sale-scroll">
          <div className="sale-builder">
            <div className="field"><label>Empleado que registra</label>
              <input maxLength={40} placeholder="Tu nombre" value={employee} onChange={(e) => { setEmployee(e.target.value); persist({ employee: e.target.value }); }} />
            </div>
            {catsOpen ? <>
              <label className="sale-pick-label">Categoría</label>
              <Dropdown value={category} ph="Seleccionar categoría…" items={cats} onPick={(v) => { setCategory(v); persist({ category: v }); }} />
            </> : null}
            <label className="sale-pick-label">{category ? 'Productos de ' + category : 'Todos los productos'}{filtered.length ? ' · ' + filtered.length : ''}</label>
            <div className="sale-search">
              <input type="search" inputMode="search" placeholder="Buscar producto…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {!filtered.length ? (
              <div className="notice">{q ? 'Sin productos que coincidan con la búsqueda.' : 'Sin productos todavía.'}</div>
            ) : (
              <div className="sale-products">
                <div className="sale-products-scroll" ref={pagerRef} onScroll={onPagerScroll}>
                  {pages.map((pg, i) => (
                    <div className="sale-prod-page" key={i}>
                      {pg.map(productCard)}
                    </div>
                  ))}
                </div>
                {pages.length > 1 && (
                  <div className="sale-pager-dots">
                    {pages.map((_, i) => (
                      <button key={i} className={'sale-dot' + (i === curPage ? ' on' : '')} title={'Ir a la página ' + (i + 1)} onClick={() => goPage(i)} />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div id="sale-lines" className="sale-lines">{lines.map(lineRow)}</div>
            <div className="sale-total"><span>Total de la venta</span><b>{money(total)}</b></div>
          </div>
        </div>
        <div className="sale-foot">
          <button type="button" className="trash-btn" title="Borrar la venta en curso" onClick={clearDraft}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
          </button>
          <span style={{ flex: 1 }}></span>
          <button className="button primary" onClick={register}>Guardar venta</button>
        </div>
      </div>
    </Modal>
  );
}