import type { AppState, CategoryPricing, InventoryLogEntry, NoteEntry, Product, Promo, Role, Sale, SaleDraft, SaleItem, Store, StoreEvent } from '../types';

export const KEY = 'mi-tiendita-v1';
export const CLIENT_KEY = 'mi-tiendita-client';
export const USER_KEY = 'mi-tiendita-user';

export const APP_VERSION = '1.1.0';

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
// tipo (precio fijo o porcentaje de descuento), no solo el nombre.
export function promoText(x: Promo | undefined | null): string {
  const base = (x && x.label) || 'Promoción';
  if (x && x.type === 'pct') return base + ' · −' + (Number.isFinite(x.pct) ? x.pct : 0) + '%';
  if (x && Number.isFinite(x.price)) return base + ' · ' + money(x.price);
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

export function formatDate(d: string | null | undefined): string {
  if (!d) return '—';
  const s = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d + 'T12:00:00'));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function shortDate(d: string | null | undefined): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(d + 'T12:00:00'));
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
// una migracion) al modelo actual. En el nuevo modelo una promo se aplica de
// forma automatica al rastro de la venta: el tipo de recompensa es 'price'
// (precio fijo) o 'pct' (porcentaje de descuento) y la condicion de
// activacion es 'qty' (cantidad del producto), 'saleTotal' (monto total de la
// venta) o 'date' (rango de fechas).
export function normalizePromo(x: string | Partial<Promo> | undefined | null, fallback: number): Promo {
  if (typeof x === 'string') {
    return { id: uid(), label: x, type: 'price', price: fallback, pct: 0, cond: 'qty', min: 1, start: '', end: '' };
  }
  const base = (x || {}) as Partial<Promo>;
  const type = base.type === 'pct' ? 'pct' : 'price';
  const cond = base.cond === 'saleTotal' || base.cond === 'date' ? base.cond : 'qty';
  const min = Number.isFinite(base.min) ? (base.min as number) : cond === 'qty' ? 1 : 0;
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

// Adds a row for every product and promo (qty 0) so the "Ventas del día" panel
// shows all items and any device can bump them (sync-safe).
export function syncSale(sale: Sale, s: Store): Sale {
  s.products.forEach((p) => {
    if (!sale.items.some((i) => i.productId === p.id && !i.promotionId)) sale.items.push({ productId: p.id, promotionId: null, qty: 0 });
    p.promos.forEach((pr) => {
      if (!sale.items.some((i) => i.productId === p.id && i.promotionId === pr.id)) sale.items.push({ productId: p.id, promotionId: pr.id, qty: 0 });
    });
  });
  return sale;
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
// el modal de precio de categoria. Un campo 'start'/'end' en el rango de
// fechas (cond 'date') con valor vacio significa 'sin limite' de ese lado.
export interface EditablePromo {
  id: string;
  label: string;
  type: 'price' | 'pct';
  price: string;
  pct: string;
  cond: 'qty' | 'saleTotal' | 'date';
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
    cond: x.cond === 'saleTotal' || x.cond === 'date' ? x.cond : 'qty',
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

export function saleDraftOf(state: AppState, s: Store): SaleDraft | null {
  return state.saleDraft && state.saleDraft.storeId === s.id ? state.saleDraft : null;
}

// Evento actualmente activo (pestana Eventos): activado, con pct > 0 y dentro
// del rango de fechas si lo definio. Sus ventas aplican el descuento a todo y
// quedan etiquetadas con el nombre del evento en el historial.
export function activeEvent(s: Store): StoreEvent | undefined {
  const t = today();
  return (s.events || []).find((e) => e && e.name && e.active && (!e.start || t >= e.start) && (!e.end || t <= e.end));
}

// True si una promo esta activa para una venta dada. El "total" es el monto
// en bruto (precios base, antes de aplicar ninguna promo/evento) para evitar
// depedencias circulares entre el descuento y su propia condicion.
export function promoApplies(pr: Promo | undefined, qty: number, saleTotal: number): boolean {
  if (!pr || !pr.label || qty <= 0) return false;
  const t = today();
  if (pr.cond === 'date') {
    if (pr.start && t < pr.start) return false;
    if (pr.end && t > pr.end) return false;
    return true;
  }
  if (pr.cond === 'saleTotal') return saleTotal >= (pr.min || 0);
  return qty >= (pr.min || 1);
}

// Primera promo (en su orden = prioridad, gana la primera que cumpla) que se
// aplica automaticamente a este producto dentro de la venta.
export function findActivePromo(p: Product | undefined, qty: number, saleTotal: number): Promo | undefined {
  if (!p) return undefined;
  for (const pr of p.promos || []) {
    if (promoApplies(pr, qty, saleTotal)) return pr;
  }
  return undefined;
}

// Precio por unidad de un producto ya con la promo aplicada (precio fijo o
// porcentaje sobre el precio base).
export function promoPrice(p: Product, qty: number, saleTotal: number): number {
  const pr = findActivePromo(p, qty, saleTotal);
  if (pr?.type === 'pct') return Math.max(0, p.price * (1 - (pr.pct || 0) / 100));
  if (pr) return Math.max(0, pr.price);
  return p.price;
}

// Precio final por unidad: promo del producto y, encima de eso, el descuento
// del evento activo (que aplica a todo durante el evento).
export function saleUnitPrice(s: Store, p: Product, qty: number, saleTotal: number): number {
  let price = promoPrice(p, qty, saleTotal);
  const ev = activeEvent(s);
  if (ev && ev.pct) price = price * (1 - (ev.pct || 0) / 100);
  return Math.max(0, Math.round(price));
}
