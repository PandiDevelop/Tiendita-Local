import { useState } from 'react';
import { useStore } from '../store';
import { esc, productTags, DEFAULT_PRODUCT_IMAGE, syncName, getSupplierCost, getSupplierInfo, setSupplierCost, ensureCost, recordSupplierPrice, adoptInvLog, inventorySold } from '../lib/core';
import { notifyStorePush } from '../lib/push';
import { Modal, CloseIcon, Image } from '../ui';
import type { Product, Store as IStore } from '../types';

// Línea de un cargamento: un producto con sus unidades y, por lote, la info
// del distribuidor y el costo por unidad. qty y cost viajan como texto para
// no forzar ceros que no se puedan borrar (igual que Registrar venta).
interface CargoLine { pid: string; qty: string; cost: string; supplier: string; dirty: boolean; }

function parseQty(v: string): number {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Sugerencia inicial de cada línea: el distribuidor de la última compra (del
// producto o de su categoría) y el costo que tiene registrado ese distribuidor
// (o el del producto), igual que el cargo unitario de Inventario.
function lineSug(s: IStore, p: Product): { supplier: string; cost: number } {
  const cat = (p.category || '').trim();
  const cp = cat && s.categoryPricing ? s.categoryPricing[cat] : undefined;
  const supplier = (p.supplier || cp?.supplier || '').trim();
  const cost = supplier ? (getSupplierCost(s, supplier) ?? (p.cost != null ? p.cost : (cp?.cost ?? 0))) : (p.cost != null ? p.cost : (cp?.cost ?? 0));
  return { supplier, cost };
}

export function CargoModal({ preselect, onClose }: { preselect?: string | null; onClose: () => void }) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const [query, setQuery] = useState('');
  const [who, setWho] = useState(syncName());
  const [lines, setLines] = useState<CargoLine[]>(() => {
    if (!preselect) return [];
    const p = s.products.find((x) => x.id === preselect);
    if (!p) return [];
    const sug = lineSug(s, p);
    return [{ pid: p.id, qty: '1', cost: sug.cost > 0 ? String(sug.cost) : '', supplier: sug.supplier, dirty: false }];
  });

  const q = query.trim().toLowerCase();
  const filtered = s.products.filter((p) => !q || p.name.toLowerCase().includes(q) || productTags(p).some((t) => t.toLowerCase().includes(q)));

  const lineFor = (pid: string) => lines.find((z) => z.pid === pid);
  const totalUnits = lines.reduce((a, l) => a + parseQty(l.qty), 0);

  function setLine(pid: string, patch: Partial<CargoLine>) {
    setLines((z) => z.map((l) => (l.pid === pid ? { ...l, ...patch } : l)));
  }
  function addLine(p: Product) {
    const existing = lineFor(p.id);
    if (existing) { setLine(p.id, { qty: String(parseQty(existing.qty) + 1) }); return; }
    const sug = lineSug(s, p);
    setLines((z) => [...z, { pid: p.id, qty: '1', cost: sug.cost > 0 ? String(sug.cost) : '', supplier: sug.supplier, dirty: false }]);
  }
  function removeLine(pid: string) {
    setLines((z) => z.filter((l) => l.pid !== pid));
  }

  // Click sobre el distribuidor sugerido (gris): se limpia el campo y el costo
  // para escribir una compra nueva. Si queda vacío al salir, se restaura.
  function onSuppFocus(pid: string) {
    const l = lineFor(pid);
    if (!l) return;
    if (!l.dirty && l.supplier.trim() !== '') {
      setLine(pid, { supplier: '', cost: '' });
    }
    setLine(pid, { dirty: true });
  }
  function onSuppBlur(pid: string) {
    const l = lineFor(pid);
    if (!l) return;
    const name = l.supplier.trim();
    if (!name) {
      const p = s.products.find((x) => x.id === pid);
      if (p) {
        const sug = lineSug(s, p);
        setLine(pid, { supplier: sug.supplier, cost: sug.cost > 0 ? String(sug.cost) : '', dirty: false });
      }
      return;
    }
    const info = getSupplierInfo(s, name);
    if (info) setLine(pid, { cost: info.cost > 0 ? String(info.cost) : '' });
  }

  function saveCargo() {
    const valid = lines.filter((l) => parseQty(l.qty) > 0);
    if (!valid.length) return toast('Agrega al menos un producto con cantidad mayor a 0.');
    const whoName = who.trim() || syncName();
    const toLoad = valid.map((l) => {
      const cst = Math.round(Number(l.cost));
      return { pid: l.pid, qty: parseQty(l.qty), supplier: l.supplier.trim(), cost: Number.isFinite(cst) && cst >= 0 ? cst : 0 };
    });
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      toLoad.forEach(({ pid, qty, supplier, cost }) => {
        const prod = st.products.find((y) => y.id === pid);
        const cat = (prod?.category || '').trim();
        let tag = '';
        let costId = '';
        if (supplier) {
          // Si no se escribió costo se conserva el último registrado del
          // distribuidor (no se borra con un cargamento sin costo).
          tag = setSupplierCost(st, supplier, cost > 0 ? cost : (getSupplierCost(st, supplier) ?? 0));
          if (cat && cost > 0) recordSupplierPrice(st, cat, supplier, cost);
          if (prod) { prod.supplier = supplier; prod.supplierTag = tag; }
          if (cost > 0) costId = ensureCost(st, pid, supplier, cost, tag);
        }
        if (prod && cost > 0) prod.cost = cost;
        adoptInvLog(st, pid, qty, supplier, whoName, tag, cost > 0 ? cost : undefined, costId);
      });
    });
    if (s.syncKey) {
      notifyStorePush(s.syncKey, syncName() + ' recibió un cargamento', toLoad.length + ' producto' + (toLoad.length === 1 ? '' : 's') + ' · ' + totalUnits + ' ' + (totalUnits === 1 ? 'unidad' : 'unidades'), 'cargamento');
    }
    toast('Cargamento registrado.');
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="sale-window">
        <div className="sale-modal-head">
          <h2 style={{ margin: 0 }}>Nuevo cargamento</h2>
          <button type="button" className="x-close" title="Salir sin guardar" onClick={onClose}><CloseIcon size={15} /></button>
        </div>
        <div className="sale-scroll">
          <div className="sale-builder">
            <label className="sale-pick-label">Productos · {filtered.length}</label>
            <div className="sale-search">
              <input type="search" inputMode="search" placeholder="Buscar producto…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {!filtered.length ? (
              <div className="notice">{q ? 'Sin resultados.' : 'Sin productos todavía.'}</div>
            ) : (
              <div className="cargo-products">
                {filtered.map((p) => {
                  const existing = lineFor(p.id);
                  const avail = (s.inventory || {})[p.id] == null ? null : Math.max(0, ((s.inventory || {})[p.id] || 0) - (sold[p.id] || 0));
                  return (
                    <div className="sale-prod-card" key={p.id}>
                      <div className="prod-cat">{(p.category || '').trim() || 'Sin categoría'}</div>
                      <div className="product-name">{p.name}</div>
                      <Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-sale" />
                      <div className="muted sale-prod-price">{avail == null ? '—' : avail + ' disp.'}</div>
                      <button type="button" className="icon-btn sale-add" title={existing ? 'Sumar 1 a este producto' : 'Añadir al cargamento'} onClick={() => addLine(p)}>{existing ? '+1' : '＋'}</button>
                    </div>
                  );
                })}
              </div>
            )}
            {lines.length > 0 && (<>
              <label className="sale-pick-label">Lote a registrar</label>
              <div className="sale-lines">
                {lines.map((l) => {
                  const p = s.products.find((x) => x.id === l.pid);
                  if (!p) return null;
                  return (
                    <div className="sale-builder-line" key={l.pid}>
                      <div className="sale-builder-head">
                        <Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-sale" />
                        <div className="sale-builder-name">
                          <div className="prod-cat">{(p.category || '').trim() || 'Sin categoría'}</div>
                          <div className="sale-builder-name-row">
                            <span className="b-name">{p.name}</span>
                            {productTags(p).map((t) => <span className="prod-tag sale-tag" key={t}>{esc(t)}</span>)}
                          </div>
                        </div>
                        <button className="sale-del" title="Quitar este producto del cargamento" onClick={() => removeLine(l.pid)}><CloseIcon size={13} /></button>
                      </div>
                      <div className="sale-builder-qty">
                        <button type="button" className="qty-btn" onClick={() => setLine(l.pid, { qty: String(Math.max(0, parseQty(l.qty) - 1)) })}>−</button>
                        <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={l.qty} onChange={(e) => setLine(l.pid, { qty: e.target.value })} />
                        <button type="button" className="qty-btn" onClick={() => setLine(l.pid, { qty: String(parseQty(l.qty) + 1) })}>+</button>
                      </div>
                      <div className="cargo-fields">
                        <div className="field"><label>Distribuidor / proveedor <span className="muted">(opcional)</span></label>
                          <input maxLength={60} className={!l.dirty && l.supplier.trim() ? 'sugg' : undefined} placeholder="Distribuidor / proveedor" value={l.supplier} onChange={(e) => setLine(l.pid, { supplier: e.target.value })} onFocus={() => onSuppFocus(l.pid)} onBlur={() => onSuppBlur(l.pid)} />
                          {!l.dirty && l.supplier.trim() && <p className="muted">Usado la última vez. Haz click para escribir uno nuevo.</p>}
                        </div>
                        <div className="field"><label>Costo por unidad <span className="muted">(opcional)</span></label>
                          <input min={0} type="number" inputMode="decimal" placeholder="0" value={l.cost} onChange={(e) => setLine(l.pid, { cost: e.target.value })} onFocus={(e) => e.target.select()} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>)}
            <div className="field"><label>Quién recibe el cargamento</label>
              <input maxLength={40} placeholder="Tu nombre" value={who} onChange={(e) => setWho(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="sale-foot">
          <span className="muted">Total</span><b>{totalUnits} unidad{totalUnits === 1 ? '' : 'es'}</b>
          <button type="button" className="button primary" onClick={saveCargo}>Registrar cargamento</button>
        </div>
      </div>
    </Modal>
  );
}