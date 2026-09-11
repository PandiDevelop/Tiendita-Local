import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AppState, Product, Store, CostEntry, SaleItem } from '../types';
import { makeDraft, normalizeStore, addNote, addNoteMsg, deleteNoteMsg, adoptInvLog, sortByOrder, uid, costFor, priceFor, total, costTotal, profitTotal, setCategoryPricing, groupedByCategory, syncClientId, toggleNotePin, ensureCost, findCostId, mergeCostEntries } from '../lib/core';
import { applyRemote } from '../lib/sync';

vi.mock('firebase/app', () => ({ initializeApp: () => ({}) }));
vi.mock('firebase/firestore', () => ({
  initializeFirestore: () => ({}),
  collection: () => ({}),
  doc: (_parent: unknown, id?: string) => ({ id }),
  query: (q: unknown) => q,
  onSnapshot: (_ref: unknown, onNext: (snap: unknown) => void) => {
    // Snapshot minimo que sirve tanto para el listener del doc principal
    // (exists/data) como para el de la subcoleccion de productos (forEach):
    // el codigo real de sync.ts solo toca lo que le corresponde a cada uno.
    try { onNext({ exists: () => false, data: () => undefined, forEach: () => {} }); } catch { /* ignorar */ }
    return () => {};
  },
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
  // El tablero de notas viaja igual que noteLog: mapa por id en el campo
  // "noteBoard" del documento principal (ver Note en types.ts).
  const noteBoard: Record<string, unknown> = {};
  (st.noteBoard || []).forEach((n) => { if (n && n.id) noteBoard[n.id] = n; });
  const invLog: Record<string, unknown> = {};
  (st.invLog || []).forEach((e) => { if (e.id) invLog[e.id] = e; });
  return {
    name: st.name,
    image: st.image,
    inventory: st.inventory,
    invLog,
    noteLog,
    noteBoard,
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

describe('sync del tablero de notas (noteBoard)', () => {
  it('un snapshot de productos (sin noteBoard) no vacía el tablero de notas ya visto en B', () => {
    const a = device('A');
    const b = device('B');
    const n = addNoteMsg(a.st, 'Nota importante')!;
    apply(a.st, b); // B ve la nota: queda en su set "seen" local
    expect(b.st.noteBoard.map((x) => x.id)).toEqual([n.id]);
    // Ahora llega un snapshot de la subcoleccion de productos, que viaja SIN
    // noteBoard ni updatedBy. Bug arreglado: antes esta reconciliacion con
    // remoto vacio borraba del tablero local todas las notas ya vistas
    // (aparecian/desaparecian y se barajaba el orden).
    applyRemote(() => b.ref, (up) => up(b.ref), b.st.id, { products: {} });
    expect(b.st.noteBoard.map((x) => x.id)).toEqual([n.id]);
  });

  it('una nota borrada por el autor en A desaparece también en B', () => {
    const a = device('A');
    const b = device('B');
    const n = addNoteMsg(a.st, 'Nota a borrar')!;
    apply(a.st, b);
    expect(b.st.noteBoard.length).toBe(1);
    deleteNoteMsg(a.st, n.id);
    apply(a.st, b);
    expect(b.st.noteBoard.length).toBe(0);
  });

  it('borrar la última nota no la resucita desde noteLog al normalizar (bug de resurrección)', () => {
    const a = device('A');
    // Tienda del modelo viejo: noteLog con la entrada original (la migracion
    // la paso al tablero una vez) y el tablero con esa misma nota.
    const entry = { id: uid(), text: 'Nota vieja del modelo anterior', date: '01/01/2026', time: '10:00', by: syncClientId(), byName: 'Ana' };
    a.st.noteLog = [entry];
    a.st.noteBoard = [{ id: entry.id, kind: 'text' as const, text: entry.text, by: entry.by, byName: entry.byName, date: entry.date, time: entry.time, createdAt: Date.now() }];

    deleteNoteMsg(a.st, entry.id);
    expect(a.st.noteBoard.length).toBe(0);
    // normalizeStore corre en cada arranque y en cada snapshot remoto
    // (applyRemote). Antes del fix, dejaba el tablero vacio y la migracion de
    // noteLog volvia a crear la nota borrada (que luego se re-subia a la nube).
    normalizeStore(a.st);
    expect(a.st.noteBoard.length).toBe(0);
  });

  it('un snapshot viejito que aún trae una nota borrada en este dispositivo no la resucita', () => {
    const a = device('A');
    const b = device('B');
    const n = addNoteMsg(a.st, 'Nota')!;
    apply(a.st, b); // B la ve
    deleteNoteMsg(b.st, n.id); // B la borra (es el autor)
    expect(b.st.noteBoard.length).toBe(0);
    // Un snapshot de cualquier otro dispositivo que todavia la trae (esa
    // nota quedo en la nube por un push de borrado que no llego, etc.).
    applyRemote(() => b.ref, (up) => up(b.ref), b.st.id, { noteBoard: { [n.id]: n }, updatedBy: 'A' });
    normalizeStore(b.st);
    expect(b.st.noteBoard.length).toBe(0);
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

describe('historial de costos por producto + proveedor', () => {
  it('ensureCost crea un registro la primera vez y reutiliza el mismo combo sin duplicar', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Camiseta', 20000);
    const a = ensureCost(s, pid, 'Proveedor A', 20000);
    const a2 = ensureCost(s, pid, 'Proveedor A', 20000);
    expect(a).toBeTruthy();
    expect(a2).toBe(a);
    expect(findCostId(s, pid, 'Proveedor A', 20000)).toBe(a);
    expect(s.costs!.length).toBe(1);
  });

  it('conserva costos distintos del mismo producto+proveedor y reutiliza el que vuelve a aparecer', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Camiseta', 20000);
    const a = ensureCost(s, pid, 'Proveedor A', 20000); // cargamento 1
    const b = ensureCost(s, pid, 'Proveedor A', 22000); // cargamento 2
    const c = ensureCost(s, pid, 'Proveedor A', 19000); // cargamento 3
    const aAgain = ensureCost(s, pid, 'Proveedor A', 22000); // cargamento 4: vuelve
    expect(new Set([a, b, c]).size).toBe(3);
    expect(aAgain).toBe(b); // reutiliza el de $22.000, no crea otro
    expect(s.costs!.length).toBe(3);
  });

  it('distingue claves por producto y por proveedor', () => {
    const s = newStore('s1');
    const cam = addProduct(s, 'Camiseta', 20000);
    const pan = addProduct(s, 'Pan', 1000);
    const a = ensureCost(s, cam, 'Proveedor A', 20000);
    const b = ensureCost(s, pan, 'Proveedor A', 20000); // otro producto
    const c = ensureCost(s, cam, 'Proveedor B', 20000); // otro proveedor
    expect(new Set([a, b, c]).size).toBe(3);
    expect(s.costs!.length).toBe(3);
  });

  it('normaliza el nombre del proveedor para la clave compuesta', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Zapatos', 30000);
    const a = ensureCost(s, pid, 'Distribuidora del Sur', 30000);
    const b = ensureCost(s, pid, 'distribuidora  del  SUR', 30000);
    expect(b).toBe(a);
    expect(s.costs!.length).toBe(1);
  });

  it('el cargamento guarda el costo y la referencia al registro del historial', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Zapatos', 30000);
    const cid = ensureCost(s, pid, 'ABC', 35000, 'ABC');
    adoptInvLog(s, pid, 10, 'ABC', 'Marco', 'ABC', 35000, cid);
    expect(s.invLog[0].costId).toBe(cid);
    expect(s.invLog[0].cost).toBe(35000);
    expect(s.inventory[pid]).toBe(10);
  });

  it('un registrador sin costo no crea entradas en el historial', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Pan', 1000);
    adoptInvLog(s, pid, 5, '');
    expect(s.invLog[0].cost).toBeUndefined();
    expect(s.invLog[0].costId).toBe('');
    expect(s.costs || []).toHaveLength(0);
  });

  it('mergeCostEntries no duplica un combo que llega desde otro dispositivo', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Zapatos', 30000);
    const mine = ensureCost(s, pid, 'ABC', 30000);
    const remote: CostEntry[] = [{ id: 'remote-otro-id', productId: pid, supplier: 'abc', cost: 30000, at: '2026-09-11' }];
    const merged = mergeCostEntries(s.costs, remote);
    expect(merged.length).toBe(1);
    expect(merged[0].id).toBe(mine); // gana la id que ya existia
  });

  it('mergeCostEntries adopta la id remota si el combo solo existe alla', () => {
    const pid = 'p1';
    const merged = mergeCostEntries([], [{ id: 'r1', productId: pid, supplier: 'abc', cost: 5000 }]);
    expect(merged.length).toBe(1);
    expect(merged[0].id).toBe('r1');
  });

  it('normalizeStore purga costos duplicados que hayan quedado por error', () => {
    const s = normalizeStore({
      id: 's1', name: 'T', image: '', products: [], sales: [], categories: [], inventory: {}, notes: '', noteLog: [], noteBoard: [], invLog: [],
      costs: [
        { id: 'x1', productId: 'p1', supplier: 'abc', cost: 5000 },
        { id: 'x2', productId: 'p1', supplier: 'abc', cost: 5000 },
        { id: 'x3', productId: 'p1', supplier: 'abc', cost: 9000 },
      ],
    } as Store);
    expect(s.costs!.length).toBe(2);
    expect(s.costs!.some((c) => c.cost === 5000)).toBe(true);
    expect(s.costs!.some((c) => c.cost === 9000)).toBe(true);
  });

  it('la venta guarda costId y su costo no cambia aunque el proveedor suba despues', () => {
    const s = newStore('s1');
    const pid = addProduct(s, 'Zapatos', 30000);
    const p = s.products.find((x) => x.id === pid)!;
    p.supplier = 'ABC';
    p.cost = 35000;
    const cid = ensureCost(s, pid, 'ABC', 35000);
    const item: SaleItem = { productId: pid, promotionId: null, qty: 2, price: 30000, cost: 35000, costId: cid };
    // El proveedor sube luego a $40.000: entra en el historial sin tocar el viejo.
    const cid2 = ensureCost(s, pid, 'ABC', 40000);
    s.products.find((x) => x.id === pid)!.cost = 40000;
    expect(item.costId).toBe(cid);
    expect(cid2).not.toBe(cid);
    expect(s.costs!.length).toBe(2);
    // La venta vieja sigue calculando con $35.000, no con el actual.
    expect(costFor(item, s)).toBe(35000);
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
    sync.attach(dev.st.id);
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
    sync.attach(dev.st.id);
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
    sync.attach(dev.st.id);
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
    sync.attach(dev.st.id);
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
    sync.attach(dev.st.id);
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

describe('fijar una nota guarda cuando se fijo (pinnedAt)', () => {
  it('al fijar queda arriba (pinnedAt) y al desfijar se suelta', () => {
    const dev = device('A');
    const note = addNoteMsg(dev.st, 'Nota a fijar');
    expect(note).not.toBeNull();
    if (!note) return;
    expect(note.pinned ?? false).toBe(false);
    expect(toggleNotePin(dev.st, note.id)).toBe(true);
    expect(note.pinned).toBe(true);
    expect(typeof note.pinnedAt).toBe('number');
    toggleNotePin(dev.st, note.id);
    expect(note.pinned).toBe(false);
    expect(note.pinnedAt).toBe(undefined);
  });
});
