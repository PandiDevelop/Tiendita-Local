import { describe, it, expect, beforeEach } from 'vitest';
import type { AppState, Product, Store } from '../types';
import { makeDraft, normalizeStore, addNote, adoptInvLog, sortByOrder, uid } from '../lib/core';
import { applyRemote } from '../lib/sync';

beforeEach(() => {
  const mem = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k: string, v: string) => { mem.set(k, v); },
    removeItem: (k: string) => { mem.delete(k); },
    clear: () => mem.clear(),
    key: (n: number) => Array.from(mem.keys())[n] ?? null,
    get length(): number { return mem.size; },
  } as Storage;
});

function newStore(id: string): Store {
  return normalizeStore({
    id,
    name: 'Tienda ' + id,
    image: '',
    products: [],
    sales: [],
    categories: [],
    inventory: {},
    notes: '',
    noteLog: [],
    invLog: [],
    createdBy: 'owner-1',
    members: { 'owner-1': { name: 'María', role: 'owner' as const, joinedAt: Date.now() } },
  });
}

function addProduct(s: Store, name: string, price: number): string {
  const p: Product = { id: uid(), name, price, image: '', promos: [], category: '' };
  s.products.push(p);
  return p.id;
}

// Estado mutable por dispositivo: la misma referencia que usan getState y mutate
// (como stateRef + replace en la app real).
interface Device { st: Store; ref: AppState; }
function device(id: string): Device {
  const st = newStore(id);
  const ref = makeDraft();
  ref.stores = [st];
  ref.activeStoreId = st.id;
  return { st, ref };
}

function makePayload(st: Store) {
  const products: Record<string, Product> = {};
  st.products.forEach((p) => (products[p.id] = p));
  const noteLog: Record<string, unknown> = {};
  (st.noteLog || []).forEach((e) => { if (e.id) noteLog[e.id] = e; });
  const invLog: Record<string, unknown> = {};
  (st.invLog || []).forEach((e) => { if (e.id) invLog[e.id] = e; });
  return {
    name: st.name,
    image: st.image,
    inventory: st.inventory,
    invLog,
    noteLog,
    notes: st.notes || '',
    products,
    categories: st.categories || [],
    categoryPricing: st.categoryPricing || {},
    updatedBy: 'device-' + st.id,
    members: st.members || {},
    createdBy: st.createdBy,
  };
}

function apply(src: Store, dst: Device) {
  applyRemote(() => dst.ref, (up) => up(dst.ref), dst.st.id, makePayload(src));
}

describe('sync de inventario y notas entre dos dispositivos', () => {
  it('el cargamento agregado por A llega a B', () => {
    const a = device('A');
    const b = device('B');
    const pid = addProduct(a.st, 'Cereal', 5000);
    adoptInvLog(a.st, pid, 20, 'Distribuidora X');

    apply(a.st, b);

    expect(b.st.inventory[pid]).toBe(20);
    expect(b.st.invLog.length).toBe(1);
  });

  it('el stock editado a mano (lapiz) en A se propaga a B', () => {
    const a = device('A');
    const b = device('B');
    const pid = addProduct(a.st, 'Cereal', 5000);
    adoptInvLog(a.st, pid, 10, 'Entrada');
    adoptInvLog(a.st, pid, -5, ''); // lapiz: total 5

    apply(a.st, b);

    expect(b.st.inventory[pid]).toBe(5);
  });

  it('las notas publicadas por A llegan a B con autor', () => {
    const a = device('A');
    const b = device('B');
    addNote(a.st, 'Llego el pedido de hoy');

    apply(a.st, b);

    expect(b.st.noteLog.length).toBe(1);
    expect(b.st.noteLog[0].byName).toBeTruthy();
  });

  it('las notas de A y B se fusionan sin perderse (union por id)', () => {
    const a = device('A');
    const b = device('B');
    addNote(a.st, 'Nota de A');
    addNote(b.st, 'Nota de B');

    apply(a.st, b);
    apply(b.st, a);

    expect(a.st.noteLog.length).toBe(2);
    expect(b.st.noteLog.length).toBe(2);
  });

  it('el inventario converge por el mayor valor y no pierde cargas', () => {
    const a = device('A');
    const b = device('B');
    const pid = addProduct(a.st, 'Galletas', 3000);
    a.st.products[0].id = pid;
    b.st.products.push({ ...a.st.products[0] });
    b.st.products[0].id = pid;
    adoptInvLog(a.st, pid, 10, 'A');
    adoptInvLog(b.st, pid, 5, 'B');

    // A -> B, luego B -> A
    apply(a.st, b);
    apply(b.st, a);

    expect(a.st.inventory[pid]).toBe(10);
    expect(b.st.inventory[pid]).toBe(10);
  });

  it('aplicar la misma snapshot dos veces no duplica notas ni inventario', () => {
    const a = device('A');
    const b = device('B');
    const pid = addProduct(a.st, 'Leche', 4000);
    adoptInvLog(a.st, pid, 3, 'X');
    addNote(a.st, 'Nota');

    const payload = makePayload(a.st);
    applyRemote(() => b.ref, (up) => up(b.ref), b.st.id, payload);
    applyRemote(() => b.ref, (up) => up(b.ref), b.st.id, payload);

    expect(b.st.noteLog.length).toBe(1);
    expect(b.st.invLog.length).toBe(1);
    expect(b.st.inventory[pid]).toBe(3);
  });

  it('el orden de categorias que reordena A (arrastrar) se refleja en B', () => {
    const a = device('A');
    const b = device('B');
    a.st.categories = ['Bebidas', 'Snacks'];
    apply(a.st, b);
    expect(b.st.categories).toEqual(['Bebidas', 'Snacks']);

    // A arrastra Snacks antes que Bebidas y vuelve a empujar.
    a.st.categories = ['Snacks', 'Bebidas'];
    apply(a.st, b);
    expect(b.st.categories).toEqual(['Snacks', 'Bebidas']);
  });

  it('una categoria creada solo en B no se pierde al recibir el orden de A', () => {
    const a = device('A');
    const b = device('B');
    a.st.categories = ['Bebidas'];
    b.st.categories = ['Bebidas', 'Snacks'];

    apply(a.st, b);

    expect(b.st.categories).toEqual(['Bebidas', 'Snacks']);
  });

  it('el orden de productos (campo order) que arrastra A dentro de una categoria se refleja en B', () => {
    const a = device('A');
    const b = device('B');
    const p1 = addProduct(a.st, 'Agua', 2000);
    const p2 = addProduct(a.st, 'Gaseosa', 3000);
    a.st.products.forEach((p) => { p.category = 'Bebidas'; });
    apply(a.st, b);

    // A arrastra para poner Gaseosa primero.
    a.st.products.find((p) => p.id === p2)!.order = 0;
    a.st.products.find((p) => p.id === p1)!.order = 1;
    apply(a.st, b);

    const ordered = sortByOrder(b.st.products).map((p) => p.id);
    expect(ordered).toEqual([p2, p1]);
  });
});