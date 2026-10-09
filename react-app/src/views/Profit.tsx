import { useState } from 'react';
import { useStore } from '../store';
import { costFor, esc, money, priceFor, today, DEFAULT_PRODUCT_IMAGE, inventorySold, groupedByCategory, productTags, productLedger } from '../lib/core';
import { CaretIcon, Image, HScroll } from '../ui';
import { History } from './History';
import type { Sale, Store as IStore } from '../types';

type RangeMode = 'todo' | 'hoy' | 'mes' | 'rango';
type ViewMode = 'resumen' | 'historial';

interface PLine { pid: string; name: string; image: string; qty: number; revenue: number; cost: number; profit: number; }

// Igual que monthLines en Dashboard.tsx, pero acumulando ingreso, costo y
// ganancia por producto en vez de solo el valor vendido.
function profitLines(s: IStore, sales: Sale[]): PLine[] {
  const lines: PLine[] = [];
  sales.forEach((sale) => sale.items.forEach((i) => {
    if (!i.qty) return;
    const p = s.products.find((px) => px.id === i.productId);
    if (!p) return;
    let line = lines.find((z) => z.pid === i.productId);
    if (!line) { line = { pid: i.productId, name: p.name, image: p.image, qty: 0, revenue: 0, cost: 0, profit: 0 }; lines.push(line); }
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
  const [view, setView] = useState<ViewMode>('resumen');
  const [mode, setMode] = useState<RangeMode>('todo');
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  // Categorias plegables: por defecto abiertas; tocar la cabecera las
  // despliega/pliega y la fila ordena por la ganancia del periodo.
  const [folded, setFolded] = useState<Record<string, boolean>>({});

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
  const topProfit = lines.length ? lines[0].profit : 0;
  // Existencias totales: la suma de lo que hay disponible de todos los
  // productos (lo que se compró de cada uno menos lo que ya se vendió).
  const sold = inventorySold(s);
  const inv = s.inventory || {};
  const stockTotal = s.products.reduce((a, p) => a + Math.max(0, (inv[p.id] || 0) - (sold[p.id] || 0)), 0);

  return (
    <>
      <div className="grid profit-grid">
        <div className="card stat stat-h stat-panel">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          </div>
          <div className="captioned-stat"><div>Ingresos</div><div className="value">{money(revenue)}</div></div>
          <div className="small">{filtered.length} venta{filtered.length === 1 ? '' : 's'}</div>
        </div>
        <div className="card stat stat-h stat-panel">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M3 7l9 6 9-6" /><path d="M9 20h6" /></svg>
          </div>
          <div className="captioned-stat"><div>Coste de producción</div><div className="value">{money(cost)}</div></div>
          <div className="small">{stockTotal} producto{stockTotal === 1 ? '' : 's'} en existencias</div>
        </div>
        <div className="card stat stat-h stat-panel">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          </div>
          <div className="captioned-stat"><div>Ganancia</div><div className="value">{money(profit)}</div></div>
          <div className="small">{revenue > 0 ? margin.toFixed(1) + '% de margen' : 'Sin ventas en este periodo'}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div><h2>Ganancias</h2><p className="muted">Ingresos, costo y ganancia.</p></div>
          <div className="inv-modes">
            <button type="button" className={'inv-mode' + (view === 'resumen' ? ' on' : '')} onClick={() => setView('resumen')}>Resumen</button>
            <button type="button" className={'inv-mode' + (view === 'historial' ? ' on' : '')} onClick={() => setView('historial')}>Historial de ventas</button>
          </div>
        </div>
        {view === 'resumen' && (
          <>
            <div className="day-tabs">
              <button className={'day-tab ' + (mode === 'todo' ? 'active' : '')} onClick={() => setMode('todo')}>Todo</button>
              <button className={'day-tab ' + (mode === 'hoy' ? 'active' : '')} onClick={() => setMode('hoy')}>Hoy</button>
              <button className={'day-tab ' + (mode === 'mes' ? 'active' : '')} onClick={() => setMode('mes')}>Este mes</button>
              <button className={'day-tab ' + (mode === 'rango' ? 'active' : '')} onClick={() => setMode('rango')}>Rango de fechas</button>
            </div>
            {mode === 'rango' && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '2px 0 4px' }}>
                <div className="field" style={{ flex: '1 1 140px', margin: 0 }}><label>Desde</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="field" style={{ flex: '1 1 140px', margin: 0 }}><label>Hasta</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {view === 'historial' ? <History /> : (
        <div className="panel">
          <div className="panel-head"><div><h2>Ganancia por producto</h2><p className="muted">De mayor a menor ganancia: la categoría que más gana arriba y, dentro de cada una, el producto que más gana primero. “Vendido” y “Adquirido” son el total histórico.</p></div></div>
          {s.products.length ? (
            (() => {
              const ledger = productLedger(s);
              const period = new Map(lines.map((x) => [x.pid, x]));
              const pf = (pid: string) => period.get(pid)?.profit || 0;
              const cats = groupedByCategory(s)
                .map((g) => ({
                  name: g.name,
                  rows: [...g.list].sort((a, b) => pf(b.id) - pf(a.id) || (a.name || '').localeCompare(b.name || '', 'es')),
                  profit: g.list.reduce((n, p) => n + pf(p.id), 0),
                }))
                .sort((a, b) => b.profit - a.profit)
                .filter((c) => c.rows.length > 0);
              return (
                <div className="cat-list">
                  {cats.map((c) => {
                    const closed = folded[c.name] === true;
                    const catBought = c.rows.reduce((a, p) => a + (ledger[p.id]?.acquired || 0), 0);
                    const catSold = c.rows.reduce((a, p) => a + (ledger[p.id]?.sold || 0), 0);
                    const catRev = c.rows.reduce((a, p) => a + (period.get(p.id)?.revenue || 0), 0);
                    return (
                      <div className="cat-group" key={c.name}>
                        <div className={'cat-head' + (closed ? ' closed' : '')} onClick={() => setFolded((f) => ({ ...f, [c.name]: !closed }))}>
                          <b>{esc(c.name)}</b>
                          <span className="cat-head-counts muted">· {c.rows.length} producto{c.rows.length === 1 ? '' : 's'} · {catBought} adquirido{catBought === 1 ? '' : 's'} · {catSold} vendido{catSold === 1 ? '' : 's'} · {money(catRev)} ingresos · {money(c.profit)} ganancia</span>
                          <span className="sale-caret"><CaretIcon size={13} /></span>
                        </div>
                        {!closed && (
                          <div className="cat-body">
                            <HScroll ariaLabel={'Ganancias de ' + c.name}>
                              <table><thead><tr><th>Producto</th><th>Vendido</th><th>Adquirido</th><th>Coste</th><th>Ingreso</th><th>Ganancia</th></tr></thead><tbody>
                                {c.rows.map((p) => {
                                  const l = ledger[p.id] || { sold: 0, acquired: 0, available: 0, revenue: 0, cost: 0, profit: 0 };
                                  const pl = period.get(p.id);
                                  const revenue = pl?.revenue || 0;
                                  const cost = pl?.cost || 0;
                                  const profit = pl?.profit || 0;
                                  const pct = topProfit > 0 ? Math.max(0, profit / topProfit) * 100 : 0;
                                  return (
                                    <tr key={p.id}>
                                      <td className="cat-bar"><div className="product-cell"><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /><div className="product-name">{esc(p.name)}{productTags(p).map((t) => <span className="prod-tag" key={t} title={esc(t)}>{esc(t)}</span>)}</div></div></td>
                                      <td>{l.sold || '—'}</td>
                                      <td>{l.acquired || '—'}</td>
                                      <td className="muted">{cost ? money(cost) : '—'}</td>
                                      <td>{revenue ? money(revenue) : '—'}</td>
                                      <td>
                                        <div className="profit-cell">{profit !== 0 ? <b className={profit > 0 ? 'profit-pos' : 'profit-neg'}>{money(profit)}</b> : <span className="muted">—</span>}<div className="profit-bar"><span style={{ width: pct + '%' }}></span></div></div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody></table>
                            </HScroll>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : <div className="notice">No hay productos todavía.</div>}
        </div>
      )}
    </>
  );
}