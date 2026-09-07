import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { addNote, esc, shortDate, syncName, syncClientId } from '../lib/core';
import type { NoteEntry } from '../types';

export function Notes() {
  const { store, replace } = useStore();
  const s = store!;
  const [text, setText] = useState('');
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const me = syncClientId();
  const myName = syncName();

  const notes: NoteEntry[] = (s.noteLog || []).slice();

  function nameOf(e: NoteEntry): string {
    const m = (s.members || {})[e.by || ''];
    return (e.byName) || (m && m.name) || (e.by === me ? myName : 'Miembro');
  }

  function send() {
    const t = text.trim();
    if (!t) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; addNote(st, t); });
    setText('');
    taRef.current?.focus();
  }

  function onEnter(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); send(); }
  }

  useEffect(() => {
    const box = document.querySelector<HTMLElement>('.notes-scroll');
    if (box) box.scrollTop = box.scrollHeight;
  }, [notes.length, s.id]);

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Notas del equipo</h2><p className="muted">Escribe una nota abajo y quedará en el tablero para todos los vinculados a la tienda.</p></div>
      </div>
      <div className="notes-compose">
        <textarea
          ref={taRef}
          className="notes-box"
          rows={3}
          placeholder="Escribe tu nota aquí… (Enter para enviar)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onEnter}
        />
        <button className="button primary" onClick={send}>Publicar nota</button>
      </div>
      <div className="notes-scroll">
        {notes.length ? (
          notes.slice().reverse().map((e) => (
            <div key={e.id} className={'note-msg' + (e.by === me ? ' mine' : '')}>
              <div className="note-meta">
                <strong>{esc(nameOf(e))}</strong>
                <span className="muted">{e.date ? shortDate(e.date) : ''}{e.time ? ' · ' + esc(e.time) : ''}</span>
              </div>
              <div className="note-text">{esc(e.text)}</div>
            </div>
          ))
        ) : <div className="notice">No hay notas todavía. Publica la primera.</div>}
      </div>
    </div>
  );
}