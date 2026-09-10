import type { AppState, CategoryPricing, InventoryLogEntry, Note, NoteChecklistItem, NoteEntry, NoteReply, Product, Promo, Role, Sale, SaleItem, Store, StoreEvent } from '../types';

export const KEY = 'mi-tiendita-v1';
export const CLIENT_KEY = 'mi-tiendita-client';
export const USER_KEY = 'mi-tiendita-user';

// Version de arranque/mostrada hasta que el service worker responde con la
// suya (ver lib/appVersion.ts): la real es la del sw.js activo (public/sw.js),
// que refleja lo que esta desplegado de verdad.
export const APP_VERSION = '1.9.3';

const DEFAULT_STORE_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="34" fill="#f3eaff"/><path d="M29 67h102v61H29z" fill="#fffdf9" stroke="#9b7dcc" stroke-width="5"/><path d="M22 66 36 38h88l14 28z" fill="#ffc7b5" stroke="#9b7dcc" stroke-width="5"/><path d="M40 39h15v28H40zm32 0h16v28H72zm33 0h15v28h-15z" fill="#fffaf3"/><path d="M45 83h30v45H45z" fill="#b9e4d0" stroke="#9b7dcc" stroke-width="4"/><path d="M91 83h24v20H91z" fill="#fff0a9" stroke="#9b7dcc" stroke-width="4"/></svg>',
);
export const DEFAULT_STORE_IMAGE = `data:image/svg+xml,${DEFAULT_STORE_SVG}`;

const DEFAULT_PROD_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="34" fill="#eef1f8"/><rect x="42" y="64" width="76" height="66" rx="10" fill="#fffdf9" stroke="#7fa7d9" stroke-width="5"/><path d="M42 64l76 0 -10 -16H52z" fill="#ffc7b5" stroke="#7fa7d9" stroke-width="5" stroke-linejoin="round"/><path d="M80 48v82" stroke="#9db4db" stroke-width="7"/><path d="M66 70h28v28H66z" fill="#fff0a9" stroke="#7fa7d9" stroke-width="4"/></svg>',
);
export const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml,${DEFAULT_PROD_SVG}`;

export const SYNC_DEFAULT_NAME = 'Trabajador';

// Etiqueta/tag que se sugiere por defecto (global para todas las tiendas) al
// crear un producto. Cada producto puede cambiarla o dejarla vacia: el tag no
// es obligatorio. Se trunca de forma visual si es muy largo (ver shortTag).
export const DEFAULT_PRODUCT_TAG = 'general';

// Muestra un tag acortado cuando es muy largo: p.ej. "Uma musume" se ve como
// "Uma". Se usa en listas donde el tag compite con el nombre del producto.
export function shortTag(tag: string | undefined, max = 5): string {
  const t = (tag || '').trim().toUpperCase();
  if (!t) return '';
  return t.length > max ? t.slice(0, max) : t;
}

// Etiquetas reales de un producto (hasta 3). Los productos nuevos guardan un
// arreglo `tags`; los antiguos solo tenian el campo de texto `tag`, asi que si
// el arreglo no existe todavia se toma ese campo para que los viejos datos
// sigan mostrandose y buscandose igual.
export function productTags(p: Pick<Product, 'tags' | 'tag'> | undefined | null): string[] {
  if (!p) return [];
  if (Array.isArray(p.tags) && p.tags.length) return p.tags.map((t) => (t || '').trim()).filter(Boolean);
  const solo = (p.tag || '').trim();
  return solo ? [solo] : [];
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function timeNow(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function money(n: number | string | null | undefined): string {
  const num = Number(n || 0);
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number.isFinite(num) ? num : 0);
}

// Etiqueta corta de una promocion para listas: muestra la recompensa segun su
// tipo y condicion (precio fijo/paquete o porcentaje), no solo el nombre.
export function promoText(x: Promo | undefined | null): string {
  const base = (x && x.label) || 'Promoción';
  if (!x) return base;
  const pack = x.cond === 'qtyeq' ? ' las ' + (x.min || 1) : '';
  const dscto = '−' + (Number.isFinite(x.pct) ? x.pct : 0) + '%';
  if (x.type === 'pct') return base + ' · ' + dscto + pack;
  if (Number.isFinite(x.price)) return base + ' · ' + money(x.price) + pack;
  return base;
}

// Antes esta funcion reemplazaba &, <, >, comillas y apostrofes por sus
// entidades HTML (&amp; &lt; etc). Eso tenia sentido solo si el resultado se
// fuera a insertar como HTML crudo (innerHTML), pero en toda la app se usa
// dentro de JSX como texto normal ({esc(valor)}), y React YA escapa el texto
// de forma segura por su cuenta. El resultado era doble escape: un producto
// llamado Pan & Queso o con un apostrofe se veia literalmente como
// "Pan &amp; Queso" en pantalla. Ahora solo normaliza a string.
export function esc(v: string | number | null | undefined): string {
  return String(v ?? '');
}

// Formato de fecha para TODA la pagina: dia/mes/año de dos digitos (DD/MM/AA).
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
export function formatDate(d: string | null | undefined): string {
  if (!d) return '—';
  const dt = new Date(d + 'T12:00:00');
  return [pad2(dt.getDate()), pad2(dt.getMonth() + 1), String(dt.getFullYear()).slice(-2)].join('/');
}

export function shortDate(d: string | null | undefined): string {
  return formatDate(d);
}

export function toProductsArr(src: unknown): Product[] {
  if (!src) return [];
  if (Array.isArray(src)) return JSON.parse(JSON.stringify(src));
  return Object.keys(src as Record<string, Product>).map((k) => JSON.parse(JSON.stringify((src as Record<string, Product>)[k])));
}
export function toSalesArr(src: unknown): Sale[] {
  if (!src) return [];
  if (Array.isArray(src)) return JSON.parse(JSON.stringify(src));
  return Object.keys(src as Record<string, Sale>).map((k) => JSON.parse(JSON.stringify((src as Record<string, Sale>)[k])));
}

// Safe counter merge: per row (product+promo) wins the higher quantity; per-user
// attribution unions with the max per person.
export function mergeItems(a: SaleItem[] | undefined, b: SaleItem[] | undefined): SaleItem[] {
  const map = new Map<string, SaleItem>();
  (a || []).forEach((i) => map.set(i.productId + '|' + (i.promotionId || ''), JSON.parse(JSON.stringify(i))));
  (b || []).forEach((i) => {
    const k = i.productId + '|' + (i.promotionId || '');
    const cur = map.get(k);
    const win: SaleItem = !cur || (cur.qty ?? 0) < (i.qty ?? 0) ? JSON.parse(JSON.stringify(i)) : JSON.parse(JSON.stringify(cur));
    if ((cur && cur.who) || i.who) {
      const w: Record<string, number> = {};
      Object.keys((cur && cur.who) || {}).forEach((u) => (w[u] = (cur && cur.who && cur.who[u]) || 0));
      Object.keys(i.who || {}).forEach((u) => (w[u] = Math.max(w[u] || 0, (i.who && i.who[u]) || 0)));
      win.who = w;
    }
    map.set(k, win);
  });
  return Array.from(map.values());
}

// Normaliza cualquier forma de promo (nueva, vieja o escrita a mano durante
// una migracion) al modelo actual. La recompensa es 'price' (precio fijo) o
// 'pct' (% de descuento). La condicion es de CANTIDAD de la misma categoria
// en la venta:
//  - 'qtyeq' ("Cantidad fija"): cuando hay EXACTAMENTE N unidades. Varias
//    promos fijas del mismo producto forman un precio por BLOQUE (ver
//    promoPrice): el bloque es la cantidad mas grande y el sobrante se cobra
//    con la promo fija exacta que corresponda o el precio base.
//  - 'qtygt' ("Cantidad mayor a"): cuando hay MAS de N unidades.
// Las promos viejas (con 'cond' faltante, 'qty' >= N, 'saleTotal' o 'date')
// se migran a 'qtygt' conservando lo mas fiel posible su comportamiento.
export function normalizePromo(x: string | Partial<Promo> | undefined | null, fallback: number): Promo {
  if (typeof x === 'string') {
    return { id: uid(), label: x, type: 'price', price: fallback, pct: 0, cond: 'qtygt', min: 0, start: '', end: '' };
  }
  const base = (x || {}) as Partial<Promo>;
  const type = base.type === 'pct' ? 'pct' : 'price';
  const given = Number.isFinite(base.min) ? (base.min as number) : 1;
  const rc = base.cond as string | undefined;
  let cond: Promo['cond'] = 'qtygt';
  let min = 0;
  if (rc === 'qtyeq') { cond = 'qtyeq'; min = Math.max(1, Math.round(given)); }
  else if (rc === 'qtygt') { cond = 'qtygt'; min = Math.max(0, Math.round(given)); }
  else if (rc === 'qty') { cond = 'qtygt'; min = Math.max(0, Math.round(given) - 1); } // ">= N" pasa a "> N-1"
  else if (rc === 'saleTotal') { cond = 'qtygt'; min = Math.max(0, Math.round(given)); }
  // 'date' o sin condicion (precios viejos permanentes) -> "mayor a 0"
  return {
    id: base.id || uid(),
    label: String(base.label || '').trim(),
    type,
    price: Number.isFinite(base.price) ? (base.price as number) : type === 'price' ? fallback : 0,
    pct: Number.isFinite(base.pct) ? (base.pct as number) : 0,
    cond,
    min,
    start: base.start || '',
    end: base.end || '',
  };
}

export function normalizeStore(store: Store): Store {
  store.image = store.image || DEFAULT_STORE_IMAGE;
  store.products ||= [];
  store.sales ||= [];
  store.categories = store.categories || [];
  store.categoryPricing = store.categoryPricing || {};
  store.inventory = store.inventory || {};
  store.notes = typeof store.notes === 'string' ? store.notes : '';
  store.noteLog = Array.isArray(store.noteLog) ? store.noteLog : [];
  store.invLog = Array.isArray(store.invLog) ? store.invLog : [];
  store.noteBoard = Array.isArray(store.noteBoard) ? store.noteBoard : [];
  // Las notas del tablero siempre deben tener kind y createdAt bien puestos:
  // con eso el orden que muestra la vista (por createdAt, ver Notes.tsx) es
  // determinista y el mismo en todos los dispositivos, sin importar en que
  // orden llegue cada nota en los snapshots. Notas viejas sin createdAt se
  // derivan de su fecha/hora (misma regla que usa la migracion de noteLog).
  store.noteBoard = store.noteBoard.filter((n) => !!n && !!n.id).map((n) => {
    if (n.kind !== 'text' && n.kind !== 'checklist') n.kind = 'text';
    if (!n.createdAt) n.createdAt = Date.parse((n.date || '') + 'T' + (n.time || '00:00') + ':00') || 0;
    return n;
  });
  migrateNoteLogToBoard(store);
  store.events = (store.events || []).filter((e) => !!e).map((e) => ({
    id: e.id || uid(),
    name: String(e.name || '').trim(),
    pct: Number.isFinite(e.pct) ? e.pct : 0,
    active: !!e.active,
    start: e.start || '',
    end: e.end || '',
  }));
  // Todo miembro registrado debe tener su UUID unico (eid). En tiendas
  // antiguas sin el campo se genera en este punto para que la sincronizacion
  // pueda validar unicidad de ID y nombre de empleados.
  if (store.members) {
    Object.keys(store.members).forEach((k) => {
      const m = store.members && store.members[k];
      if (m && !m.eid) m.eid = uid();
    });
  }
  store.products.forEach((p) => {
    const old = p.promos ?? [];
    p.promos = old.map((x) => normalizePromo(x, p.price));
    p.category = p.category || '';
    p.cost = Number.isFinite(p.cost) ? p.cost : 0;
  });
  store.sales.forEach((x) => {
    x.time = x.time || '';
    x.employee = x.employee || x.by || '';
    if (x.items) x.items.forEach((i) => { if (i.promotionId === undefined) i.promotionId = null; });
    else x.items = [];
  });
  return store;
}

export function makeDraft(): AppState {
  return { stores: [], activeStoreId: null, tab: 'inicio', editingSaleId: null, summaryPage: 0, summaryDate: null, summaryMonth: null, saleDraft: null, openCats: {} };
}

export function loadState(): AppState {
  const raw = localStorage.getItem(KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  const merged: AppState = Object.assign(makeDraft(), parsed || {});
  // El historial de ventas ahora vive dentro de la pestaña Ganancias (ya no
  // es su propia pestaña): si alguien se habia quedado en Historial la
  // ultima vez que uso la app, lo mandamos a Ganancias en vez de dejar la
  // pantalla en blanco.
  if ((merged.tab as string) === 'historial') merged.tab = 'ganancias';
  (merged.stores || []).forEach(normalizeStore);
  // Drafts de venta guardados con el selector viejo de UNA categoria: los
  // migro a la lista de categorias seleccionadas (chips con X).
  if (merged.saleDraft && typeof (merged.saleDraft as unknown as { category?: unknown }).category === 'string') {
    const d = merged.saleDraft as unknown as { category?: string };
    merged.saleDraft = { ...merged.saleDraft, categories: d.category && d.category.trim() ? [d.category.trim()] : [] };
  }
  if (merged.saleDraft && !Array.isArray(merged.saleDraft.categories)) merged.saleDraft.categories = [];
  return merged;
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function uid(): string {
  return (crypto as Crypto).randomUUID();
}

let _cid: string | null = null;
export function syncClientId(): string {
  if (_cid) return _cid;
  let v = localStorage.getItem(CLIENT_KEY);
  if (!v) {
    v = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(CLIENT_KEY, v);
  }
  _cid = v;
  return v;
}

export function syncName(): string {
  return localStorage.getItem(USER_KEY) || SYNC_DEFAULT_NAME;
}

export function syncSetName(v: string): void {
  localStorage.setItem(USER_KEY, (v && v.trim()) ? v.trim() : SYNC_DEFAULT_NAME);
}

export function syncGenPin(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let p = '';
  for (let i = 0; i < 6; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
}

export function syncKeyOf(pin: string): string {
  let h = 0x811c9dc5;
  const str = 'mitiendita:' + String(pin);
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return 'st' + ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

export function priceFor(i: SaleItem, s: Store): number {
  if (Number.isFinite(i.price)) return i.price ?? 0;
  const p = s.products.find((p) => p.id === i.productId);
  return i.promotionId ? (p?.promos.find((x) => x.id === i.promotionId)?.price ?? 0) : (p?.price ?? 0);
}

// Espejo de priceFor: si la venta ya trae un costo guardado (asi se vendio
// en su momento) lo usa, si no busca el costo actual del producto. Las
// promociones no cambian el costo (el costo es lo que salio producirlo o
// comprarlo, no el precio de venta), asi que no se busca por promocion.
export function costFor(i: SaleItem, s: Store): number {
  if (Number.isFinite(i.cost)) return i.cost ?? 0;
  const p = s.products.find((p) => p.id === i.productId);
  return p?.cost ?? 0;
}

export function total(sale: Sale, s: Store): number {
  return sale.items.reduce((n, i) => n + priceFor(i, s) * i.qty, 0);
}

export function costTotal(sale: Sale, s: Store): number {
  return sale.items.reduce((n, i) => n + costFor(i, s) * i.qty, 0);
}

export function profitTotal(sale: Sale, s: Store): number {
  return sale.items.reduce((n, i) => n + (priceFor(i, s) - costFor(i, s)) * i.qty, 0);
}

export function saleUnits(x: Sale): number {
  return x.items.reduce((a, i) => a + (i.qty || 0), 0);
}

export function itemLabel(i: SaleItem, s: Store): string {
  const p = s.products.find((p) => p.id === i.productId);
  return p ? p.name : 'Producto eliminado';
}

export function inventorySold(s: Store): Record<string, number> {
  const t: Record<string, number> = {};
  s.sales.forEach((x) => x.items.forEach((i) => { if (i.qty) t[i.productId] = (t[i.productId] || 0) + i.qty; }));
  return t;
}

export interface InvLogRow extends InventoryLogEntry {
  total: number;
}

// Registra un cambio de inventario (delta: + suma, - resta) y aplica el ajuste
// al conteo local. El log es inmutable y se fusiona por id al sincronizar; el
// total por producto viaja como mapa y se une por el mayor valor. Guarda
// quien hizo el cambio igual que en las ventas (nombre editable, con el
// nombre configurado del dispositivo como valor por defecto).
export function adoptInvLog(s: Store, productId: string, delta: number, supplier: string, byName?: string): void {
  const d = Math.round(delta);
  if (!d) return;
  s.invLog ||= [];
  s.inventory = s.inventory || {};
  const total = Math.max(0, Math.round(s.inventory[productId] || 0) + d);
  (s.invLog as InvLogRow[]).push({ id: uid(), productId, date: today(), time: timeNow(), qty: d, total, supplier: (supplier || '').trim(), by: syncClientId(), byName: (byName || syncName()).trim() || syncName() });
  s.inventory[productId] = total;
}

export function mergeInvLog(a: InventoryLogEntry[] | undefined, b: InventoryLogEntry[]): InventoryLogEntry[] {
  const map = new Map<string, InventoryLogEntry>();
  (a || []).forEach((e) => map.set(e.id, JSON.parse(JSON.stringify(e))));
  (b || []).forEach((e) => { if (e && e.id) map.set(e.id, JSON.parse(JSON.stringify(e))); });
  return Array.from(map.values())
    .sort((x, y) => (y.date || '').localeCompare(x.date || '') || (y.time || '').localeCompare(x.time || ''));
}

export function toInvLogArr(src: unknown): InventoryLogEntry[] {
  if (Array.isArray(src)) return JSON.parse(JSON.stringify(src));
  if (src && typeof src === 'object') {
    return Object.keys(src as Record<string, InventoryLogEntry>)
      .map((k) => JSON.parse(JSON.stringify((src as Record<string, InventoryLogEntry>)[k])));
  }
  return [];
}

export function toNoteLogArr(src: unknown): NoteEntry[] {
  if (Array.isArray(src)) return JSON.parse(JSON.stringify(src));
  if (src && typeof src === 'object') {
    return Object.keys(src as Record<string, NoteEntry>)
      .map((k) => JSON.parse(JSON.stringify((src as Record<string, NoteEntry>)[k])));
  }
  return [];
}

// Agrega una nota del tablero (mensajes del equipo). El log es inmutable y se
// fusiona por id al sincronizar: cada dispositivo conserva su bolsillo de notas
// y las notas ajenas llegan por el snapshot.
export function addNote(s: Store, text: string): void {
  const t = (text || '').trim();
  if (!t) return;
  s.noteLog ||= [];
  s.noteLog.push({ id: uid(), text: t, date: today(), time: timeNow(), by: syncClientId(), byName: syncName() });
}

export function mergeNoteLog(a: NoteEntry[] | undefined, b: NoteEntry[]): NoteEntry[] {
  const map = new Map<string, NoteEntry>();
  (a || []).forEach((e) => { if (e && e.id) map.set(e.id, JSON.parse(JSON.stringify(e))); });
  (b || []).forEach((e) => { if (e && e.id) map.set(e.id, JSON.parse(JSON.stringify(e))); });
  return Array.from(map.values())
    .sort((x, y) => (y.date || '').localeCompare(x.date || '') || (y.time || '').localeCompare(x.time || ''));
}

// ---------------------------------------------------------------------
// Notas del equipo (tablero con hilos) - ver comentario junto a Note en
// types.ts para el porque del modelo de datos y sus limites de sync.
// ---------------------------------------------------------------------

export const NOTE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // "a la semana" (ver Notes.tsx)

// Registro de notas borradas o expiradas, por tienda, persistido en
// localStorage. Sin esto, borrar la ultima nota (o todas) dejaba el tablero
// vacio y migrateNoteLogToBoard - que corre dentro de normalizeStore en cada
// snapshot y en cada arranque - volvia a crear esas notas desde noteLog
// apenas se recargaba la app o llegaba el siguiente snapshot remoto, y de
// ahi se re-subian a la nube: por eso las notas "resucitaban". Cualquier id
// anotado aqui nunca vuelve al tablero, ni local ni remotamente.
const DELETED_NOTES_KEY = 'mt_deleted_notes_';
const deletedNoteIds = new Map<string, Set<string>>();

function deletedNotesKey(store: Store): string {
  return store.syncKey || store.id;
}

function getDeletedNoteIds(store: Store): Set<string> {
  const k = deletedNotesKey(store);
  let cur = deletedNoteIds.get(k);
  if (!cur) {
    cur = new Set<string>();
    try {
      const raw = localStorage.getItem(DELETED_NOTES_KEY + k);
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr)) arr.forEach((id) => cur!.add(String(id)));
    } catch { /* errores de storage no son criticos */ }
    deletedNoteIds.set(k, cur);
  }
  return cur;
}

export function markNoteDeleted(store: Store, noteId: string): void {
  if (!noteId) return;
  const ids = getDeletedNoteIds(store);
  ids.add(noteId);
  try { localStorage.setItem(DELETED_NOTES_KEY + deletedNotesKey(store), JSON.stringify(Array.from(ids))); } catch { /* ignorar */ }
}

export function isNoteDeleted(store: Store, noteId: string): boolean {
  return getDeletedNoteIds(store).has(noteId);
}

export function deletedNoteIdsOf(store: Store): string[] {
  return Array.from(getDeletedNoteIds(store));
}

export function clearDeletedNotes(store: Store): void {
  const k = deletedNotesKey(store);
  deletedNoteIds.delete(k);
  try { localStorage.removeItem(DELETED_NOTES_KEY + k); } catch { /* ignorar */ }
}

// Registro de tiendas borradas CON sincronización: el borrado ahora es "suave"
// (ver deleteStoreFn en lib/sync.ts): se oculta de todos los dispositivos al
// instante pero la información queda en la nube por un tiempo de gracia, por
// si el dueño quiere restaurarla desde Opciones. Este registro guarda lo
// mínimo local que hace falta para volver a engancharla: su clave, su nombre
// y el código, más cuándo se borró.
export interface DeletedStoreRecord {
  key: string;
  name: string;
  code: string;
  deletedAt: number;
}

const DELETED_STORES_KEY = 'mt_deleted_stores';

export function deletedStores(): DeletedStoreRecord[] {
  try {
    const raw = localStorage.getItem(DELETED_STORES_KEY);
    const arr = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(arr)) return [];
    return arr.filter((r) => r && typeof r.key === 'string') as DeletedStoreRecord[];
  } catch {
    return [];
  }
}

export function rememberDeletedStore(rec: DeletedStoreRecord): void {
  try {
    const list = deletedStores().filter((r) => r.key !== rec.key);
    list.push(rec);
    localStorage.setItem(DELETED_STORES_KEY, JSON.stringify(list));
  } catch { /* ignorar */ }
}

export function forgetDeletedStore(key: string): void {
  try {
    localStorage.setItem(DELETED_STORES_KEY, JSON.stringify(deletedStores().filter((r) => r.key !== key)));
  } catch { /* ignorar */ }
}

// Migra las notas del modelo viejo (noteLog, texto plano sin hilos) al
// tablero nuevo (noteBoard) una sola vez: si el tablero esta vacio pero hay
// notas viejas, se convierten a Note simples (sin hilo, sin fijar) para no
// perder lo que el equipo ya habia escrito. NoteLog se deja intacto (no se
// vuelve a usar, pero no hace falta borrarlo). Las notas borradas o
// expiradas (ver deletedNoteIds arriba) se excluyen: al fin y al cabo, si
// alguien las borro es porque ya cumplieron su vida util.
function migrateNoteLogToBoard(store: Store): void {
  const pending = (store.noteLog || []).filter((e) => !!e && !!e.id && !isNoteDeleted(store, e.id));
  if (store.noteBoard.length || !pending.length) return;
  store.noteBoard = pending.map((e) => ({
    id: e.id,
    kind: 'text' as const,
    text: e.text,
    by: e.by,
    byName: e.byName,
    date: e.date,
    time: e.time,
    createdAt: Date.parse(e.date + 'T' + (e.time || '00:00') + ':00') || Date.now(),
  }));
}

export function toNoteBoardArr(src: unknown): Note[] {
  if (Array.isArray(src)) return JSON.parse(JSON.stringify(src));
  if (src && typeof src === 'object') {
    return Object.keys(src as Record<string, Note>)
      .map((k) => JSON.parse(JSON.stringify((src as Record<string, Note>)[k])));
  }
  return [];
}

function findNote(s: Store, noteId: string): Note | undefined {
  return (s.noteBoard || []).find((n) => n.id === noteId);
}

// Igual que canManageTeam (dueño o admin): son quienes pueden borrar
// cualquier mensaje del tablero y fijar/desfijar notas.
export function canManageNotes(s: Store): boolean {
  return canManageTeam(s);
}

export function canEditNote(n: Pick<Note, 'by'>): boolean {
  return !!n.by && n.by === syncClientId();
}

export function canDeleteNote(s: Store, n: Pick<Note, 'by'>): boolean {
  return canManageNotes(s) || canEditNote(n);
}

export function addNoteMsg(s: Store, text: string): Note | null {
  const t = (text || '').trim();
  if (!t) return null;
  s.noteBoard ||= [];
  const n: Note = { id: uid(), kind: 'text', text: t, date: today(), time: timeNow(), createdAt: Date.now(), by: syncClientId(), byName: syncName() };
  s.noteBoard.push(n);
  return n;
}

// Lista de objetivos/checklist (ver Notes.tsx: se publica como un tipo de
// nota distinto para que cualquiera pueda marcar sus items sin necesidad de
// editar el texto).
export function addChecklistNote(s: Store, title: string, itemTexts: string[]): Note | null {
  const items = (itemTexts || []).map((t) => (t || '').trim()).filter(Boolean);
  const t = (title || '').trim();
  if (!t && !items.length) return null;
  s.noteBoard ||= [];
  const n: Note = {
    id: uid(), kind: 'checklist', text: t || 'Lista de objetivos', date: today(), time: timeNow(), createdAt: Date.now(),
    by: syncClientId(), byName: syncName(),
    items: items.map((it) => ({ id: uid(), text: it, done: false })),
  };
  s.noteBoard.push(n);
  return n;
}

// Solo el autor puede editar el texto (o el titulo, si es checklist); guarda
// la version anterior en "history" para el pequeño menu de "Ver historial".
export function editNoteMsg(s: Store, noteId: string, newText: string): boolean {
  const n = findNote(s, noteId);
  const t = (newText || '').trim();
  if (!n || !t || !canEditNote(n) || t === n.text) return false;
  n.history = n.history || [];
  n.history.push({ text: n.text, at: n.editedAt || n.createdAt || Date.now() });
  n.text = t;
  n.editedAt = Date.now();
  return true;
}

// Admin/dueño puede borrar cualquier mensaje; alguien mas comun solo el
// propio. Devuelve la nota borrada (para que Notes.tsx la archive en el log
// local antes de que desaparezca del tablero).
export function deleteNoteMsg(s: Store, noteId: string): Note | null {
  const n = findNote(s, noteId);
  if (!n || !canDeleteNote(s, n)) return null;
  s.noteBoard = (s.noteBoard || []).filter((x) => x.id !== noteId);
  // Queda registrado como borrado (persistido): aunque noteLog todavia tenga
  // la entrada original, ni migrateNoteLogToBoard ni un snapshot viejito van
  // a resucitar esta nota en otro arranque. Ver deletedNoteIdsOf arriba.
  markNoteDeleted(s, noteId);
  return n;
}

// Fijar es una accion de moderacion (mantiene el mensaje mas alla de la
// semana): solo admin/dueño, igual que borrar mensajes ajenos.
export function toggleNotePin(s: Store, noteId: string): boolean {
  const n = findNote(s, noteId);
  if (!n || !canManageNotes(s)) return false;
  n.pinned = !n.pinned;
  // Al fijar se guarda el instante para que las fijadas vayan arriba en
  // orden de fijacion (la ultima fijada encima); al desfijar se suelta.
  n.pinnedAt = n.pinned ? Date.now() : undefined;
  return true;
}

export function addNoteReply(s: Store, noteId: string, text: string): NoteReply | null {
  const n = findNote(s, noteId);
  const t = (text || '').trim();
  if (!n || !t) return null;
  n.replies = n.replies || [];
  const r: NoteReply = { id: uid(), text: t, date: today(), time: timeNow(), createdAt: Date.now(), by: syncClientId(), byName: syncName() };
  n.replies.push(r);
  return r;
}

export function editNoteReply(s: Store, noteId: string, replyId: string, newText: string): boolean {
  const n = findNote(s, noteId);
  const r = n && (n.replies || []).find((x) => x.id === replyId);
  const t = (newText || '').trim();
  if (!n || !r || !t || !canEditNote(r) || t === r.text) return false;
  r.history = r.history || [];
  r.history.push({ text: r.text, at: r.editedAt || r.createdAt || Date.now() });
  r.text = t;
  r.editedAt = Date.now();
  return true;
}

export function deleteNoteReply(s: Store, noteId: string, replyId: string): NoteReply | null {
  const n = findNote(s, noteId);
  const r = n && (n.replies || []).find((x) => x.id === replyId);
  if (!n || !r || !canDeleteNote(s, r)) return null;
  n.replies = (n.replies || []).filter((x) => x.id !== replyId);
  return r;
}

// Marcar/desmarcar un objetivo de la lista: es colaborativo, cualquiera del
// equipo puede tocarlo (no solo quien creo la lista), como un todo list
// compartido de verdad.
export function toggleChecklistItem(s: Store, noteId: string, itemId: string): boolean {
  const n = findNote(s, noteId);
  const it = n && n.kind === 'checklist' && (n.items || []).find((x) => x.id === itemId);
  if (!n || !it) return false;
  it.done = !it.done;
  it.doneBy = it.done ? syncClientId() : undefined;
  it.doneByName = it.done ? syncName() : undefined;
  return true;
}

// Agregar/quitar objetivos de una lista ya publicada: solo el autor (misma
// regla que editar el texto de una nota normal).
export function addChecklistItem(s: Store, noteId: string, text: string): NoteChecklistItem | null {
  const n = findNote(s, noteId);
  const t = (text || '').trim();
  if (!n || n.kind !== 'checklist' || !t || !canEditNote(n)) return null;
  n.items = n.items || [];
  const it: NoteChecklistItem = { id: uid(), text: t, done: false };
  n.items.push(it);
  return it;
}

export function removeChecklistItem(s: Store, noteId: string, itemId: string): boolean {
  const n = findNote(s, noteId);
  if (!n || n.kind !== 'checklist' || !canEditNote(n)) return false;
  const before = (n.items || []).length;
  n.items = (n.items || []).filter((x) => x.id !== itemId);
  return n.items.length !== before;
}

// Editar una lista ya publicada: cambia el titulo y recompone la lista de
// items. Cada item puede traer su id (se conserva el existente, con su
// estado done/doneBy) o sin id (se crea nuevo). Los ids que no vengan en la
// lista pasada se quitan. Solo el autor puede hacerlo (misma regla que el
// texto de una nota normal). El historial registra el titulo anterior cuando
// este cambia.
export function editChecklistNote(s: Store, noteId: string, title: string, items: { id?: string; text: string }[]): boolean {
  const n = findNote(s, noteId);
  if (!n || n.kind !== 'checklist' || !canEditNote(n)) return false;
  const t = (title || '').trim();
  const edited = (items || [])
    .map((x) => ({ id: x.id, text: (x.text || '').trim() }))
    .filter((x) => !!x.text);
  const oldItems = n.items || [];
  const next: NoteChecklistItem[] = edited.map((x) => {
    const existing = x.id ? oldItems.find((o) => o.id === x.id) : undefined;
    if (existing) return { ...existing, text: x.text };
    return { id: uid(), text: x.text, done: false };
  });
  const titleChanged = t !== n.text;
  const itemsChanged = next.length !== oldItems.length || next.some((x, i) => {
    const o = oldItems[i];
    return !o || o.id !== x.id || o.text !== x.text;
  });
  if (!titleChanged && !itemsChanged) return false;
  if (titleChanged) {
    n.history = n.history || [];
    n.history.push({ text: n.text, at: n.editedAt || n.createdAt || Date.now() });
  }
  n.text = t || 'Lista de objetivos';
  n.items = next;
  n.editedAt = Date.now();
  return true;
}

// Barrido semanal: se corre solo, del lado del cliente (esta app no tiene
// servidor/cron), cada vez que alguien abre la pestaña Notas (ver
// Notes.tsx). Lo que barre cualquier dispositivo se sincroniza para todos
// en su siguiente push, asi que basta con que UNO la tenga abierta de vez
// en cuando. Las fijadas nunca expiran. Devuelve lo que se quito, para que
// Notes.tsx lo archive en el log local antes de perderlo del tablero.
export function sweepExpiredNotes(s: Store): Note[] {
  const now = Date.now();
  const board = s.noteBoard || [];
  const expired = board.filter((n) => !n.pinned && now - (n.createdAt || 0) > NOTE_TTL_MS);
  if (expired.length) {
    const ids = new Set(expired.map((n) => n.id));
    s.noteBoard = board.filter((n) => !ids.has(n.id));
    // Igual que con un borrado a mano: lo expirado queda registrado para que
    // la migracion de noteLog no lo devuelva si el tablero queda vacio.
    expired.forEach((n) => markNoteDeleted(s, n.id));
  }
  return expired;
}

// Fija el precio, costo y promociones por defecto de una categoria y los
// copia a todos los productos que ya tengan esa categoria (asi la mayoria de
// un grupo comparte el mismo precio/costo). Cada producto se puede editar
// despues para tener un precio o costo distinto sin afectar a los demas.
// cost es opcional (igual que en el producto): si no se define, queda en 0.
export function setCategoryPricing(s: Store, cat: string, price: number, cost: number, promos: Promo[]): CategoryPricing | null {
  const v = (cat || '').trim();
  if (!v || !Number.isFinite(price) || price < 0) return null;
  const cst = Number.isFinite(cost) && cost >= 0 ? cost : 0;
  const clean: Promo[] = (promos || [])
    .filter((x) => x && x.label && x.label.trim())
    .map((x) => normalizePromo(x, price));
  s.categoryPricing = s.categoryPricing || {};
  const entry: CategoryPricing = { price, cost: cst, promos: clean };
  s.categoryPricing[v] = entry;
  s.products.forEach((p) => {
    if ((p.category || '').trim() === v) {
      p.price = price;
      p.cost = cst;
      p.promos = JSON.parse(JSON.stringify(clean));
    }
  });
  return entry;
}

// Las promociones se editan como texto (no numero) para poder borrar un '0' y
// escribir otra cosa sin que se reponga solo; se convierten a numero (0 si
// queda vacio) al guardar. Se usa tanto en el formulario de producto como en
// el modal de precio de categoria. La unica condicion es de cantidad de la
// misma categoria: 'qtyeq' (exacta) o 'qtygt' (mayor a) N unidades.
export interface EditablePromo {
  id: string;
  label: string;
  type: 'price' | 'pct';
  price: string;
  pct: string;
  cond: 'qtyeq' | 'qtygt';
  min: string;
  start: string;
  end: string;
}
function numText(v: string | number | null | undefined): string {
  return String(v ?? '');
}
export function toEditablePromos(list: Promo[] | undefined): EditablePromo[] {
  return (list || []).map((x) => ({
    id: x.id,
    label: x.label,
    type: x.type === 'pct' ? 'pct' : 'price',
    price: numText(x.price),
    pct: numText(x.pct),
    cond: x.cond === 'qtyeq' ? 'qtyeq' : 'qtygt',
    min: numText(x.min),
    start: x.start || '',
    end: x.end || '',
  }));
}
export function fromEditablePromos(list: EditablePromo[]): Promo[] {
  const num = (v: string) => { const n = Number(v); return !v || !Number.isFinite(n) ? 0 : Math.max(0, n); };
  return list
    .filter((x) => x.label.trim())
    .map((x) => normalizePromo({
      id: x.id,
      label: x.label.trim(),
      type: x.type,
      price: num(x.price),
      pct: num(x.pct),
      cond: x.cond,
      min: num(x.min),
      start: x.start || today(),
      end: x.end || '',
    }, 0));
}

// Fija el campo 'order' de cada producto de UNA categoria segun el nuevo
// orden que llega del arrastre en el Catalogo. Antes esto reordenaba el
// arreglo st.products, pero esa posicion NO viaja de forma confiable por
// Firestore (los productos se sincronizan como mapa por id, y al fusionar
// remoto con local cada dispositivo conserva su PROPIA posicion). Guardar el
// orden como un campo normal del producto si se sincroniza, porque cada
// producto se reemplaza entero con la version mas reciente al recibir un
// cambio remoto.
export function reorderCategoryProducts(s: Store, orderedIds: string[]): void {
  const byId = new Map(s.products.map((p) => [p.id, p]));
  orderedIds.forEach((id, i) => { const p = byId.get(id); if (p) p.order = i; });
}

// Ordena una lista de productos por su campo 'order' (los que no lo tienen
// mantienen su orden relativo original, al final). Se usa para mostrar cada
// categoria del Catalogo siempre en el mismo orden sin importar el
// dispositivo, en vez de confiar en la posicion dentro del arreglo.
export function sortByOrder<T extends { order?: number }>(list: T[]): T[] {
  return list
    .map((x, i) => ({ x, i }))
    .sort((a, b) => {
      const ao = a.x.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.x.order ?? Number.MAX_SAFE_INTEGER;
      return ao !== bo ? ao - bo : a.i - b.i;
    })
    .map((e) => e.x);
}

export function storeCats(s: Store): string[] {
  const cats: string[] = [];
  (s.categories || []).forEach((c) => { const v = (c || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
  s.products.forEach((p) => { const v = (p.category || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
  return cats;
}

// Las listas de la pagina (Catalogo e Inventario, y por comodidad tambien el
// listado de productos en Registro de Venta) se muestran en orden alfabetico
// por defecto. En cuanto el usuario arrastra una fila para reordenar, esa
// categoria pasa a tener 'order' definido en todos sus productos y se respeta
// ese orden manual de ahi en adelante (ver reorderCategoryProducts). Con eso
// se mantiene "alfabetico por defecto pero siempre se puede cambiar de lugar".
export function sortProducts(list: Product[]): Product[] {
  if (list.some((p) => Number.isFinite(p.order))) return sortByOrder(list);
  return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es'));
}

export interface CategoryGroup { name: string; list: Product[]; }

// Agrupa los productos por categoria en el orden de storeCats (el orden en
// que se muestran en Catalogo), con 'Sin categoria' siempre al final. Antes
// esto vivia duplicado dentro de Catalogo.tsx; ahora tambien lo usa
// Inventario para organizar las existencias por categoria igual que el
// catalogo.
export function groupedByCategory(s: Store): CategoryGroup[] {
  const grouped: Record<string, Product[]> = {};
  s.products.forEach((p) => { const c = (p.category || '').trim() || 'Sin categoría'; (grouped[c] = grouped[c] || []).push(p); });
  Object.keys(grouped).forEach((c) => { grouped[c] = sortProducts(grouped[c]); });
  const groups = storeCats(s).map((c) => ({ name: c, list: grouped[c] || [] }));
  if (grouped['Sin categoría']) groups.push({ name: 'Sin categoría', list: grouped['Sin categoría'] });
  return groups;
}

// Inserta una categoria nueva en su posicion alfabetica dentro de store.categories
// para que las listas arranquen en orden alfabetico; despues se puede arrastrar
// para fijar un orden manual (el arreglo categories ES el orden manual de la
// pestana Catalogo).
export function insertCatSorted(s: Store, cat: string): void {
  const v = (cat || '').trim();
  if (!v || storeCats(s).includes(v)) return;
  const list = [...(s.categories || []), v];
  list.sort((a, b) => a.localeCompare(b, 'es'));
  s.categories = list;
}

// Redimensiona y comprime una foto del dispositivo para que quepa en
// localStorage y en el documento de Firestore (límite ~1 MiB). Los
// productos ahora solo se resuben a la nube cuando cambian (ver push() en
// sync.ts), pero un catálogo grande igual puede acercarse al límite del
// documento la primera vez que un dispositivo se conecta: se bajó un poco
// el tamaño/calidad por defecto (sigue viéndose bien en las listas y
// tarjetas donde se usa) para dejar más margen.
// Fotos mas livianas por defecto (antes 420px/0.72 de calidad): cada foto de
// producto viaja embebida dentro del documento principal de la tienda en
// Firestore (ver la nota junto a storeDocRef en sync.ts), asi que catalogos
// con muchas fotos podian acercarse al limite de ~1MB de un documento. Sigue
// siendo una foto nitida para el tamaño en que se ve normalmente (y al darle
// tab para verla en grande), solo que ocupa bastante menos espacio guardada.
export function compressImage(file: File, maxSize = 320, quality = 0.62): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(String(reader.result || '')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          console.warn('Compresión fallida:', e);
          resolve(String(reader.result || ''));
        }
      };
      img.onerror = () => resolve(String(reader.result || ''));
      img.src = String(reader.result || '');
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export function catLabel(p: Product): string {
  return (p.category || '').trim() || 'Sin categoría';
}

export function saleCatsOf(s: Store): string[] {
  const cats = storeCats(s);
  if (s.products.some((p) => !((p.category || '').trim()))) cats.push('Sin categoría');
  return cats;
}

// El dueño de verdad es siempre quien creo la tienda (createdBy), o
// cualquiera en una tienda que no esta sincronizada. Los 'admin' son
// trabajadores a los que el dueño les dio permisos extra (ver Empleados,
// gestionar el equipo), pero seguir sin poder borrar la tienda ni
// desactivar la sincronizacion: eso sigue siendo solo del dueño.
export function isStoreOwner(s: Store): boolean {
  return !s.syncKey || !s.createdBy || s.createdBy === syncClientId();
}

export function myRole(s: Store): Role {
  if (isStoreOwner(s)) return 'owner';
  const m = s.members && s.members[syncClientId()];
  return m && m.role === 'admin' ? 'admin' : 'worker';
}

export function canManageTeam(s: Store): boolean {
  const r = myRole(s);
  return r === 'owner' || r === 'admin';
}

// Evento actualmente activo (pestana Eventos): activado, con pct > 0 y dentro
// del rango de fechas si lo definio. Sus ventas aplican el descuento a todo y
// quedan etiquetadas con el nombre del evento en el historial.
export function activeEvent(s: Store): StoreEvent | undefined {
  const t = today();
  return (s.events || []).find((e) => e && e.name && e.active && (!e.start || t >= e.start) && (!e.end || t <= e.end));
}

export function round2(n: number): number { return Math.round((n + Number.EPSILON) * 100) / 100; }

// Recompensa por unidad que da una promo (precio fijo o % sobre el base).
export function promoUnitReward(pr: Promo, base: number): number {
  if (pr.type === 'pct') return Math.max(0, base * (1 - (pr.pct || 0) / 100));
  return Math.max(0, pr.price);
}

// Para una promo de cantidad fija (qtyeq) el "price" es el PRECIO DEL PAQUETE:
// lo que cuestan las N unidades juntas (no es por unidad). Para % de
// descuento son las N unidades a ese % sobre el precio base.
export function fixedPackageTotal(pr: Promo, base: number): number {
  const n = Math.max(1, pr.min || 1);
  if (pr.type === 'pct') return promoUnitReward(pr, base) * n;
  return Math.max(0, pr.price);
}

// Precio por unidad con las promos del producto aplicadas. La cantidad es el
// total de unidades de la MISMA CATEGORIA en la venta.
//  - "Cantidad mayor a" (qtygt): el price es POR UNIDAD. La primera en
//    prioridad con unidades > N gana y fija el precio de TODAS las unidades.
//  - "Cantidad fija" (qtyeq): el price es el TOTAL del paquete (lo que
//    cuestan esas N unidades juntas). Varias promos fijas forman un precio
//    por BLOQUE que se reinicia: el bloque es la cantidad fija MAS GRANDE,
//    cada bloque completo se cobra el total de su promo y el sobrante se
//    cobra con la promo fija exacta que le toque (o el precio base por
//    unidad). Ej: fija 1 = 5.000, fija 2 = 8.000 y fija 3 = 10.000 da
//    3 unidades = 10.000 y 4 unidades = 15.000: la cuarta unidad vuelve a
//    costar 5.000 (bloque de 3 + 1).
export function promoPrice(p: Product, qty: number): number {
  if (!p || qty <= 0) return p ? p.price : 0;
  const promos = p.promos || [];
  const n = (pr: Promo) => Math.max(1, pr.min || 1);
  const gt = promos.find((pr) => pr.cond === 'qtygt' && qty > Math.max(0, pr.min || 0));
  if (gt) return round2(promoUnitReward(gt, p.price));
  const fixed = promos.filter((pr) => pr.cond === 'qtyeq' && n(pr) <= qty);
  if (!fixed.length) return p.price;
  const k = Math.max(...fixed.map(n));
  const block = fixed.find((f) => n(f) === k)!;
  const groups = Math.floor(qty / k);
  const rem = qty % k;
  let total = groups * fixedPackageTotal(block, p.price);
  if (rem > 0) {
    const rp = fixed.find((f) => n(f) === rem);
    total += (rp ? fixedPackageTotal(rp, p.price) : p.price * rem);
  }
  return round2(total / qty);
}

// Primera promo (en su orden = prioridad) que se aplica a este producto con
// esa cantidad: se muestra como la "Promo aplicada" en la linea de venta.
export function findActivePromo(p: Product | undefined, qty: number): Promo | undefined {
  if (!p || qty <= 0) return undefined;
  const promos = p.promos || [];
  const n = (pr: Promo) => Math.max(1, pr.min || 1);
  const gt = promos.find((pr) => pr.cond === 'qtygt' && qty > Math.max(0, pr.min || 0));
  if (gt) return gt;
  const fixed = promos.filter((pr) => pr.cond === 'qtyeq' && n(pr) <= qty);
  if (!fixed.length) return undefined;
  const k = Math.max(...fixed.map(n));
  if (qty % k === 0) return fixed.find((f) => n(f) === k);
  const exact = fixed.find((f) => n(f) === qty);
  if (exact) return exact;
  if (qty > k) return fixed.find((f) => n(f) === k);
  return undefined;
}

// Precio final por unidad: promos del producto y, encima de eso, el descuento
// del evento activo (que aplica a todo durante el evento).
export function saleUnitPrice(s: Store, p: Product, qty: number): number {
  let price = promoPrice(p, qty);
  const ev = activeEvent(s);
  if (ev && ev.pct) price = price * (1 - (ev.pct || 0) / 100);
  return Math.max(0, round2(price));
}
