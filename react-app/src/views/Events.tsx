import { useState } from 'react';
import { useStore } from '../store';
import { activeEvent, esc, uid } from '../lib/core';
import { customConfirm } from '../lib/dialog';
import type { StoreEvent } from '../types';

// Plantilla de un evento nuevo: por defecto % de descuento activo desde hoy.
function blankEvent(): StoreEvent {
  const t = new Date().toISOString().slice(0, 10);
  return { id: uid(), name: '', pct: 0, active: true, start: t, end: '' };
}

// Pestana Eventos: un evento activa una promocion para TODO mientras dura. Sus
// ventas registradas durante el evento se descuentan automaticamente (ver
// saleUnitPrice en core.ts) y quedan etiquetadas con el nombre del evento en
// el historial (campo 'event' de la venta).
export function Events() {
  const { store, replace } = useStore();
  const s = store!;
  const events: StoreEvent[] = (s.events || []).slice();
  const [adding, setAdding] = useState(false);

  const act = activeEvent(s);

  function patch(id: string, p: Partial<StoreEvent>) {
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (st.events) st.events = st.events.map((e) => (e.id === id ? { ...e, ...p } : e));
    });
  }

  function add() {
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.events = [...(st.events || []), blankEvent()];
    });
    setAdding(false);
  }

  async function remove(id: string) {
    const e = events.find((x) => x.id === id);
    if (!(await customConfirm(`¿Eliminar el evento ${e && e.name ? `"${e.name}"` : 'sin nombre'}?`))) return;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (st.events) st.events = st.events.filter((x) => x.id !== id);
    });
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>Eventos</h2>
          <p className="muted">Un evento aplica su descuento a todas las ventas mientras esté activo. Las ventas hechas durante un evento quedan marcadas con su nombre en Ganancias.</p>
        </div>
        {!adding && <button className="button primary" onClick={() => setAdding(true)}>＋ Nuevo evento</button>}
      </div>

      {events.length === 0 && !adding && <div className="notice">No hay eventos todavía. Crea uno para promocionar todo durante una fecha especial.</div>}
      {adding && (
        <div className="ev-card">
          <div className="ev-rows">
            <button className="button secondary" onClick={() => setAdding(false)}>Cancelar</button>
            <button className="button primary" onClick={add}>Crear evento</button>
          </div>
        </div>
      )}

      {events.map((e) => {
        const on = (e.active && (!e.start || today() >= e.start) && (!e.end || today() <= e.end)) || false;
        return (
          <div key={e.id} className={'ev-card' + (e.id === (act && act.id) ? ' active' : '')}>
            <div className="ev-top">
              <input
                className="input ev-name"
                placeholder="Nombre del evento (ej. Black Friday)"
                value={e.name}
                onChange={(ev) => patch(e.id, { name: ev.target.value })}
              />
              <div className="ev-active">
                <label className="switch">
                  <input type="checkbox" checked={!!e.active} onChange={(ev) => patch(e.id, { active: ev.target.checked })} />
                  <span></span>
                </label>
                <span className="muted">{e.active ? 'Activo' : 'Pausado'}</span>
              </div>
            </div>
            <div className="ev-rows">
              <label className="field">
                <span className="muted">Descuento (%)</span>
                <input
                  className="input ev-pct"
                  type="number" min={0} max={100}
                  value={String(e.pct ?? '')}
                  onChange={(ev) => patch(e.id, { pct: Math.max(0, Number(ev.target.value) || 0) })}
                />
              </label>
              <label className="field">
                <span className="muted">Desde</span>
                <input className="input" type="date" value={e.start || ''} onChange={(ev) => patch(e.id, { start: ev.target.value })} />
              </label>
              <label className="field">
                <span className="muted">Hasta (vacío = sin fin)</span>
                <input className="input" type="date" value={e.end || ''} onChange={(ev) => patch(e.id, { end: ev.target.value })} />
              </label>
              <button className="icon-remove" onClick={() => remove(e.id)} aria-label="Eliminar evento">✕</button>
            </div>
            <div className="ev-foot">
              <span className={'ev-badge' + (on ? ' on' : ' off')}>{e.id === (act && act.id) ? 'Aplicándose ahora' : on ? 'Aplica ahora' : 'No aplica hoy'}</span>
              {e.pct > 0 && <span className="muted">Todo a {esc(String(e.pct))}% menos</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}