// Log descargable de Notas y Objetivos: SOLO vive en este dispositivo
// (localStorage), no viaja por Firestore. Ver el comentario junto a
// NoteArchiveEntry en types.ts para el porque (evitar que el documento de la
// tienda crezca sin limite con un historial que no hace falta sincronizar en
// tiempo real). Cada dispositivo que tuvo la pestaña Notas abierta va
// acumulando lo que vio pasar; las exportaciones de Opciones > Registros
// descargan lo que ESE dispositivo alcanzó a registrar.
import type { Note, NoteArchiveEntry, NoteReply } from '../types';

const KEY_PREFIX = 'mi-tiendita-note-archive:';
// Tope de entradas guardadas por tienda para que esto no crezca sin limite
// en el localStorage del navegador (que tambien tiene su propio tope, unos
// 5-10MB segun el navegador). Se descartan las mas viejas primero.
const MAX_ENTRIES = 4000;

function storageKey(storeId: string): string {
  return KEY_PREFIX + storeId;
}

export function loadArchive(storeId: string): NoteArchiveEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(storeId));
    return raw ? (JSON.parse(raw) as NoteArchiveEntry[]) : [];
  } catch {
    return [];
  }
}

function saveArchive(storeId: string, list: NoteArchiveEntry[]): void {
  try {
    const trimmed = list.length > MAX_ENTRIES ? list.slice(list.length - MAX_ENTRIES) : list;
    localStorage.setItem(storageKey(storeId), JSON.stringify(trimmed));
  } catch {
    // localStorage lleno o bloqueado (modo privado, etc.): no es un dato
    // critico para que la app funcione, se ignora en silencio.
  }
}

// Agrega o actualiza (por id) una entrada del log: se llama cada vez que
// este dispositivo ve una nota/respuesta nueva, editada, fijada, borrada o
// expirada (ver el efecto de archivado en Notes.tsx).
export function archiveUpsert(storeId: string, entry: NoteArchiveEntry): void {
  const list = loadArchive(storeId);
  const idx = list.findIndex((e) => e.id === entry.id);
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  saveArchive(storeId, list);
}

// Para una checklist, el texto del log incluye cada objetivo con su estado
// (marcado o no) - asi el CSV descargado sirve de constancia de que se hizo
// o no, no solo el titulo de la lista.
function noteArchiveText(n: Note): string {
  if (n.kind !== 'checklist') return n.text;
  const items = (n.items || []).map((it) => (it.done ? '[x] ' : '[ ] ') + it.text).join(' · ');
  return n.text + (items ? ' — ' + items : '');
}

export function noteToArchiveEntry(n: Note): NoteArchiveEntry {
  return {
    id: n.id,
    kind: n.kind === 'checklist' ? 'checklist' : 'nota',
    text: noteArchiveText(n),
    by: n.by,
    byName: n.byName,
    date: n.date,
    time: n.time,
    createdAt: n.createdAt,
    editedAt: n.editedAt,
    status: n.pinned ? 'fijada' : (n.editedAt ? 'editada' : 'activa'),
  };
}

export function replyToArchiveEntry(parentId: string, r: NoteReply): NoteArchiveEntry {
  return {
    id: r.id,
    parentId,
    kind: 'respuesta',
    text: r.text,
    by: r.by,
    byName: r.byName,
    date: r.date,
    time: r.time,
    createdAt: r.createdAt,
    editedAt: r.editedAt,
    status: r.editedAt ? 'editada' : 'activa',
  };
}

export function archiveMarkGone(storeId: string, id: string, status: 'eliminada' | 'expirada'): void {
  const list = loadArchive(storeId);
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], status };
  saveArchive(storeId, list);
}

// CSV con BOM y separador ; (mismo formato que el resto de exportaciones de
// la app, ver exportExcel en views/History.tsx) para que Excel en español
// lo abra bien de una.
function buildCsv(rows: (string | number)[][], filenameBase: string): void {
  const csv = '\ufeff' + rows.map((r) => r.map((v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filenameBase + '.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function archiveRows(storeId: string, kinds: ('nota' | 'respuesta' | 'checklist')[]): (string | number)[][] {
  const list = loadArchive(storeId).slice().sort((a, b) => a.createdAt - b.createdAt);
  const rows: (string | number)[][] = [['Fecha', 'Hora', 'Tipo', 'Autor', 'Estado', 'Editado', 'Texto']];
  list.filter((e) => kinds.includes(e.kind)).forEach((e) => {
    rows.push([e.date, e.time, e.kind, e.byName || '', e.status, e.editedAt ? 'sí' : 'no', e.text]);
  });
  return rows;
}

function slugName(storeName: string): string {
  return storeName.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
}

// "Descargar registros de notas" (Opciones > Registros): notas y respuestas
// de hilos (los objetivos van por separado, ver abajo).
export function exportNotesArchiveCsv(storeId: string, storeName: string): void {
  buildCsv(archiveRows(storeId, ['nota', 'respuesta']), 'notas-log-' + slugName(storeName));
}

// "Descargar registros de objetivos" (Opciones > Registros): solo las listas
// de objetivos/checklist.
export function exportObjectivesArchiveCsv(storeId: string, storeName: string): void {
  buildCsv(archiveRows(storeId, ['checklist']), 'objetivos-log-' + slugName(storeName));
}
