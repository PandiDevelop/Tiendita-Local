import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store';
import {
  esc, shortDate, syncClientId, syncName,
  addNoteMsg, addChecklistNote, editNoteMsg, editChecklistNote, deleteNoteMsg, toggleNotePin,
  addNoteReply, editNoteReply, deleteNoteReply,
  toggleChecklistItem, removeChecklistItem,
  sweepExpiredNotes, canEditNote, canDeleteNote, canManageNotes,
} from '../lib/core';
import {
  confirmDialog, GearMenu, Modal,
  NoteTextIcon, ChecklistIcon, CheckboxOutlineIcon, PinIcon, BellIcon, ReplyIcon, CloseIcon,
} from '../ui';
import { customConfirm } from '../lib/dialog';
import { notifyPermission, requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, notifyStorePush, pushLinkFor } from '../lib/push';
import { consumeDeepNote } from '../lib/deepLink';
import type { Note, NoteEditRecord, NoteReply, Store } from '../types';

function fmtWhen(ts: number | undefined): string {
  if (!ts) return '';
  return new Date(ts).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function nameOf(s: Store, by: string | undefined, byName: string | undefined, me: string, myName: string): string {
  const m = (s.members || {})[by || ''];
  return byName || (m && m.name) || (by === me ? myName : 'Miembro');
}

// Composicion: nota normal o checklist (objetivos con checkbox). El modo lo
// decide la pestaña de la vista (Notas / Objetivos): cada historial se
// compone y se ve por separado. Se separa del feed principal para no cargar
// el componente de Notes con estado de edicion de listas.
function Composer({ mode, onDone }: { mode: 'text' | 'checklist'; onDone: () => void }) {
  const { store, replace } = useStore();
  const s = store!;
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [draftItem, setDraftItem] = useState('');

  // Al cambiar de pestana se limpia el borrador del modo anterior (sin
  // enfocar: el teclado no debe saltar solo).
  useEffect(() => {
    setText('');
    setTitle('');
    setItems([]);
    setDraftItem('');
  }, [mode]);

  function sendText() {
    const t = text.trim();
    if (!t) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; addNoteMsg(st, t); });
    if (s.syncKey) notifyStorePush(s.syncKey, syncName() + ' publicó una nota', t, 'nota', pushLinkFor('notas'));
    setText('');
    onDone();
  }

  function addItem() {
    const t = draftItem.trim();
    if (!t) return;
    setItems((arr) => [...arr, t]);
    setDraftItem('');
  }

  function sendChecklist() {
    const pending = draftItem.trim();
    const all = pending ? [...items, pending] : items;
    if (!title.trim() && !all.length) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; addChecklistNote(st, title, all); });
    if (s.syncKey) notifyStorePush(s.syncKey, syncName() + ' publicó una lista de objetivos', title.trim() || (all.length + ' objetivo' + (all.length === 1 ? '' : 's')), 'nota', pushLinkFor('notas'));
    setTitle('');
    setItems([]);
    setDraftItem('');
    onDone();
  }

  return (
    <div className="notes-compose">
      {mode === 'text' ? (
        <>
          <textarea
            className="notes-box"
            rows={3}
            placeholder="Escribe tu nota aquí… (Enter para enviar, Shift+Enter para salto de línea)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
          />
          <button className="button primary" onClick={sendText}>Publicar nota</button>
        </>
      ) : (
        <div className="checklist-compose">
          <input
            className="checklist-title-input"
            placeholder="Título de la lista (ej. Pendientes de la semana)"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
          {items.length > 0 && (
            <div className="checklist-draft-items">
              {items.map((it, i) => (
                <div className="checklist-draft-item" key={i}>
                  <span><CheckboxOutlineIcon /> {it}</span>
                  <button type="button" className="icon-btn" title="Quitar" onClick={() => setItems((arr) => arr.filter((_, j) => j !== i))}><CloseIcon size={13} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="checklist-add-row">
            <input
              placeholder="Agregar objetivo…"
              value={draftItem}
              maxLength={140}
              onChange={(e) => setDraftItem(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
            />
            <button type="button" className="button secondary" onClick={addItem}>＋ Agregar</button>
          </div>
          <button className="button primary" onClick={sendChecklist}>Publicar lista</button>
        </div>
      )}
    </div>
  );
}

// Historial de cambios de una nota o respuesta: se abre desde el pequeño
// menú de la tuerca. Solo se ofrece cuando la nota/respuesta ya tiene al
// menos una edición.
function HistoryModal({ current, history, onClose }: { current: string; history: NoteEditRecord[]; onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <h2>Historial de cambios</h2>
      <div className="note-history-list">
        {history.map((h, i) => (
          <div className="note-history-item" key={i}>
            <div className="muted note-history-when">{fmtWhen(h.at)}</div>
            <div className="note-history-text">{esc(h.text)}</div>
          </div>
        ))}
        <div className="note-history-item note-history-current">
          <div className="muted note-history-when">Versión actual</div>
          <div className="note-history-text">{esc(current)}</div>
        </div>
      </div>
      <div className="modal-actions"><button className="button primary" onClick={onClose}>Cerrar</button></div>
    </Modal>
  );
}

// Hilo de una nota, como ventana desplegable (panel flotante desde el
// borde derecho, con su propio fondo para cerrar al tocar afuera). Vuelve a
// buscar la nota en vivo en cada render (por id) en vez de recibirla como
// prop fija, para que las respuestas de otros dispositivos aparezcan sin
// tener que cerrar y volver a abrir el hilo.
function ThreadPanel({ noteId, onClose, openHistory }: { noteId: string; onClose: () => void; openHistory: (title: string, r: NoteReply) => void }) {
  const { store, replace, toast } = useStore();
  const s = store!;
  const note = (s.noteBoard || []).find((n) => n.id === noteId);
  const [text, setText] = useState('');
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const me = syncClientId();
  const myName = syncName();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' });
  }, [note?.replies?.length]);

  // La nota se pudo borrar (por otro dispositivo, o porque expiró) mientras
  // el hilo estaba abierto: se cierra solo en vez de mostrar un panel vacío.
  useEffect(() => { if (!note) onClose(); }, [note, onClose]);
  if (!note) return null;

  function send() {
    const t = text.trim();
    if (!t) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; addNoteReply(st, noteId, t); });
    if (s.syncKey) notifyStorePush(s.syncKey, myName + ' respondió en un hilo', t, 'nota', pushLinkFor('notas', noteId));
    setText('');
  }

  async function removeReply(r: NoteReply) {
    if (!(await customConfirm('¿Eliminar esta respuesta?'))) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; deleteNoteReply(st, noteId, r.id); });
    toast('Respuesta eliminada.');
  }

  function saveEdit() {
    if (!editing) return;
    const t = editing.text.trim();
    if (!t) return;
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; editNoteReply(st, noteId, editing.id, t); });
    setEditing(null);
  }

  return createPortal(
    <div className="thread-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="thread-panel">
        <div className="thread-head">
          <b>Hilo</b>
          <button type="button" className="icon-btn" title="Cerrar" onClick={onClose}><CloseIcon size={14} /></button>
        </div>
        <div className="thread-body">
          <div className="note-msg thread-root">
            <div className="note-meta">
              <strong>{esc(nameOf(s, note.by, note.byName, me, myName))}</strong>
              <span className="muted">{note.date ? shortDate(note.date) : ''}{note.time ? ' · ' + esc(note.time) : ''}</span>
            </div>
            <div className="note-text">{esc(note.text)}</div>
          </div>
          <div className="thread-replies">
            {(note.replies || []).length ? (note.replies || []).map((r) => {
              const mine = r.by === me;
              const items = [
                ...(canEditNote(r) ? [{ label: 'Editar', onClick: () => setEditing({ id: r.id, text: r.text }) }] : []),
                ...((r.history && r.history.length) ? [{ label: 'Ver historial de cambios', onClick: () => openHistory('Historial de la respuesta', r) }] : []),
                ...(canDeleteNote(s, r) ? [{ label: 'Eliminar', danger: true, onClick: () => removeReply(r) }] : []),
              ];
              return (
                <div key={r.id} className={'note-msg thread-reply' + (mine ? ' mine' : '')}>
                  <div className="note-meta">
                    <strong>{esc(nameOf(s, r.by, r.byName, me, myName))}</strong>
                    <span className="muted">{r.time ? esc(r.time) : ''}{r.editedAt ? ' · editado' : ''}</span>
                    {items.length > 0 && <GearMenu items={items} />}
                  </div>
                  {editing && editing.id === r.id ? (
                    <div className="note-edit-box">
                      <textarea rows={2} value={editing.text} onChange={(e) => setEditing({ id: r.id, text: e.target.value })} />
                      <div className="note-edit-actions">
                        <button className="button secondary" onClick={() => setEditing(null)}>Cancelar</button>
                        <button className="button primary" onClick={saveEdit}>Guardar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="note-text">{esc(r.text)}</div>
                  )}
                </div>
              );
            }) : <div className="notice">Sin respuestas todavía. Sé el primero en responder.</div>}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="thread-compose">
          <textarea
            rows={2}
            placeholder="Responder al hilo… (Enter para enviar)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button className="button primary" onClick={send}>Responder</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Notes() {
  const { store, replace, toast } = useStore();
  const s = store!;
  const me = syncClientId();
  const myName = syncName();
  const admin = canManageNotes(s);

  // Dos historiales separados por pestana: las notas (kind text) y las
  // listas de objetivos (kind checklist) ya no conviven en el mismo feed.
  const [feed, setFeed] = useState<'notas' | 'objetivos'>('notas');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editItems, setEditItems] = useState<{ id?: string; text: string }[]>([]);
  const [editDraftItem, setEditDraftItem] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ title: string; current: string; list: NoteEditRecord[] } | null>(null);
  const [notifyState, setNotifyState] = useState(notifyPermission());

  // Deep link de una notificación push (?tab=notas&n=<id>, ver lib/deepLink.ts):
  // abre el hilo de esa nota apenas llegue a este dispositivo (puede tardar uno
  // o dos snapshots si la nota vino del remoto y todavía no se cargó).
  const [deepNoteId, setDeepNoteId] = useState<string | null>(() => consumeDeepNote());
  useEffect(() => {
    if (!deepNoteId) return;
    const n = (s.noteBoard || []).find((x) => x.id === deepNoteId);
    if (n) {
      setFeed(n.kind === 'checklist' ? 'objetivos' : 'notas');
      setThreadId(deepNoteId);
      setDeepNoteId(null);
      return;
    }
    const t = window.setTimeout(() => setDeepNoteId(null), 6000);
    return () => window.clearTimeout(t);
  }, [deepNoteId, s.noteBoard, feed]);

  // Orden del feed: las FIJADAS van primero, y entre ellas la mas
  // recientemente fijada arriba (pinnedAt). Despues las demas como siempre:
  // mas reciente arriba, con desempate por id para dejar el orden EXACTO e
  // igual en todos los dispositivos aunque dos notas compartan createdAt.
  function pinOrder(a: Note, b: Note): number {
    let pa = -1;
    let pb = -1;
    if (a.pinned) pa = a.pinnedAt || a.createdAt || 0;
    if (b.pinned) pb = b.pinnedAt || b.createdAt || 0;
    return (pb - pa) || (b.createdAt || 0) - (a.createdAt || 0) || b.id.localeCompare(a.id);
  }
  const notes: Note[] = (s.noteBoard || []).slice().sort(pinOrder);
  const visible = notes.filter((n) => (feed === 'notas' ? n.kind !== 'checklist' : n.kind === 'checklist'));

  // Barrido de notas vencidas (no fijadas, con mas de una semana): se hace
  // una vez al abrir la pestaña y de ahi en adelante cada pocos minutos
  // mientras siga abierta (ver sweepExpiredNotes en lib/core.ts - no hay
  // servidor/cron en esta app, asi que lo dispara el primer dispositivo que
  // entra a mirar).
  useEffect(() => {
    function sweep() {
      replace((d) => { const st = d.stores.find((x) => x.id === s.id); if (st) sweepExpiredNotes(st); });
    }
    sweep();
    const iv = window.setInterval(sweep, 5 * 60 * 1000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.id]);

  // Igual que antes: mas reciente arriba, asi que el scroll se manda al
  // INICIO del panel (no al final) cuando cambia el numero de notas o de
  // pestana.
  useEffect(() => {
    const box = document.querySelector<HTMLElement>('.notes-scroll');
    if (box) box.scrollTop = 0;
  }, [visible.length, feed, s.id]);

  function openHistory(title: string, n: { text: string; history?: NoteEditRecord[] }) {
    setHistory({ title, current: n.text, list: n.history || [] });
  }

  function startEdit(n: Note) {
    setEditingId(n.id);
    setEditingText(n.text);
    setEditItems((n.items || []).map((it) => ({ id: it.id, text: it.text })));
    setEditDraftItem('');
  }

  function saveEdit() {
    if (!editingId) return;
    const n = (s.noteBoard || []).find((x) => x.id === editingId);
    if (!n) { setEditingId(null); return; }
    if (n.kind === 'checklist') {
      replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; editChecklistNote(st, editingId, editingText, editItems); });
    } else {
      const t = editingText.trim();
      if (!t) return;
      replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; editNoteMsg(st, editingId, t); });
    }
    setEditingId(null);
  }

  function addEditItem() {
    const t = editDraftItem.trim();
    if (!t) return;
    setEditItems((arr) => [...arr, { id: undefined, text: t }]);
    setEditDraftItem('');
  }

  function doDelete(n: Note) {
    confirmDialog(n.kind === 'checklist' ? '¿Eliminar esta lista de objetivos?' : '¿Eliminar esta nota?', () => {
      replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; deleteNoteMsg(st, n.id); });
      toast('Nota eliminada.');
    });
  }

  function doTogglePin(n: Note) {
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; toggleNotePin(st, n.id); });
  }

  function doToggleItem(n: Note, itemId: string) {
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; toggleChecklistItem(st, n.id, itemId); });
  }

  function removeItemFromChecklist(n: Note, itemId: string) {
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; removeChecklistItem(st, n.id, itemId); });
  }

  async function enableSystemNotify() {
    const p = await requestNotifyPermission();
    setNotifyState(p);
    // Ademas del aviso local (que solo funciona con la app abierta en otra
    // pestaña), intenta activar el push real de FCM para esta tienda. Si
    // push.ts todavia no esta configurado (VAPID_PUBLIC_KEY/PUSH_WORKER_URL
    // vacios - ver ese archivo) esto no hace nada, ni truena ni molesta.
    if (s.syncKey) enablePushForStore(s.syncKey);
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Notas del equipo</h2><p className="muted">Notas y listas de objetivos van en historiales separados; abre un hilo para responder. Lo que no se fija desaparece a la semana.</p></div>
        <div className="notes-head-actions">
          {notifyState === 'default' && (
            <button className="button secondary" onClick={enableSystemNotify} title="Recibe un aviso aunque tengas la app cerrada o en otra pestaña"><BellIcon /> Activar aviso del sistema</button>
          )}
        </div>
      </div>

      <div className="notes-feed-tabs">
        <button type="button" className={'notes-feed-tab' + (feed === 'notas' ? ' active' : '')} onClick={() => setFeed('notas')}><NoteTextIcon /> Notas</button>
        <button type="button" className={'notes-feed-tab' + (feed === 'objetivos' ? ' active' : '')} onClick={() => setFeed('objetivos')}><ChecklistIcon /> Objetivos</button>
      </div>

      <Composer mode={feed === 'notas' ? 'text' : 'checklist'} onDone={() => {}} />

      <div className="notes-scroll">
        {visible.length ? (
          <div className="notes-list">
            {visible.map((n) => {
          const mine = n.by === me;
          const items = [
            ...(admin ? [{ label: n.pinned ? 'Desfijar' : 'Fijar', onClick: () => doTogglePin(n) }] : []),
            ...(canEditNote(n) ? [{ label: 'Editar', onClick: () => startEdit(n) }] : []),
            ...((n.history && n.history.length) ? [{ label: 'Ver historial de cambios', onClick: () => openHistory(n.kind === 'checklist' ? 'Historial de la lista' : 'Historial de la nota', n) }] : []),
            ...(canDeleteNote(s, n) ? [{ label: 'Eliminar', danger: true, onClick: () => doDelete(n) }] : []),
          ];
const replyCount = (n.replies || []).length;
              const pendingItems = n.kind === 'checklist' ? (n.items || []).filter((it) => !it.done) : [];
              const badge = n.kind === 'checklist' && (n.items || []).length > 0
                ? (pendingItems.length === 0
                  ? <span className="note-checklist-badge all">Completado</span>
                  : <span className="note-checklist-badge">{pendingItems.length === 1 ? '1 objetivo pendiente' : pendingItems.length + ' objetivos pendientes'}</span>)
                : null;
              return (
                <div key={n.id} className={'note-msg' + (mine ? ' mine' : '') + (n.pinned ? ' pinned' : '')}>
                  <div className="note-meta">
                    {n.pinned && <span className="note-pin-badge" title="Fijada"><PinIcon /></span>}
                    <strong>{esc(nameOf(s, n.by, n.byName, me, myName))}</strong>
                    <span className="muted">{n.date ? shortDate(n.date) : ''}{n.time ? ' · ' + esc(n.time) : ''}{n.editedAt ? ' · editado' : ''}</span>
                    {items.length > 0 && <GearMenu items={items} />}
                  </div>

                  {editingId === n.id && n.kind === 'checklist' ? (
                    <div className="checklist-compose checklist-edit-box">
                      <input className="checklist-title-input" placeholder="Título de la lista" value={editingText} maxLength={80} onChange={(e) => setEditingText(e.target.value)} />
                      {editItems.length > 0 && (
                        <div className="checklist-draft-items">
                          {editItems.map((it, i) => (
                            <div className="checklist-draft-item" key={it.id || 'nuevo-' + i}>
                              <span><CheckboxOutlineIcon /></span>
                              <input className="checklist-edit-item" maxLength={140} value={it.text} onChange={(e) => setEditItems((arr) => arr.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                              <button type="button" className="icon-btn" title="Quitar objetivo" onClick={() => setEditItems((arr) => arr.filter((_, j) => j !== i))}><CloseIcon size={13} /></button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="checklist-add-row">
                        <input placeholder="Agregar objetivo…" value={editDraftItem} maxLength={140} onChange={(e) => setEditDraftItem(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEditItem(); } }} />
                        <button type="button" className="button secondary" onClick={addEditItem}>＋ Agregar</button>
                      </div>
                      <div className="note-edit-actions">
                        <button className="button secondary" onClick={() => setEditingId(null)}>Cancelar</button>
                        <button className="button primary" onClick={saveEdit}>Guardar</button>
                      </div>
                    </div>
                  ) : editingId === n.id ? (
                    <div className="note-edit-box">
                      <textarea rows={3} value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                      <div className="note-edit-actions">
                        <button className="button secondary" onClick={() => setEditingId(null)}>Cancelar</button>
                        <button className="button primary" onClick={saveEdit}>Guardar</button>
                      </div>
                    </div>
                  ) : n.kind === 'checklist' ? (
                    <div className="note-checklist">
                      <div className="note-checklist-title-row">
                        <span className="note-checklist-title">{esc(n.text)}</span>
                        {badge}
                      </div>
                  {(n.items || []).map((it) => (
                    <label key={it.id} className={'note-check' + (it.done ? ' done' : '')}>
                      <input type="checkbox" checked={it.done} onChange={() => doToggleItem(n, it.id)} />
                      <span>{esc(it.text)}</span>
                      {it.done && it.doneByName && <span className="muted note-check-by">· {esc(it.doneByName)}</span>}
                      {canEditNote(n) && <button type="button" className="icon-btn note-check-remove" title="Quitar objetivo" onClick={() => removeItemFromChecklist(n, it.id)}><CloseIcon size={12} /></button>}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="note-text">{esc(n.text)}</div>
              )}

              <button type="button" className="note-reply-btn" onClick={() => setThreadId(n.id)}>
                <ReplyIcon /> {replyCount ? replyCount + ' respuesta' + (replyCount === 1 ? '' : 's') : 'Responder'}
              </button>
            </div>
          );
            })}
          </div>
        ) : <div className="notice">{feed === 'notas' ? 'No hay notas todavía. Publica la primera.' : 'No hay listas de objetivos todavía. Publica la primera.'}</div>}
      </div>

      {threadId && <ThreadPanel noteId={threadId} onClose={() => setThreadId(null)} openHistory={openHistory} />}
      {history && <HistoryModal current={history.current} history={history.list} onClose={() => setHistory(null)} />}
    </div>
  );
}
