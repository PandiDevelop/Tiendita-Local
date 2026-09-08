import { Fragment, ReactNode, useState } from 'react';
import { useStore } from '../store';
import { money, esc, total, shortDate, saleUnits, priceFor, formatDate, catLabel, findActivePromo } from '../lib/core';
import type { Product, Sale, SaleItem } from '../types';

export function History() {
  const { store } = useStore();
  const s = store!;
  const [open, setOpen] = useState<Record<string, boolean>>({});

  function exportExcel(sales: Sale[]) {
    const rows: (string | number)[][] = [['Tienda', 'Fecha', 'Hora', 'Producto', 'Ítem', 'Precio', 'Cantidad vendida', 'Total', 'Empleado']];
    sales.forEach((x) => x.items.forEach((i) => {
      const p = s.products.find((pp) => pp.id === i.productId);
      const pr = p && p.promos.find((z) => z.id === i.promotionId);
      const name = pr ? pr.label : (p ? p.name : 'Producto eliminado');
      const parent = pr ? p!.name : 'Producto';
      rows.push([s.name, x.date, x.time || '', parent, name, priceFor(i, s), i.qty, priceFor(i, s) * i.qty, x.employee || '']);
    }));
    const csv = '\ufeff' + rows.map((r) => r.map((v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ventas-' + s.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-') + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const sales = [...s.sales].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || ''));
  const groups: Record<string, typeof sales> = {};
  sales.forEach((x) => { const d = x.date || ''; (groups[d] = groups[d] || []).push(x); });
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  function details(x: Sale): ReactNode[] {
    const cats = new Map<string, { name: string; p: Product | null; items: SaleItem[]; qty: number }>();
    x.items.filter((i) => i.qty > 0).forEach((i) => {
      const p = s.products.find((pp) => pp.id === i.productId) || null;
      const name = p ? catLabel(p) : 'Sin categoría';
      let g = cats.get(name);
      if (!g) { g = { name, p, items: [], qty: 0 }; cats.set(name, g); }
      g.items.push(i);
      g.qty += i.qty;
    });
    const out: ReactNode[] = [];
    cats.forEach((g) => {
      const subtotal = g.items.reduce((n, i) => n + priceFor(i, s) * i.qty, 0);
      const pr = g.p && findActivePromo(g.p, g.qty);
      const pack = pr && pr.cond === 'qtyeq' ? pr : undefined;
      if (pack) {
        // Paquete de promocion: agrupa en una sola linea el total y aparte cada
        // producto del paquete para leer la informacion mas clara.
        out.push(
          <div className="sale-detail-group" key={'p:' + g.name}>
            <div className="sale-detail-pack"><span className="sale-detail-title">Paquete: {esc(pack.label)}</span><b className="sale-detail-cost">{money(subtotal)}</b></div>
            {g.items.map((i, k) => {
              const p = s.products.find((pp) => pp.id === i.productId);
              return (
                <div className="sale-detail-line" key={i.productId + ':' + k}>
                  <div className="sale-detail-name"><span>{esc(p ? p.name : 'Producto eliminado')}</span><b>× {i.qty}</b></div>
                </div>
              );
            })}
          </div>
        );
      } else {
        g.items.forEach((i, k) => {
          const p = s.products.find((pp) => pp.id === i.productId);
          const pr2 = p && p.promos.find((z) => z.id === i.promotionId);
          out.push(
            <div className="sale-detail-line" key={i.productId + ':' + (i.promotionId || '')}>
              <div className="sale-detail-name"><span>{esc(p ? p.name : 'Producto eliminado')}{pr2 ? <span className="prod-sub">{esc(pr2.label)}</span> : null}</span><b>× {i.qty}</b></div>
              <b className="sale-detail-cost">{money(priceFor(i, s) * i.qty)}</b>
            </div>
          );
        });
      }
    });
    return out;
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Historial de ventas</h2><p className="muted">Cada venta se guarda con fecha, hora y el empleado que la registró.</p></div>
        <button className="button secondary" onClick={() => exportExcel(s.sales)}>⇩ Exportar a Excel</button>
      </div>
      {!dates.length ? <div className="empty"><div className="emoji">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a98dde', display: 'block', margin: '0 auto' }}>
          <rect x="3" y="4.5" width="18" height="16" rx="3" /><path d="M8 2.5v4M16 2.5v4M3 9.5h18" /><path d="M8.5 14.8l2.4 2.4 4.6-4.8" strokeWidth="2" />
        </svg>
      </div><b>Aún no hay ventas registradas</b><p>Registra tu primera venta desde la pestaña Inicio.</p></div> : dates.map((d) => {
        const list = groups[d];
        const dayUnits = list.reduce((a, x) => a + saleUnits(x), 0);
        const dayMoney = list.reduce((a, x) => a + total(x, s), 0);
        return (
          <div className="history-day" key={d}>
            <div className="history-day-title"><b>{formatDate(d)}</b><span className="muted">{list.length} venta{list.length === 1 ? '' : 's'} · {dayUnits} unidades · {money(dayMoney)}</span></div>
            <table className="history-table"><thead><tr><th>Fecha</th><th>Hora</th><th>Productos</th><th>Precio</th><th>Empleado</th><th></th></tr></thead><tbody>
              {list.map((x) => (
                <Fragment key={x.id}>
                  <tr>
                    <td>{shortDate(x.date)}</td><td>{esc(x.time || '—')}{x.event ? <span className="prod-tag ev-tag" title={esc(x.event)}>Evento: {esc(x.event)}</span> : null}</td><td>{saleUnits(x)}</td><td><b>{money(total(x, s))}</b></td><td>{esc(x.employee || '—')}</td>
                    <td><button className="icon-btn sale-details-btn" title="Ver detalles" onClick={() => setOpen((o) => ({ ...o, [x.id]: !o[x.id] }))}><span className="sale-caret">▾</span></button></td>
                  </tr>
                  {open[x.id] && <tr className="sale-detail-row"><td colSpan={6}><div className="sale-detail"><div className="sale-detail-title">Detalles de la venta</div>{details(x).length ? details(x) : <p className="muted" style={{ margin: 0 }}>Sin productos en esta venta.</p>}</div></td></tr>}
                </Fragment>
              ))}
            </tbody></table>
          </div>
        );
      })}
    </div>
  );
}
