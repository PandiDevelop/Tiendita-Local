import { useStore } from '../store';
import { money, formatDate, today, total, priceFor, esc } from '../lib/core';
import { BoxIcon, CartIcon, CashIcon, ChevronIcon } from '../ui';
import type { SaleItem } from '../types';

import type { Store as IStore } from '../types';

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
  // Día seleccionado del resumen por día: en vez de pasar solo por los días
  // con ventas, se muestran siempre TRES fechas seguidas (día anterior, hoy y
  // día siguiente) y las flechas lo mueven de un día a otro, para poder ver
  // también qué días se quedaron sin registrar ventas.
  const selected = state.summaryDate || today();
  const prev = shiftDay(selected, -1);
  const next = shiftDay(selected, 1);
  const shown = [prev, selected, next];
  const records = s.sales.filter((x) => x.date === selected);
  const units = records.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
  const revenue = records.reduce((a, x) => a + total(x, s), 0);
  const lines = monthLines(s, records);
  const mm = state.summaryMonth || (selected ? selected.slice(0, 7) : monthOf(today()));
  const mrec = s.sales.filter((x) => x.date.startsWith(mm));
  const munits = mrec.reduce((a, x) => a + x.items.reduce((b, i) => b + i.qty, 0), 0);
  const mrev = mrec.reduce((a, x) => a + total(x, s), 0);
  const mlines = monthLines(s, mrec);

  return (
    <>
      <div className="sale-cta-row"><button className="button primary sale-cta" onClick={() => setModal('sale')}>＋ Registrar venta</button></div>
      <div className="grid profit-grid">
        <div className="card stat stat-h stat-panel"><div className="stat-icon"><BoxIcon size={18} /></div><div className="captioned-stat"><div>Productos</div><div className="value">{s.products.length}</div></div></div>
        <div className="card stat stat-h stat-panel"><div className="stat-icon"><CartIcon size={18} /></div><div className="captioned-stat"><div>Unidades</div><div className="value">{units}</div><div className="small">{formatDate(selected)}</div></div></div>
        <div className="card stat stat-h stat-panel"><div className="stat-icon"><CashIcon size={18} /></div><div className="captioned-stat"><div>Total producido</div><div className="value">{money(revenue)}</div><div className="small">{formatDate(selected)}</div></div></div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Resumen por día</h2></div></div>
        <div className="day-tabs">
          <button className="day-nav" onClick={() => replace((x) => { x.summaryDate = prev; })}><ChevronIcon dir="left" /></button>
          {shown.map((d) => (
            <button key={d} className={'day-tab ' + (d === selected ? 'active' : '')} onClick={() => replace((x) => { x.summaryDate = d; })}>{d === today() ? 'Hoy · ' : ''}{formatDate(d)}</button>
          ))}
          <button className="day-nav" onClick={() => replace((x) => { x.summaryDate = next; })}><ChevronIcon dir="right" /></button>
        </div>
        {lines.length ? (
          <table><thead><tr><th>Producto</th><th>Unidades</th><th>Producido</th></tr></thead><tbody>
            {lines.map((x) => (
              <tr key={x.pid}><td className="product-name cat-bar"><span className="prod-main">{esc(x.name)}</span>{x.prs.length ? <span className="prod-sub">{x.prs.map(esc).join(' · ')}</span> : null}</td><td>{x.qty}</td><td><b>{money(x.value)}</b></td></tr>
            ))}
          </tbody></table>
        ) : <div className="notice">No se registraron ventas este día.</div>}
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Resumen del mes</h2></div></div>
        <div className="day-tabs month-nav"><button className="day-nav" onClick={() => replace((x) => { x.summaryMonth = monthShift(mm, -1); }) }><ChevronIcon dir="left" /></button><b className="month-label">{monthLabel(mm)}</b><button className="day-nav" onClick={() => replace((x) => { x.summaryMonth = monthShift(mm, 1); })}><ChevronIcon dir="right" /></button></div>
        <div className="month-stats"><span>{munits} unidades</span><span className="month-sep">·</span><span>{money(mrev)} producido</span></div>
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

// Un día antes o después de una fecha YYYY-MM-DD (a mediodía local, para no
// saltarse el día por el cambio de zona horaria).
function shiftDay(d: string, delta: number) {
  const dt = new Date(d.slice(0, 4) + '-' + d.slice(5, 7) + '-' + d.slice(8, 10) + 'T12:00:00');
  dt.setDate(dt.getDate() + delta);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
