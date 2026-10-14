import { Fragment, ReactNode, useState } from 'react';
import { CaretIcon, CloseIcon, DownloadIcon, PencilIcon, confirmDialog } from '../ui';
import { useStore } from '../store';
import { money, esc, total, shortDate, saleUnits, priceFor, formatDate, catLabel, findActivePromo, productPromos, productTags, canManageTeam, markSaleDeleted } from '../lib/core';
import { saveTextFile } from '../lib/saveFile';
import type { Sale } from '../types';

export function History({ embedded = false }: { embedded?: boolean }) {
  const { store, replace, setModal, toast } = useStore();
  const s = store!;
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const manage = canManageTeam(s);

  // Buscador de productos dentro de las ventas: sirve para confirmar o
  // encontrar un registro concreto (por nombre del producto o por su tag).
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  function saleHasProduct(x: Sale) {
    return x.items.some((i) => {
      if (!(i.qty > 0)) return false;
      const p = s.products.find((pp) => pp.id === i.productId);
      if (!p) return false;
      return p.name.toLowerCase().includes(q) || productTags(p).some((t) => t.toLowerCase().includes(q));
    });
  }

  // Abre la venta en el registro (modal 'sale') precargada para corregirla.
  // Se marca en editingSaleId para que SaleRegistration reemplace esa venta
  // en vez de crear una nueva. No se toca el saleDraft: ese solo guarda la
  // venta nueva en curso, la edición se reconstruye desde la propia venta.
  function startEdit(x: Sale) {
    replace((d) => { d.editingSaleId = x.id; });
    setModal('sale');
  }

  function deleteSale(x: Sale) {
    confirmDialog('¿Borrar esta venta?\nNo se puede deshacer.', () => {
      replace((d) => {
        const st = d.stores.find((y) => y.id === s.id);
        if (!st) return;
        // Unica via que borra una venta tambien en la nube (ver markSaleDeleted).
        x.items.forEach((oi) => { if (oi.qty) incAvailable(st, oi.productId, oi.qty); });
        markSaleDeleted(st, x.id);
        st.sales = st.sales.filter((z) => z.id !== x.id);
      });
    });
  }

  // Exporta el historial a un archivo JSON: cada venta con sus ítems sueltos
  // (producto, categoría, promoción aplicada, precio, cantidad y total).
  // En la app nativa se guarda en Documentos y el toast avisa dónde quedó.
  async function exportJson(sales: Sale[]) {
    const ventas = sales.map((x) => ({
      fecha: x.date,
      hora: x.time || '',
      empleado: x.employee || '',
      items: x.items.map((i) => {
        const p = s.products.find((pp) => pp.id === i.productId);
        const pr = p && p.promos.find((z) => z.id === i.promotionId);
        return {
          producto: p ? p.name : 'Producto eliminado',
          categoria: p ? catLabel(p) : 'Sin categoría',
          item: pr ? pr.label : (p ? p.name : 'Producto eliminado'),
          promocion: pr ? pr.label : null,
          precio: priceFor(i, s),
          cantidad: i.qty,
          total: priceFor(i, s) * i.qty,
        };
      }),
    }));
    const data = JSON.stringify({ formato: 'mi-tiendita-ventas', tienda: s.name, exportado: new Date().toISOString(), ventas }, null, 2);
    const name = 'ventas-' + s.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-') + '.json';
    const r = await saveTextFile(data, name, 'application/json;charset=utf-8;');
    if (r.path) toast('Ventas guardadas: ' + r.path);
  }

  // Ordena por fecha y hora y, cuando coincide el minuto, por la marca exacta
  // `at` (mas reciente primero): asi varias ventas del mismo minuto conservan
  // el orden en que se hicieron.
  const allSales = [...s.sales].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || '') || (b.at || 0) - (a.at || 0));
  const sales = searching ? allSales.filter(saleHasProduct) : allSales;
  const groups: Record<string, typeof sales> = {};
  sales.forEach((x) => { const d = x.date || ''; (groups[d] = groups[d] || []).push(x); });
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  function details(x: Sale): ReactNode[] {
    // Unidades vendidas por categoría (misma lógica que en Registrar venta),
    // para saber qué paquete aplica según la condición estipulada en la promo.
    const catQty = new Map<string, number>();
    x.items.filter((i) => i.qty > 0).forEach((i) => {
      const p = s.products.find((pr) => pr.id === i.productId);
      const name = p ? catLabel(p) : 'Sin categoría';
      catQty.set(name, (catQty.get(name) || 0) + i.qty);
    });
    const out: ReactNode[] = [];
    x.items.filter((i) => i.qty > 0).forEach((i) => {
      const p = s.products.find((pr) => pr.id === i.productId);
      const pcat = esc(p ? catLabel(p) : 'Sin categoría');
      // Solo el paquete que aplica (un solo tag), no la descomposición en
      // todos los bloques de promoción de la condición.
      const pr = p ? findActivePromo(p, catQty.get(catLabel(p)) || 0, productPromos(s, p)) : undefined;
      const pack = pr && pr.cond === 'qtyeq' ? pr : undefined;
      const pr2 = p && p.promos.find((z) => z.id === i.promotionId);
      out.push(
        <div className="sale-detail-line" key={i.productId + ':' + (i.promotionId || '')}>
          <div className="sale-detail-name">
            <span className="detail-prod">
              <span className="prod-cat">{pcat}</span><span>{esc(p ? p.name : 'Producto eliminado')}</span>
              {pr2 ? <span className="prod-sub">{esc(pr2.label)}</span> : null}
            </span>
            <b className="detail-qty">× {i.qty}</b>
            {pack && <span className="pkg-tag">Paquete: {esc(pack.label)}</span>}
          </div>
          <b className="sale-detail-cost">{money(priceFor(i, s) * i.qty)}</b>
        </div>
      );
    });
    return out;
  }

  return (
    <div className={embedded ? undefined : 'panel'}>
      <div className="panel-head">
        <div><h2>Historial de ventas</h2><p className="muted">Cada venta con su fecha, hora y quién la registró.</p></div>
        <button className="button secondary" onClick={() => exportJson(s.sales)}><DownloadIcon /> Exportar a JSON</button>
      </div>
      <div className="panel-search">
        <input type="search" inputMode="search" placeholder="Buscar producto en las ventas…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {searching && <button type="button" className="panel-search-clear" title="Limpiar búsqueda" onClick={() => setQuery('')}>×</button>}
      </div>
      {searching && <p className="muted panel-search-info">{sales.length} venta{sales.length === 1 ? '' : 's'} con «{esc(query.trim())}».</p>}
      {!dates.length ? (searching ? <div className="notice">No se encontraron ventas con «{esc(query.trim())}».</div> : <div className="empty"><div className="emoji">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-line)', display: 'block', margin: '0 auto' }}>
          <rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M8 2.5v4M16 2.5v4M3 9.5h18" /><path d="M8.5 14.8l2.4 2.4 4.6-4.8" strokeWidth="2" />
        </svg>
      </div><b>Aún no hay ventas registradas</b><p>Registra tu primera venta desde la pestaña Inicio.</p></div>) : dates.map((d) => {
        const list = groups[d];
        const dayUnits = list.reduce((a, x) => a + saleUnits(x), 0);
        const dayMoney = list.reduce((a, x) => a + total(x, s), 0);
        return (
          <div className="history-day" key={d}>
            <div className="history-day-title"><b>{formatDate(d)}</b><span className="muted">{list.length} venta{list.length === 1 ? '' : 's'} · {dayUnits} unidades · {money(dayMoney)}</span></div>
            <div className="table-scroll"><table className="history-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Productos</th><th>Precio</th><th>Empleado</th><th></th></tr></thead><tbody>
              {list.map((x) => (
                <Fragment key={x.id}>
                  <tr>
                    <td>{shortDate(x.date)}</td><td>{esc(x.time || '—')}{x.event ? <span className="prod-tag ev-tag" title={esc(x.event)}>Evento: {esc(x.event)}</span> : null}</td><td>{saleUnits(x)}</td><td><b>{money(total(x, s))}</b></td><td>{esc(x.employee || '—')}</td>
                    <td><div className="sale-actions">
                      {manage && <button type="button" className="icon-btn sale-details-btn" title="Editar venta" aria-label="Editar venta" onClick={() => startEdit(x)}><PencilIcon size={13} /></button>}
                      {manage && <button type="button" className="icon-btn sale-details-btn danger" title="Borrar venta" aria-label="Borrar venta" onClick={() => deleteSale(x)}><CloseIcon size={13} /></button>}
                      <button className="icon-btn sale-details-btn" title="Ver detalles" onClick={() => setOpen((o) => ({ ...o, [x.id]: !o[x.id] }))}><span className="sale-caret"><CaretIcon size={14} /></span></button>
                    </div></td>
                  </tr>
                  {open[x.id] && <tr className="sale-detail-row"><td colSpan={6}><div className="sale-detail"><div className="sale-detail-title">Detalles de la venta</div>{details(x).length ? details(x) : <p className="muted" style={{ margin: 0 }}>Sin productos en esta venta.</p>}</div></td></tr>}
                </Fragment>
              ))}
            </tbody></table></div>
          </div>
        );
      })}
    </div>
  );
}
