import type { AppState, InventoryLogEntry, Product, Sale, SaleDraft, SaleItem, Store } from '../types';

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

export function esc(v: string | number | null | undefined): string {
  return String(v ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] as string));
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

export function normalizeStore(store: Store): Store {
  store.image = store.image || DEFAULT_STORE_IMAGE;
  store.products ||= [];
  store.sales ||= [];
  store.categories = store.categories || [];
  store.inventory = store.inventory || {};
  store.notes = typeof store.notes === 'string' ? store.notes : '';
  store.invLog = Array.isArray(store.invLog) ? store.invLog : [];
  store.products.forEach((p) => {
    const old = p.promos ?? [];
    p.promos = old.map((x) =>
      typeof x === 'string' ? { id: uid(), label: x, price: p.price } : { id: x.id || uid(), label: x.label || '', price: Number.isFinite(x.price) ? x.price : p.price },
    );
    p.category = p.category || '';
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
  (merged.stores || []).forEach(normalizeStore);
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

export function total(sale: Sale, s: Store): number {
  return sale.items.reduce((n, i) => n + priceFor(i, s) * i.qty, 0);
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

// Registra un cambio de inventario (delta con signo: + suma, - resta) y aplica
// el ajuste al conteo local. Las unidades siempre son enteras. El log es
// inmutable y se fusiona por id al sincronizar.
export function adoptInvLog(s: Store, productId: string, delta: number, supplier: string): void {
  const d = Math.round(delta);
  if (!d) return;
  s.invLog ||= [];
  s.invLog.push({ id: uid(), productId, date: today(), time: timeNow(), qty: d, supplier: (supplier || '').trim(), by: syncClientId() });
  s.inventory = s.inventory || {};
  s.inventory[productId] = Math.max(0, Math.round(s.inventory[productId] || 0) + d);
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

export function storeCats(s: Store): string[] {
  const cats: string[] = [];
  (s.categories || []).forEach((c) => { const v = (c || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
  s.products.forEach((p) => { const v = (p.category || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
  return cats;
}

// Redimensiona y comprime una foto del dispositivo para que quepa en
// localStorage y en el documento de Firestore (límite ~1 MiB).
export function compressImage(file: File, maxSize = 480, quality = 0.82): Promise<string> {
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

export function saleDraftOf(state: AppState, s: Store): SaleDraft | null {
  return state.saleDraft && state.saleDraft.storeId === s.id ? state.saleDraft : null;
}
