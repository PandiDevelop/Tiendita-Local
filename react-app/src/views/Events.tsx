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
  const { store, replace, toast } = useStore();
  const s = store!;
  const events: StoreEvent[] = (s.events || []).slice();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<StoreEvent>(blankEvent());

  const act = activeEvent(s);

  function patch(id: string, p: Partial<StoreEvent>) {
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      if (st.events) st.events = st.events.map((e) => (e.id === id ? { ...e, ...p } : e));
    });
  }

  function openAdding() {
    setDraft(blankEvent());
    setAdding(true);
  }

  // Crear abre directamente el formulario del evento (nombre, descuento y
  // fechas) en vez de una caja vacía con "Cancelar/Crear evento".
  function create() {
    const nm = draft.name.trim();
    if (!nm) return toast('Escribe un nombre para el evento.');
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id)!;
      st.events = [...(st.events || []), { ...draft, name: nm }];
    });
    setAdding(false);
    toast('Evento creado.');
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
        {!adding && <button className="button primary" onClick={openAdding}>＋ Nuevo evento</button>}
      </div>

      {events.length === 0 && !adding && <div className="notice">No hay eventos todavía. Crea uno para promocionar todo durante una fecha especial.</div>}
      {adding && (
        <div className="ev-card">
          <div className="ev-top">
            <input
              className="input ev-name"
              placeholder="Nombre del evento (ej. Black Friday)"
              value={draft.name}
              onChange={(ev) => setDraft({ ...draft, name: ev.target.value })}
            />
          </div>
          <div className="ev-rows">
            <label className="field">
              <span className="muted">Descuento (%)</span>
              <input
                className="input ev-pct"
                type="number" min={0} max={100}
                value={String(draft.pct ?? '')}
                onChange={(ev) => setDraft({ ...draft, pct: Math.max(0, Number(ev.target.value) || 0) })}
              />
            </label>
            <label className="field">
              <span className="muted">Desde</span>
              <input className="input" type="date" value={draft.start || ''} onChange={(ev) => setDraft({ ...draft, start: ev.target.value })} />
            </label>
            <label className="field">
              <span className="muted">Hasta (vacío = sin fin)</span>
              <input className="input" type="date" value={draft.end || ''} onChange={(ev) => setDraft({ ...draft, end: ev.target.value })} />
            </label>
          </div>
          <div className="ev-foot">
            <button className="button secondary" onClick={() => setAdding(false)}>Cancelar</button>
            <button className="button primary" onClick={create}>Crear evento</button>
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
            </div>
            <div className="ev-foot">
              <span className={'ev-badge' + (on ? ' on' : ' off')}>{e.id === (act && act.id) ? 'Aplicándose ahora' : on ? 'Aplica ahora' : 'No aplica hoy'}</span>
              {e.pct > 0 && <span className="muted">Todo a {esc(String(e.pct))}% menos</span>}
              <button className="ev-quit" onClick={() => remove(e.id)}>Quitar</button>
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