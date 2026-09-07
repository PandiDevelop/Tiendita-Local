import { Fragment, useState } from 'react';
import { useStore } from '../store';
import { money, esc, priceFor, formatDate, itemLabel } from '../lib/core';

interface EmpAcc { units: number; money: number; days: Set<string>; detail: Record<string, { units: number; money: number; rows: Record<string, { name: string; sub: string; qty: number; money: number }> }>; }

export function Employees() {
  const { store } = useStore();
  const s = store!;
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const acc: Record<string, EmpAcc> = {};
  s.sales.forEach((x) => {
    const emp = (x.employee || '').trim() || 'Trabajador';
    const a = acc[emp] || (acc[emp] = { units: 0, money: 0, days: new Set(), detail: {} });
    x.items.forEach((i) => {
      if (!i.qty) return;
      const val = priceFor(i, s) * i.qty;
      a.units += i.qty; a.money += val; a.days.add(x.date);
      const d = a.detail[x.date] || (a.detail[x.date] = { units: 0, money: 0, rows: {} });
      d.units += i.qty; d.money += val;
      const key = i.productId + '|' + (i.promotionId || '');
      const p = s.products.find((pp) => pp.id === i.productId);
      const pr = p && p.promos.find((z) => z.id === i.promotionId);
      const r = d.rows[key] || (d.rows[key] = { name: itemLabel(i, s), sub: (pr && pr.label) || '', qty: 0, money: 0 });
      r.qty += i.qty; r.money += val;
    });
  });

  const rows = Object.keys(acc).map((emp) => ({ name: emp, a: acc[emp] })).sort((x, y) => y.a.money - x.a.money);

  const detail = (emp: string, a: EmpAcc) => {
    if (!a || !Object.keys(a.detail).length) return <p className="muted" style={{ margin: 0 }}>Todavía no registra ventas.</p>;
    return Object.keys(a.detail).sort((x, y) => y.localeCompare(x)).map((dt) => {
      const d = a.detail[dt];
      return (
        <div key={emp + dt}>
          <div className="emp-date"><b>{formatDate(dt)}</b><span className="muted">{d.units} uds · {money(d.money)}</span></div>
          <div className="emp-items">
            {Object.keys(d.rows).map((k) => (
              <div className="emp-item" key={emp + dt + k}>
                <span>{esc(d.rows[k].name)}{d.rows[k].sub ? <span className="emp-sub">{esc(d.rows[k].sub)}</span> : null}</span>
                <b>{d.rows[k].qty} ×</b><span className="muted">{money(d.rows[k].money)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="panel">
      <div className="panel-head"><div><h2>Registro de empleados</h2><p className="muted">Unidades y producido de cada empleado según el nombre con el que registró sus ventas. Toca ▾ para ver el detalle por fecha.</p></div></div>
      {rows.length ? (
        <table><thead><tr><th>Empleado</th><th>Unidades vendidas</th><th>Producido</th><th>Días con ventas</th><th></th></tr></thead><tbody>
          {rows.map((r) => (
            <Fragment key={r.name}>
              <tr><td className="product-name">{esc(r.name)}</td><td>{r.a.units}</td><td><b>{money(r.a.money)}</b></td><td>{r.a.days.size}</td>
                <td><button className="icon-btn emp-toggle" title="Ver qué vendió" onClick={() => setOpen((o) => ({ ...o, [r.name]: !o[r.name] }))}>▾</button></td>
              </tr>
              {open[r.name] && <tr className="emp-detail-row"><td colSpan={5}><div className="emp-detail">{detail(r.name, r.a)}</div></td></tr>}
            </Fragment>
          ))}
        </tbody></table>
      ) : <div className="empty"><div className="emoji">👥</div><b>Aún no hay ventas registradas</b><p>Cuando alguien registre una venta con su nombre, aquí verás lo que produjo.</p></div>}
    </div>
  );
}