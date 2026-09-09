import { Fragment, useState } from 'react';
import { useStore } from '../store';
import { money, esc, priceFor, formatDate, itemLabel, syncClientId } from '../lib/core';
import type { Member, Role } from '../types';

interface EmpAcc { units: number; money: number; days: Set<string>; detail: Record<string, { units: number; money: number; rows: Record<string, { name: string; sub: string; qty: number; money: number }> }>; }

// Etiqueta visible para cada rol del equipo. Quien creo la tienda es siempre
// Dueño (aunque su Member.role sea 'owner' en members); los demás usan
// el rol que el dueño les asignó.
function roleLabel(role: Role): string {
  if (role === 'owner') return 'Dueño';
  if (role === 'admin') return 'Administrador';
  return 'Trabajador';
}

export function Employees() {
  const { store } = useStore();
  const s = store!;
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // Equipo vinculado: su id en la tienda (clientId), nombre y rol. El rol del
  // dueño real (createdBy) siempre es Dueño, haya o no entrada en members.
  const ownerId = s.createdBy || null;
  const members = Object.entries(s.members || {}) as [string, Member][];
  const teamRows = members
    .map(([cid, m]) => ({ cid, name: m.name || 'Trabajador', role: cid === ownerId ? 'owner' as Role : (m.role || 'worker' as Role), me: cid === syncClientId() }))
    .sort((a, b) => (a.role === 'owner' ? -1 : b.role === 'owner' ? 1 : a.name.localeCompare(b.name)));
  // La lista del equipo se separa por secciones segun el rol de cada miembro
  // (Dueños / Administradores / Trabajadores), siempre con la misma sección
  // aunque no tenga integrantes.
  const teamGroups: { role: Role; label: string; rows: typeof teamRows }[] = [
    { role: 'owner', label: 'Dueños', rows: teamRows.filter((m) => m.role === 'owner') },
    { role: 'admin', label: 'Administradores', rows: teamRows.filter((m) => m.role === 'admin') },
    { role: 'worker', label: 'Trabajadores', rows: teamRows.filter((m) => m.role === 'worker') },
  ];

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
      <div className="panel-head"><div><h2>Registro de empleados</h2><p className="muted">Equipo y cuánto vendió cada quien.</p></div></div>

      {teamRows.length ? (
        <div className="team-list">
          <div className="team-list-title">Equipo · rol de cada miembro</div>
          {teamGroups.map((g) => g.rows.length ? (
            <div className="team-group" key={g.role}>
              <div className="team-group-title">{g.label}</div>
              {g.rows.map((m) => (
                <div className="team-row" key={m.cid}>
                  <span className="team-name">{esc(m.name)}{m.me ? <span className="team-me">tú</span> : null}</span>
                  <span className={'role-pill role-' + m.role}>{roleLabel(m.role)}</span>
                </div>
              ))}
            </div>
          ) : null)}
        </div>
      ) : null}

      {rows.length ? (
        <div className="table-scroll">
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
        </div>
      ) : <div className="notice">Aún no hay ventas registradas.{teamRows.length ? '' : ' Cuando alguien registre una venta con su nombre, aquí verás lo que produjo.'}</div>}
    </div>
  );
}