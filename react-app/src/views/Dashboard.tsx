import { useStore } from '../store';
import { money, formatDate, today, total, priceFor, esc } from '../lib/core';
import type { SaleItem } from '../types';

interface Line { pid: string; name: string; qty: number; value: number; prs: string[]; }

function monthLines(s: IStore, records: { items: SaleItem[] }[]): Line[] {
  const lines: Line[] = [];
  records.forEach((x) => x.items.forEach((i) => {
    if (!i.qty) return;
    const p = s.products.find((px) => px.id === i.productId);
    if (!p) return;
    let line = lines.find((z) => z.pid === i.productId);
    if (!line) { line = { pid: i.productId, name: p.name, qty: 0, value: 0, prs: [] }; lines.push(line); }
    line.qty += i.qty; line.value += priceFor(i, s) * i.qty;
    const pr = p.promos.find((z) => z.id === i.promotionId);
    if (pr && !line.prs.includes(pr.label)) line.prs.push(pr.label);
  }));
  return lines.sort((a, b) => b.value - a.value);
}

function monthOf(d?: string | null) { return (d || today()).slice(0, 7); }
function monthLabel(mm: string) {
  let s = new Date(mm + '-01T12:00:00').toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Dashboard() {
  const { store, state, replace, setModal } = useStore();
  const s = store!;
  const dates = [...new Set(s.sales.map((x) => x.date))].sort((a, b) => b.localeCompare(a));
  const page = state.summaryPage || 0;
  const shown = dates.slice(page * 5, page * 5 + 5);
  const selected = state.summaryDate && shown.includes(state.summaryDate) ? state.summaryDate : (shown[0] || today());
  const records = s.sales.filter((x) => x.date === selected);
  const units = records.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
  const revenue = records.reduce((a, x) => a + total(x, s), 0);
  const lines = monthLines(s, records);
  const mm = state.summaryMonth || (selected ? selected.slice(0, 7) : monthOf(today()));
  const mrec = s.sales.filter((x) => x.date.startsWith(mm));
  const mdays = [...new Set(mrec.map((x) => x.date))].length;
  const munits = mrec.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
  const mrev = mrec.reduce((a, x) => a + total(x, s), 0);
  const mlines = monthLines(s, mrec);

  return (
    <>
      <div className="sale-cta-row"><button className="button primary sale-cta" onClick={() => setModal('sale')}>＋ Registrar venta</button></div>
      <div className="grid">
        <div className="card stat"><div className="muted">Productos registrados</div><div className="value">{s.products.length}</div><div className="small">En tu catálogo</div></div>
        <div className="card stat"><div className="muted">Unidades vendidas</div><div className="value">{units}</div><div className="small">{formatDate(selected)}</div></div>
        <div className="card stat accent"><div className="muted">Total producido</div><div className="value">{money(revenue)}</div><div className="small">{formatDate(selected)}</div></div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Resumen por día</h2><p className="muted">Lo vendido por día.</p></div></div>
        {dates.length ? (
          <>
            <div className="day-tabs">
              {shown.map((d) => (
                <button key={d} className={'day-tab ' + (d === selected ? 'active' : '')} onClick={() => replace((x) => { x.summaryDate = d; })}>{formatDate(d)}</button>
              ))}
            </div>
            {lines.length ? (
              <table><thead><tr><th>Producto</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>
                {lines.map((x) => (
                  <tr key={x.pid}><td className="product-name cat-bar"><span className="prod-main">{esc(x.name)}</span>{x.prs.length ? <span className="prod-sub">{x.prs.map(esc).join(' · ')}</span> : null}</td><td>{x.qty}</td><td><b>{money(x.value)}</b></td></tr>
                ))}
              </tbody></table>
            ) : <div className="notice">No se registraron ventas este día.</div>}
          </>
        ) : <div className="notice">Cuando registres ventas, aquí verás el detalle diario.</div>}
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Resumen del mes</h2><p className="muted">Lo vendido en el mes.</p></div></div>
        <div className="day-tabs"><button className="day-nav" onClick={() => replace((x) => { x.summaryMonth = monthShift(mm, -1); }) }>←</button><b className="month-label">{monthLabel(mm)}</b><button className="day-nav" onClick={() => replace((x) => { x.summaryMonth = monthShift(mm, 1); })}>→</button></div>
        <div className="month-stats"><span>{mdays} día{mdays === 1 ? '' : 's'} con ventas</span><b>{munits} unidades vendidas</b><b>{money(mrev)} producido</b></div>
        {mrec.length ? (
          <table><thead><tr><th>Producto</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>
            {mlines.map((x) => (
              <tr key={x.pid}><td className="product-name cat-bar"><span className="prod-main">{esc(x.name)}</span>{x.prs.length ? <span className="prod-sub">{x.prs.map(esc).join(' · ')}</span> : null}</td><td>{x.qty}</td><td><b>{money(x.value)}</b></td></tr>
            ))}
          </tbody></table>
        ) : <div className="notice">No hay ventas registradas {monthLabel(mm).toLowerCase()}.</div>}
      </div>
    </>
  );
}

function monthShift(mm: string, delta: number) {
  let y = +mm.slice(0, 4), m = +mm.slice(5, 7) + delta;
  while (m < 1) { m += 12; y--; }
  while (m > 12) { m -= 12; y++; }
  return y + '-' + ('0' + m).slice(-2);
}

import type { Store as IStore } from '../types';
