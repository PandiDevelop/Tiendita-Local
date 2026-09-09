import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AppState, Product, Store } from '../types';
import { makeDraft, normalizeStore, addNote, adoptInvLog, sortByOrder, uid, costFor, priceFor, total, costTotal, profitTotal, setCategoryPricing, groupedByCategory } from '../lib/core';
import { applyRemote } from '../lib/sync';

vi.mock('firebase/app', () => ({ initializeApp: () => ({}) }));
vi.mock('firebase/firestore', () => ({
  initializeFirestore: () => ({}),
  collection: () => ({}),
  doc: (_parent: unknown, id?: string) => ({ id }),
  query: (q: unknown) => q,
  onSnapshot: () => () => {},
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ forEach: () => {} })),
  deleteDoc: vi.fn(() => Promise.resolve()),
  deleteField: () => ({}),
}));

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
    noteBoard: [],
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

describe('ganancias: costo por producto y calculo de margen', () => {
  it('normalizeStore le pone costo 0 a productos viejos sin ese campo', () => {
    const s = normalizeStore({
      id: 's1', name: 'T', image: '', products: [
        { id: 'p1', name: 'Pan', price: 1000, image: '', promos: [], category: '' } as Product,
      ], sales: [], categories: [], inventory: {}, notes: '', noteLog: [], noteBoard: [], invLog: [],
    } as Store);
    expect(s.products[0].cost).toBe(0);
  });

  it('costFor usa el costo actual del producto si la venta no tiene uno propio guardado', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Pan', 1000);
    s.products.find((p) => p.id === pid)!.cost = 400;
    const item = { productId: pid, promotionId: null, qty: 3 };
    expect(costFor(item, s)).toBe(400);
    expect(priceFor(item, s)).toBe(1000);
  });

  it('costFor respeta el costo guardado en la venta aunque el producto cambie despues', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Pan', 1000);
    s.products.find((p) => p.id === pid)!.cost = 400;
    const item = { productId: pid, promotionId: null, qty: 2, price: 1000, cost: 300 };
    // El producto sube de costo despues de la venta...
    s.products.find((p) => p.id === pid)!.cost = 900;
    // ...pero la venta ya guardada conserva el costo de cuando se vendio.
    expect(costFor(item, s)).toBe(300);
  });

  it('total/costTotal/profitTotal calculan bien la ganancia de una venta', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Pan', 1000);
    s.products.find((p) => p.id === pid)!.cost = 400;
    const sale = { id: 'v1', date: '2026-01-01', time: '10:00', employee: 'X', closed: true, items: [{ productId: pid, promotionId: null, qty: 3, price: 1000, cost: 400 }] };
    expect(total(sale, s)).toBe(3000);
    expect(costTotal(sale, s)).toBe(1200);
    expect(profitTotal(sale, s)).toBe(1800);
  });
});

describe('categorias: precio y costo base, agrupado por categoria', () => {
  it('setCategoryPricing copia precio, costo y promos a todos los productos de la categoria', () => {
    const s = newStore('s1');
    const p1 = addProduct(s, 'Agua', 1000);
    const p2 = addProduct(s, 'Gaseosa', 1000);
    s.products.forEach((p) => { p.category = 'Bebidas'; });
    setCategoryPricing(s, 'Bebidas', 2000, 800, []);
    expect(s.products.find((p) => p.id === p1)!.price).toBe(2000);
    expect(s.products.find((p) => p.id === p1)!.cost).toBe(800);
    expect(s.products.find((p) => p.id === p2)!.cost).toBe(800);
    expect(s.categoryPricing!['Bebidas'].cost).toBe(800);
  });

  it('groupedByCategory ordena segun storeCats y deja Sin categoria al final', () => {
    const s = newStore('s1');
    addProduct(s, 'Suelto', 500);
    const p1 = addProduct(s, 'Agua', 1000);
    s.categories = ['Bebidas'];
    s.products.find((p) => p.id === p1)!.category = 'Bebidas';
    const groups = groupedByCategory(s);
    expect(groups.map((g) => g.name)).toEqual(['Bebidas', 'Sin categoría']);
    expect(groups[0].list.map((p) => p.id)).toEqual([p1]);
  });
});

describe('createSync push() incremental y con reintento', () => {
  function mockSetDoc(impl?: () => Promise<void>) {
    const calls: { id?: string; data: Record<string, unknown> }[] = [];
    const setDocMock = vi.fn((ref: { id?: string }, data: Record<string, unknown>) => {
      const run = impl ? impl() : Promise.resolve();
      return run.then(() => { calls.push({ id: ref.id, data }); });
    });
    return { setDocMock, calls };
  }

  it('solo reenvia los productos que cambiaron desde el ultimo push exitoso', async () => {
    const { createSync } = await import('../lib/sync');
    const { setDoc } = await import('firebase/firestore');
    const setDocMock = setDoc as unknown as ReturnType<typeof vi.fn>;
    setDocMock.mockClear();
    const { setDocMock: impl, calls } = mockSetDoc();
    setDocMock.mockImplementation(impl);

    const dev = device('A');
    dev.st.syncKey = 'clave-1';
    const pid1 = addProduct(dev.st, 'Agua', 1000);
    const pid2 = addProduct(dev.st, 'Pan', 2000);

    const sync = createSync(() => dev.ref, () => {}, () => {});
    await sync.push(dev.st.id);
    // 2 documentos de producto + 1 documento principal = 3 llamadas
    const productCalls1 = calls.filter((c) => !('updatedBy' in c.data));
    expect(productCalls1.map((c) => c.id).sort()).toEqual([pid1, pid2].sort());

    // Solo se edita el nombre de un producto: el siguiente push debe reescribir
    // UNICAMENTE ese documento de producto, no todo el catalogo de nuevo.
    dev.st.products.find((p) => p.id === pid1)!.name = 'Agua fría';
    await sync.push(dev.st.id);
    const productCalls2 = calls.filter((c) => !('updatedBy' in c.data));
    // Las mismas 2 del primer push + 1 del segundo push = 3
    expect(productCalls2.length).toBe(3);
    // El documento reescrito es el de pid1
    expect(productCalls2[2].id).toBe(pid1);
  });

  it('si el push falla no lo marca como enviado y reintenta solo', async () => {
    vi.useFakeTimers();
    const { createSync } = await import('../lib/sync');
    const { setDoc } = await import('firebase/firestore');
    const setDocMock = setDoc as unknown as ReturnType<typeof vi.fn>;
    setDocMock.mockClear();
    let attempt = 0;
    const { setDocMock: impl } = mockSetDoc(() => {
      attempt++;
      return attempt === 1 ? Promise.reject(new Error('sin conexión')) : Promise.resolve();
    });
    setDocMock.mockImplementation(impl);

    const dev = device('A');
    dev.st.syncKey = 'clave-2';
    addProduct(dev.st, 'Agua', 1000);

    let failing = 0;
    const sync = createSync(() => dev.ref, () => {}, () => {}, () => { failing++; });
    await sync.push(dev.st.id);
    expect(setDocMock).toHaveBeenCalledTimes(1);

    // Sin ningun cambio local nuevo, el reintento automatico (4s) debe
    // volver a intentar el mismo push por su cuenta, y esta vez si guardarlo.
    const callsBefore = setDocMock.mock.calls.length;
    await vi.advanceTimersByTimeAsync(4100);
    expect(setDocMock.mock.calls.length).toBeGreaterThan(callsBefore);

    vi.useRealTimers();
  });

  it('las notas y el log de inventario van como objeto anidado (noteLog: {id: entry}) dentro del documento principal, vía set+merge', async () => {
    // Probado a mano contra Firestore real: setDoc(ref, {noteLog:{...}},
    // {merge:true}) SI fusiona el mapa noteLog por clave sin pisar lo que
    // subio otro dispositivo, y updateDoc() falla si el documento todavia
    // no existe (p.ej. la primerisima vez que se activa la sincronizacion).
    // Por eso el documento principal siempre va con setDoc(...,{merge:true}),
    // nunca con updateDoc().
    const { createSync } = await import('../lib/sync');
    const { setDoc } = await import('firebase/firestore');
    const setDocMock = setDoc as unknown as ReturnType<typeof vi.fn>;
    setDocMock.mockClear();
    const { setDocMock: impl, calls } = mockSetDoc();
    setDocMock.mockImplementation(impl);

    const dev = device('A');
    dev.st.syncKey = 'clave-notas';
    addProduct(dev.st, 'Agua', 1000);
    addNote(dev.st, 'Hola equipo');
    addNote(dev.st, 'Segunda nota');
    const pid = dev.st.products[0].id;
    adoptInvLog(dev.st, pid, 5, 'Distribuidora');

    const sync = createSync(() => dev.ref, () => {}, () => {});
    await sync.push(dev.st.id);

    expect(calls.length).toBe(2);
    const mainCall = calls.find((c) => 'updatedBy' in c.data);
    expect(mainCall).toBeDefined();
    const data = mainCall!.data as { noteLog?: Record<string, unknown>; invLog?: Record<string, unknown> };
    // Ningun campo con un punto LITERAL en el nombre (ese era el bug viejo).
    expect(Object.keys(data).some((k) => k.includes('.'))).toBe(false);
    expect(Object.keys(data.noteLog || {}).length).toBe(2);
    expect(Object.keys(data.invLog || {}).length).toBe(1);
  });

  it('si llega un segundo push mientras el primero sigue en curso, se encola en vez de dispararse en paralelo', async () => {
    const { createSync } = await import('../lib/sync');
    const { setDoc } = await import('firebase/firestore');
    const setDocMock = setDoc as unknown as ReturnType<typeof vi.fn>;
    setDocMock.mockClear();

    let resolveFirstSetDoc: (() => void) | null = null;
    let setDocCalls = 0;
    setDocMock.mockImplementation(() => {
      setDocCalls++;
      if (setDocCalls === 1) return new Promise<void>((resolve) => { resolveFirstSetDoc = resolve; });
      return Promise.resolve();
    });

    const dev = device('A');
    dev.st.syncKey = 'clave-3';
    addProduct(dev.st, 'Agua', 1000);

    const sync = createSync(() => dev.ref, () => {}, () => {});
    // Arranca el primer push: el primer setDoc (producto) se queda "colgado"
    // a proposito para simular que sigue en curso.
    const p1 = sync.push(dev.st.id);
    expect(setDocCalls).toBe(1);

    // Mientras el primero sigue en curso, cambia algo mas y se pide otro
    // push: NO debe disparar un segundo setDoc en paralelo.
    addProduct(dev.st, 'Pan', 2000);
    await sync.push(dev.st.id);
    expect(setDocCalls).toBe(1);

    // Al terminar el primero, el que quedo encolado se dispara solo.
    resolveFirstSetDoc!();
    await p1;
    await Promise.resolve();
    await Promise.resolve();
    // 1 (producto colgado) + 1 (doc principal, push 1) + 1 (producto, push 2) + 1 (doc principal, push 2) = 4
    expect(setDocCalls).toBe(4);
  });

  it('los productos se guardan como documentos individuales (subcoleccion), no embebidos en el doc principal', async () => {
    const { createSync } = await import('../lib/sync');
    const { setDoc } = await import('firebase/firestore');
    const setDocMock = setDoc as unknown as ReturnType<typeof vi.fn>;
    setDocMock.mockClear();
    const { setDocMock: impl, calls } = mockSetDoc();
    setDocMock.mockImplementation(impl);

    const dev = device('A');
    dev.st.syncKey = 'clave-grande';
    addProduct(dev.st, 'Agua', 1000);
    addProduct(dev.st, 'Pan', 2000);

    const sync = createSync(() => dev.ref, () => {}, () => {});
    await sync.push(dev.st.id);

    // 2 documentos de producto + 1 documento principal = 3 llamadas
    expect(calls.length).toBe(3);
    // Los documentos de producto NO tienen updatedBy
    const productCalls = calls.filter((c) => !('updatedBy' in c.data));
    expect(productCalls.length).toBe(2);
    expect(productCalls.every((c) => c.data && typeof c.data.name === 'string' && 'price' in c.data)).toBe(true);
    // El documento principal SI tiene updatedBy
    const mainCall = calls.find((c) => 'updatedBy' in c.data);
    expect(mainCall).toBeDefined();
    // El documento principal NO tiene products embebidos
    expect(mainCall!.data.products).toBeUndefined();
  });
});
