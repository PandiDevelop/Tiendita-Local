import { useState } from 'react';
import { useStore } from '../store';
import { costFor, esc, money, priceFor, today } from '../lib/core';
import type { Sale, Store as IStore } from '../types';

type RangeMode = 'todo' | 'hoy' | 'mes' | 'rango';

interface PLine { pid: string; name: string; qty: number; revenue: number; cost: number; profit: number; }

// Igual que monthLines en Dashboard.tsx, pero acumulando ingreso, costo y
// ganancia por producto en vez de solo el valor vendido.
function profitLines(s: IStore, sales: Sale[]): PLine[] {
  const lines: PLine[] = [];
  sales.forEach((sale) => sale.items.forEach((i) => {
    if (!i.qty) return;
    const p = s.products.find((px) => px.id === i.productId);
    if (!p) return;
    let line = lines.find((z) => z.pid === i.productId);
    if (!line) { line = { pid: i.productId, name: p.name, qty: 0, revenue: 0, cost: 0, profit: 0 }; lines.push(line); }
    const rev = priceFor(i, s) * i.qty;
    const cst = costFor(i, s) * i.qty;
    line.qty += i.qty;
    line.revenue += rev;
    line.cost += cst;
    line.profit += rev - cst;
  }));
  return lines.sort((a, b) => b.profit - a.profit);
}

export function Profit() {
  const { store } = useStore();
  const s = store!;
  const [mode, setMode] = useState<RangeMode>('todo');
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());

  const filtered = s.sales.filter((x) => {
    if (mode === 'todo') return true;
    if (mode === 'hoy') return x.date === today();
    if (mode === 'mes') return x.date.slice(0, 7) === today().slice(0, 7);
    if (mode === 'rango') {
      const lo = from <= to ? from : to;
      const hi = from <= to ? to : from;
      return x.date >= lo && x.date <= hi;
    }
    return true;
  });

  const revenue = filtered.reduce((a, x) => a + x.items.reduce((b, i) => b + priceFor(i, s) * i.qty, 0), 0);
  const cost = filtered.reduce((a, x) => a + x.items.reduce((b, i) => b + costFor(i, s) * i.qty, 0), 0);
  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const lines = profitLines(s, filtered);

  return (
    <>
      <div className="panel">
        <div className="panel-head"><div><h2>Ganancias</h2><p className="muted">Ingresos, costo y ganancia de tus ventas. Filtra por fecha si quieres ver un periodo específico.</p></div></div>
        <div className="day-tabs">
          <button className={'day-tab ' + (mode === 'todo' ? 'active' : '')} onClick={() => setMode('todo')}>Todo</button>
          <button className={'day-tab ' + (mode === 'hoy' ? 'active' : '')} onClick={() => setMode('hoy')}>Hoy</button>
          <button className={'day-tab ' + (mode === 'mes' ? 'active' : '')} onClick={() => setMode('mes')}>Este mes</button>
          <button className={'day-tab ' + (mode === 'rango' ? 'active' : '')} onClick={() => setMode('rango')}>Rango de fechas</button>
        </div>
        {mode === 'rango' && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '10px 0 4px' }}>
            <div className="field" style={{ flex: '1 1 140px', margin: 0 }}><label>Desde</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="field" style={{ flex: '1 1 140px', margin: 0 }}><label>Hasta</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        )}
      </div>
      <div className="grid">
        <div className="card stat"><div className="muted">Ingresos</div><div className="value">{money(revenue)}</div><div className="small">{filtered.length} venta{filtered.length === 1 ? '' : 's'}</div></div>
        <div className="card stat"><div className="muted">Costo</div><div className="value">{money(cost)}</div><div className="small">Costo de lo vendido</div></div>
        <div className="card stat accent"><div className="muted">Ganancia</div><div className="value">{money(profit)}</div><div className="small">{revenue > 0 ? margin.toFixed(1) + '% de margen' : 'Sin ventas en este periodo'}</div></div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Ganancia por producto</h2><p className="muted">Ordenado de mayor a menor ganancia.</p></div></div>
        {lines.length ? (
          <table><thead><tr><th>Producto</th><th>Unidades</th><th>Ingresos</th><th>Costo</th><th>Ganancia</th></tr></thead><tbody>
            {lines.map((x) => (
              <tr key={x.pid}><td className="product-name">{esc(x.name)}</td><td>{x.qty}</td><td>{money(x.revenue)}</td><td>{money(x.cost)}</td><td><b>{money(x.profit)}</b></td></tr>
            ))}
          </tbody></table>
        ) : <div className="notice">No hay ventas registradas en este periodo.</div>}
      </div>
    </>
  );
}
