import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore, collection, doc, onSnapshot, setDoc, getDoc, getDocs, deleteField, writeBatch } from 'firebase/firestore';
import type { AppState, Member, Product, Role, Sale, Store } from '../types';
import { toProductsArr, toSalesArr, toInvLogArr, toNoteLogArr, mergeItems, mergeInvLog, mergeNoteLog, syncKeyOf, syncClientId, syncName, normalizeStore, DEFAULT_STORE_IMAGE, uid } from './core';
import { customAlert, customConfirm } from './dialog';

export { syncClientId, syncName, syncSetName, syncGenPin, syncKeyOf } from './core';

export interface FIREBASE_CONFIG {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const FIREBASE_CONFIG: FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCkFEZDv0pmyHUpqWUJ8v2f4KqL5neIxTI',
  authDomain: 'mi-tiendita-28827.firebaseapp.com',
  projectId: 'mi-tiendita-28827',
  storageBucket: 'mi-tiendita-28827.firebasestorage.app',
  messagingSenderId: '816762296976',
  appId: '1:816762296976:web:28a211e896878c62089615',
  measurementId: 'G-E8KXZC1G0D',
};

let app: FirebaseApp | null = null;
let DB: Firestore | null = null;

export function syncReady(): boolean {
  if (DB) return true;
  if (!FIREBASE_CONFIG?.projectId) return false;
  try {
    if (!app) app = initializeApp(FIREBASE_CONFIG);
    // Antes: getFirestore(app) (deja que el SDK detecte el transporte). En
    // redes moviles/datos con proxys raros, esa deteccion a veces se queda
    // en un modo lento o se traba, y los cambios en tiempo real tardan
    // mucho mas de lo normal en llegar. experimentalAutoDetectLongPolling
    // hace que el SDK pruebe long-polling automaticamente si detecta que
    // el streaming normal no esta funcionando bien, sin que el usuario
    // note nada: es la configuracion recomendada por Firebase para apps
    // que se usan mucho desde el celular.
    DB = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
    return true;
  } catch (e) {
    console.warn('Firebase no disponible:', e);
    return false;
  }
}

// Cada producto vive en su propio documento dentro de una subcoleccion
// "products" del documento de la tienda, en vez de embebido como mapa
// dentro del documento principal. Antes, con TODOS los productos (y sus
// fotos) metidos en un solo documento, era facil pasarse del limite de
// ~1MB que tiene un documento de Firestore segun crecia el catalogo: al
// pasarse, el guardado fallaba COMPLETO (productos, ventas, notas,
// inventario, todo junto, porque viajaba en el mismo documento), lo que se
// sentia como "la sincronizacion esta fallando" sin ninguna pista de por
// que. Con un documento por producto, el limite de tamaño ya no depende de
// cuantos productos tenga la tienda, solo del tamaño de UNA foto (muy por
// debajo del limite).
function storeDocRef(key: string) {
  return doc(collection(DB!, 'stores'), key);
}
function productsColRef(key: string) {
  return collection(storeDocRef(key), 'products');
}
function productDocPayload(p: Product, by: string): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    id: p.id,
    name: p.name || '',
    price: Number.isFinite(p.price) ? p.price : 0,
    cost: Number.isFinite(p.cost) ? p.cost : 0,
    image: p.image || '',
    promos: Array.isArray(p.promos) ? p.promos : [],
    category: p.category || '',
    updatedBy: by,
  };
  if (typeof p.order === 'number' && Number.isFinite(p.order)) payload.order = p.order;
  return payload;
}
function productFromDoc(id: string, data: Record<string, unknown>): Product {
  const p: Product = {
    id,
    name: String(data.name || ''),
    price: Number(data.price) || 0,
    cost: Number(data.cost) || 0,
    image: String(data.image || ''),
    promos: Array.isArray(data.promos) ? JSON.parse(JSON.stringify(data.promos)) : [],
    category: String(data.category || ''),
  };
  if (typeof data.order === 'number' && Number.isFinite(data.order)) p.order = data.order;
  return p;
}

export interface SyncHandle {
  attach: (storeId: string) => void;
  detach: (storeId: string) => void;
  push: (storeId: string) => void;
  schedule: (storeId: string) => void;
}

export function createSync(
  getState: () => AppState,
  applyRemote: (storeId: string, remote: Record<string, unknown>) => void,
  removeStore: (storeId: string, msg: string) => void,
  onPushFailing?: (storeId: string) => void,
): SyncHandle {
  const subs = new Map<string, () => void>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const retryTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const failCount = new Map<string, number>();
  // Antes podian dispararse dos push() del mismo dispositivo casi al mismo
  // tiempo (uno por el reintento automatico, otro porque la persona siguio
  // editando) y pisarse entre si a medias. Ahora solo hay un push en vuelo
  // por tienda: si llega otro mientras el anterior sigue en curso, se marca
  // "hay que volver a intentar" y se encola para justo despues de que
  // termine el actual, en vez de salir al tiempo.
  const inFlight = new Set<string>();
  const pendingAgain = new Set<string>();
  // Tiendas cuyo documento principal ya se reviso en esta sesion en busca
  // de productos "viejos" (de antes de que existiera la subcoleccion) para
  // migrarlos una sola vez. Ver migrateLegacyProducts().
  const migratedLegacy = new Set<string>();
  // Ultimo contenido de cada producto que SI se confirmo guardado en la
  // nube (por tienda). Antes cada push mandaba el catalogo COMPLETO (con
  // cada imagen) sin importar que hubiera cambiado, asi que agregar una
  // venta o renombrar un producto se sentia cada vez mas lento segun
  // crecia el catalogo, y ademas aumentaba el riesgo de pasarse del limite
  // de tamano de un documento de Firestore. Ahora solo se reenvian los
  // productos que de verdad cambiaron desde el ultimo push exitoso.
  const lastPushedProducts = new Map<string, Map<string, string>>();
  // Tope maximo de espera: si el usuario sigue editando sin parar (cada
  // cambio reinicia el debounce corto de abajo), esto fuerza un push cada
  // ~1s de todas formas, para que la sincronizacion no se sienta lenta
  // durante una edicion larga.
  const maxTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const lastPush = new Map<string, string>();
  const cid = () => syncClientId();

  // Fingerprint canónico: ordena llaves y arrays (por id) para que dos
  // dispositivos con el MISMO contenido obtengan el mismo fingerprint aunque
  // difieran en el orden local. Evita re-pusheos infinitos tras cada merge.
  function canon(v: unknown): unknown {
    if (Array.isArray(v)) {
      const arr = v.map((x) => canon(x));
      if (arr.length && arr.every((x) => x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string')) {
        arr.sort((a, b) => String((a as { id: string }).id).localeCompare(String((b as { id: string }).id)));
      }
      return arr;
    }
    if (v && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      Object.keys(v as Record<string, unknown>).sort().forEach((k) => { out[k] = canon((v as Record<string, unknown>)[k]); });
      return out;
    }
    return v;
  }

  function fp(storeId: string): string {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s) return '';
    return JSON.stringify(canon({
      name: s.name, image: s.image, products: s.products, sales: s.sales,
      categories: s.categories || [], categoryPricing: s.categoryPricing || {},
      notes: s.notes || '', noteLog: s.noteLog || [],
      invLog: s.invLog || [], inventory: s.inventory || {},
    }));
  }

  async function push(storeId: string) {
    // Solo un push en vuelo por tienda (ver comentario junto a inFlight
    // arriba): si ya hay uno corriendo, se anota que hace falta otro justo
    // despues y se sale. fp() se vuelve a calcular cuando de verdad corra,
    // asi que recoge cualquier cambio que haya entrado mientras tanto.
    if (inFlight.has(storeId)) { pendingAgain.add(storeId); return; }
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !syncReady() || !DB) return;
    const t = retryTimers.get(storeId);
    if (t) { clearTimeout(t); retryTimers.delete(storeId); }
    const f = fp(storeId);
    if (lastPush.get(storeId) === f) return;

    inFlight.add(storeId);
    try {
      // Solo se incluyen los productos cuyo contenido cambio desde el
      // ultimo push que SI se confirmo guardado (ver comentario junto a
      // lastPushedProducts arriba). Si el dispositivo se acaba de conectar
      // (no hay historial todavia) se manda el catalogo completo una vez,
      // como antes, pero cada uno en su propio documento.
      const prevProd = lastPushedProducts.get(storeId) || new Map<string, string>();
      const nextProd = new Map<string, string>();
      const changedProducts: Product[] = [];
      s.products.forEach((p) => {
        const j = JSON.stringify(p);
        nextProd.set(p.id, j);
        if (prevProd.get(p.id) !== j) changedProducts.push(p);
      });

      const sales: Record<string, Sale> = {};
      s.sales.forEach((x) => (sales[x.id] = x));
      const payload: Record<string, unknown> = {
        sales,
        categories: s.categories || [],
        categoryPricing: s.categoryPricing || {},
        updatedBy: cid(),
      };
      if (typeof s.notes === 'string' && s.notes) payload.notes = s.notes;
      // OJO: setDoc(..., {merge:true}) NO interpreta claves con puntos como
      // field paths (eso solo aplica a updateDoc). Antes se escribia
      // payload['noteLog.'+id], lo que creaba un campo LITERAL llamado
      // "noteLog.<id>" en vez de fusionar dentro del mapa noteLog, y notas/
      // inventario nunca llegaban al campo real. Construimos objetos anidados
      // normales: setDoc con merge:true SI fusiona mapas anidados por clave,
      // sin pisar las entradas que subio otro dispositivo.
      const noteLogPatch: Record<string, unknown> = {};
      (s.noteLog || []).forEach((e) => { if (e && e.id) noteLogPatch[e.id] = e; });
      if (Object.keys(noteLogPatch).length) payload.noteLog = noteLogPatch;
      const invLogPatch: Record<string, unknown> = {};
      (s.invLog || []).forEach((e) => { if (e && e.id) invLogPatch[e.id] = e; });
      if (Object.keys(invLogPatch).length) payload.invLog = invLogPatch;
      payload.inventory = s.inventory || {};
      if (!s.createdBy || s.createdBy === cid()) { payload.name = s.name; payload.image = s.image; }

      // Un solo batch: el documento principal (chico, sin fotos) mas un
      // documento por cada producto que cambio. Como cada producto viaja
      // en su propio documento, el batch entero se queda muy por debajo
      // del limite de tamaño aunque el catalogo tenga muchos productos.
      const batch = writeBatch(DB);
      batch.set(storeDocRef(s.syncKey), payload, { merge: true });
      changedProducts.forEach((p) => {
        batch.set(doc(productsColRef(s.syncKey!), p.id), productDocPayload(p, cid()), { merge: true });
      });
      await batch.commit();
      // Antes se marcaba "ya lo mande" (lastPush) ANTES de saber si el
      // guardado en la nube funciono. Si ese intento fallaba (sin señal,
      // el documento crecio demasiado, lo que sea), quedaba registrado
      // como si SI se hubiera sincronizado y nunca se volvia a intentar
      // hasta que la persona hiciera otro cambio distinto: los cambios de
      // ese momento (un producto nuevo, un nombre editado) se quedaban
      // pegados en ese dispositivo para siempre sin avisar a nadie. Ahora
      // solo se marca como enviado cuando la nube de verdad lo confirma.
      lastPush.set(storeId, f);
      lastPushedProducts.set(storeId, nextProd);
      failCount.delete(storeId);
    } catch (e) {
      console.warn('Push fallido:', e);
      const n = (failCount.get(storeId) || 0) + 1;
      failCount.set(storeId, n);
      if (n === 3 && onPushFailing) onPushFailing(storeId);
      // Sin este reintento, un push fallido se queda esperando a que la
      // persona vuelva a tocar algo distinto en esa tienda para que
      // schedule() se vuelva a llamar: si nada mas cambia, esos datos
      // jamas llegarian a la nube.
      retryTimers.set(storeId, setTimeout(() => push(storeId), 4000));
    } finally {
      inFlight.delete(storeId);
      if (pendingAgain.delete(storeId)) push(storeId);
    }
  }

  function clearScheduled(storeId: string) {
    const t = timers.get(storeId);
    if (t) { clearTimeout(t); timers.delete(storeId); }
    const mt = maxTimers.get(storeId);
    if (mt) { clearTimeout(mt); maxTimers.delete(storeId); }
  }

  // Debounce corto (250ms) para no mandar un push por cada tecla, mas un
  // tope de ~1s que fuerza el push aunque el usuario siga escribiendo sin
  // parar: antes esperaba 600ms desde el ULTIMO cambio, asi que una edicion
  // continua podia posponer el push indefinidamente y sentirse lenta.
  function schedule(storeId: string) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !syncReady() || !DB) return;
    const t = timers.get(storeId);
    if (t) clearTimeout(t);
    timers.set(storeId, setTimeout(() => { clearScheduled(storeId); push(storeId); }, 250));
    if (!maxTimers.has(storeId)) {
      maxTimers.set(storeId, setTimeout(() => { clearScheduled(storeId); push(storeId); }, 1000));
    }
  }

  // Las tiendas creadas antes de que existiera la subcoleccion de
  // productos todavia tienen su catalogo embebido como mapa en el
  // documento principal (campo "products"). La primera vez que este
  // dispositivo ve ese documento en la sesion, copia esos productos a sus
  // propios documentos y borra el mapa viejo del documento principal para
  // liberar el espacio que estaba ocupando (y que podia estar bloqueando
  // hasta los guardados de ventas/notas/inventario, al viajar todos en el
  // mismo documento). Es seguro que dos dispositivos lo hagan a la vez: es
  // la misma info, y merge:true no pisa nada.
  function migrateLegacyProducts(storeId: string, d: Record<string, unknown>) {
    if (migratedLegacy.has(storeId) || !DB) return;
    migratedLegacy.add(storeId);
    const legacy = d.products;
    const hasLegacy = legacy && (Array.isArray(legacy) ? legacy.length : Object.keys(legacy as object).length);
    if (!hasLegacy) return;
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey) return;
    const arr = toProductsArr(legacy);
    const batch = writeBatch(DB);
    arr.forEach((p) => { batch.set(doc(productsColRef(s.syncKey!), p.id), productDocPayload(p, cid()), { merge: true }); });
    batch.set(storeDocRef(s.syncKey), { products: deleteField() }, { merge: true });
    batch.commit().catch((e) => console.warn('Migración de productos:', e));
  }

  function attach(storeId: string) {
    if (!syncReady() || !DB) return;
    const prev = subs.get(storeId);
    if (prev) { prev(); subs.delete(storeId); }
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey) return;
    const unMeta = onSnapshot(storeDocRef(s.syncKey), (snap) => {
      if (!snap || !snap.exists()) return;
      const d = snap.data();
      if (!d) return;
      if ((d.deleted as boolean)) {
        removeStore(storeId, 'Esta tienda fue borrada por otro dispositivo.');
        return;
      }
      if (d.updatedBy !== cid()) applyRemote(storeId, d);
      if (Array.isArray(d.noteLog) || Array.isArray(d.invLog)) repairDoc(storeId, d);
      migrateLegacyProducts(storeId, d);
    }, (e) => {
      // Cuando el listener de Firestore falla (un corte de red, el celular
      // se quedo sin señal un rato, etc.) el SDK NO lo reconecta solo: una
      // vez que este callback de error se dispara, ese "oido" queda muerto
      // para siempre hasta que alguien lo vuelva a suscribir. Antes eso
      // significaba quedarse sin tiempo real hasta recargar la pagina a
      // mano. Ahora se reintenta solo despues de un momento.
      console.warn('Suscripción:', e);
      // OJO: no se borra la entrada de subs aqui (el otro oido, el de
      // productos, puede seguir vivo). attach() ya se encarga de des-
      // suscribir ambos oidos como corresponde cuando le toque volver a
      // correr.
      setTimeout(() => attach(storeId), 3000);
    });
    // Segundo oido, sobre la subcoleccion de productos: cada producto que
    // se agrega, edita o llega por primera vez dispara un cambio aqui. Se
    // ignoran los cambios que hizo este mismo dispositivo (updatedBy) para
    // no re-aplicarse a si mismo lo que acaba de mandar.
    const unProducts = onSnapshot(productsColRef(s.syncKey), (snap) => {
      const changed: Record<string, Product> = {};
      let any = false;
      snap.docChanges().forEach((ch) => {
        if (ch.type === 'removed') return;
        const data = ch.doc.data() as Record<string, unknown>;
        if (!data || data.updatedBy === cid()) return;
        changed[ch.doc.id] = productFromDoc(ch.doc.id, data);
        any = true;
      });
      if (any) applyRemote(storeId, { products: changed });
    }, (e) => {
      console.warn('Suscripción (productos):', e);
      setTimeout(() => attach(storeId), 3000);
    });
    subs.set(storeId, () => { unMeta(); unProducts(); });
  }

  function detach(storeId: string) {
    const un = subs.get(storeId);
    if (un) { un(); subs.delete(storeId); }
    const rt = retryTimers.get(storeId);
    if (rt) { clearTimeout(rt); retryTimers.delete(storeId); }
    failCount.delete(storeId);
    lastPushedProducts.delete(storeId);
    migratedLegacy.delete(storeId);
  }

  // Firestore no deja fusionar paths de mapa (noteLog.<id>) cuando el campo es
  // un array. Las tiendas creadas antes de este cambio tienen arrays: los
  // convertimos a objeto keyed una sola vez para que los pushes no fallen.
  function repairDoc(storeId: string, d: Record<string, unknown>) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !syncReady() || !DB) return;
    const noteArr = d.noteLog;
    const invArr = d.invLog;
    const patch: Record<string, unknown> = {};
    if (Array.isArray(noteArr)) patch.noteLog = toNoteLogArr(noteArr).reduce((o, e) => { if (e && e.id) o[e.id] = e; return o; }, {} as Record<string, unknown>);
    if (Array.isArray(invArr)) patch.invLog = toInvLogArr(invArr).reduce((o, e) => { if (e && e.id) o[e.id] = e; return o; }, {} as Record<string, unknown>);
    if (Object.keys(patch).length) {
      setDoc(storeDocRef(s.syncKey), patch, { merge: true }).catch((e) => console.warn('Repair del doc:', e));
    }
  }

  return { attach, detach, push, schedule };
}

export function applyRemote(getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, storeId: string, remote: Record<string, unknown>) {
  if (!remote || remote.updatedBy === syncClientId()) return;
  const s = getState().stores.find((x) => x.id === storeId);
  if (!s) return;
  const members = remote.members ? JSON.parse(JSON.stringify(remote.members)) : null;
  const removed = s.localRole === 'worker' && remote.createdBy && remote.createdBy !== syncClientId() && (!remote.members || !(remote.members as Record<string, Member>)[syncClientId()]);
  if (removed) {
    mutate((d) => {
      d.stores = d.stores.filter((x) => x.id !== storeId);
      if (d.activeStoreId === storeId) { d.activeStoreId = d.stores.length ? d.stores[0].id : null; d.tab = 'inicio'; }
    });
    return;
  }
  mutate((d) => {
    const st = d.stores.find((x) => x.id === storeId);
    if (!st) return;
    if (members) st.members = members as Record<string, Member>;
    if (remote.createdBy && remote.createdBy !== st.createdBy) st.createdBy = remote.createdBy as string;

    const products = new Map(st.products.map((p) => [p.id, p]));
    toProductsArr(remote.products).forEach((p) => products.set(p.id, p));
    st.products = Array.from(products.values());

    const sales = new Map(st.sales.map((x) => [x.id, x]));
    toSalesArr(remote.sales).forEach((rs) => {
      const ls = sales.get(rs.id);
      if (ls) {
        sales.set(rs.id, Object.assign({}, ls, {
          items: mergeItems(ls.items, rs.items),
          closed: ls.closed || !!rs.closed,
          by: rs.by || ls.by,
        }));
      } else {
        sales.set(rs.id, JSON.parse(JSON.stringify(rs)));
      }
    });
    st.sales = Array.from(sales.values());

    // El orden de las categorias ahora importa (se puede arrastrar en el
    // Catalogo). Firestore SI conserva el orden de un arreglo, asi que se
    // adopta tal cual viene del remoto (quien empujo de ultimas gano el
    // orden); cualquier categoria que solo exista localmente (creada aqui y
    // aun no reflejada en ese snapshot remoto) se conserva al final para no
    // perderla.
    if (remote.categories && Array.isArray(remote.categories)) {
      const remoteCats = (remote.categories as string[]).map((c) => (c || '').trim()).filter(Boolean);
      const localOnly = (st.categories || []).filter((c) => !remoteCats.includes(c));
      st.categories = [...remoteCats, ...localOnly];
    }
    if (remote.categoryPricing && typeof remote.categoryPricing === 'object') {
      st.categoryPricing = Object.assign({}, st.categoryPricing || {}, JSON.parse(JSON.stringify(remote.categoryPricing)));
    }
    if (typeof remote.notes === 'string' && remote.notes.length) {
      st.notes = remote.notes;
    }
    st.noteLog = mergeNoteLog(st.noteLog, toNoteLogArr(remote.noteLog));
    st.invLog = mergeInvLog(st.invLog, toInvLogArr(remote.invLog));
    // El inventario viaja como mapa y se une por el mayor valor por producto
    // (nunca pierde existencias; igual con los contadores de venta).
    st.inventory = st.inventory || {};
    if (remote.inventory && typeof remote.inventory === 'object') {
      const ri = remote.inventory as Record<string, number>;
      Object.keys(ri).forEach((pid) => {
        const n = Math.round(Number(ri[pid]) || 0);
        st.inventory![pid] = st.inventory![pid] == null || n > st.inventory![pid] ? n : st.inventory![pid];
      });
    }
    const metaOk = !remote.createdBy || (remote.updatedBy && remote.updatedBy === remote.createdBy);
    if (metaOk && remote.name && remote.name !== st.name) st.name = remote.name as string;
    if (metaOk && remote.image && remote.image !== st.image) st.image = remote.image as string;
    normalizeStore(st);
  });
}

export async function joinStore(pin: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, attach: (id: string) => void) {
  if (!pin) { await customAlert('Escribe el código.'); return; }
  if (!syncReady()) { await customAlert('Configura Firebase primero'); return; }
  const key = syncKeyOf(pin);
  const existing = getState().stores.find((x) => x.syncKey === key);
  if (existing) {
    mutate((d) => { d.activeStoreId = existing.id; d.tab = 'inicio'; });
    attach(existing.id);
    await customAlert('Ya tienes esta tienda vinculada en este dispositivo.');
    return;
  }
  try {
    const ref = storeDocRef(key);
    const snap = await getDoc(ref);
    if (!snap.exists()) { await customAlert('No existe una tienda con ese código.'); return; }
    const r = snap.data();
    if (r.deleted) { await customAlert('Esa tienda fue eliminada. Pide un código nuevo.'); return; }
    const members: Record<string, Member> = {};
    members[syncClientId()] = { name: syncName(), role: 'worker', joinedAt: Date.now() };
    await setDoc(ref, { members }, { merge: true });
    // Los productos de la tienda pueden estar en dos sitios: el mapa viejo
    // embebido en el documento principal (tiendas de antes de que
    // existiera la subcoleccion, ver migrateLegacyProducts) y/o la
    // subcoleccion "products" (lo normal desde ahora). Se combinan los dos,
    // con la subcoleccion ganando si un producto esta en ambos lados.
    const productMap = new Map<string, Product>();
    toProductsArr(r.products).forEach((p) => productMap.set(p.id, p));
    try {
      const prodSnap = await getDocs(productsColRef(key));
      prodSnap.forEach((pd) => { productMap.set(pd.id, productFromDoc(pd.id, pd.data() as Record<string, unknown>)); });
    } catch (e) { console.warn('No se pudieron cargar los productos:', e); }
    const s: Store = {
      id: uid(),
      name: r.name || 'Tienda compartida',
      image: r.image || DEFAULT_STORE_IMAGE,
      products: Array.from(productMap.values()),
      sales: toSalesArr(r.sales),
      categories: JSON.parse(JSON.stringify((r.categories || []))),
      categoryPricing: r.categoryPricing && typeof r.categoryPricing === 'object' ? JSON.parse(JSON.stringify(r.categoryPricing)) : {},
      inventory: r.inventory && typeof r.inventory === 'object' ? { ...(r.inventory as Record<string, number>) } : {},
      notes: typeof r.notes === 'string' ? r.notes : '',
      noteLog: toNoteLogArr(r.noteLog),
      invLog: toInvLogArr(r.invLog),
      syncKey: key,
      syncPin: pin,
      createdBy: r.createdBy || null,
      members: Object.assign({}, JSON.parse(JSON.stringify((r.members || {}))), members),
      localRole: 'worker',
    };
    normalizeStore(s);
    mutate((d) => {
      d.stores.push(s);
      d.activeStoreId = s.id;
      d.tab = 'inicio';
    });
    attach(s.id);
    await customAlert('Tienda vinculada.');
  } catch (e) {
    console.warn(e);
    await customAlert('No se pudo conectar con la tienda.');
  }
}

export async function activateSync(storeId: string, pin: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, attach: (id: string) => void) {
  if (!syncReady()) { await customAlert('Configura Firebase primero'); return; }
  const key = syncKeyOf(pin);
  const ref = storeDocRef(key);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const s = getState().stores.find((x) => x.id === storeId);
      if (!s) return;
      const sales: Record<string, Sale> = {};
      s.sales.forEach((x) => (sales[x.id] = x));
      const members: Record<string, Member> = {};
      members[syncClientId()] = { name: syncName(), role: 'owner', joinedAt: Date.now() };
      const noteLog: Record<string, unknown> = {}, invLog: Record<string, unknown> = {};
      (s.noteLog || []).forEach((e) => { if (e && e.id) noteLog[e.id] = e; });
      (s.invLog || []).forEach((e) => { if (e && e.id) invLog[e.id] = e; });
      // Cada producto en su propio documento (ver comentario junto a
      // storeDocRef/productsColRef): asi la primera activacion de una
      // tienda con un catalogo grande no se topa de una con el limite de
      // tamaño de un documento de Firestore.
      const batch = writeBatch(DB!);
      batch.set(ref, {
        name: s.name, image: s.image, sales, categories: s.categories || [],
        categoryPricing: s.categoryPricing || {},
        notes: s.notes || '', noteLog, invLog, inventory: s.inventory || {},
        createdBy: syncClientId(), members, updatedBy: syncClientId(),
      }, { merge: true });
      s.products.forEach((p) => { batch.set(doc(productsColRef(key), p.id), productDocPayload(p, syncClientId()), { merge: true }); });
      await batch.commit();
      mutate((d) => { const st = d.stores.find((x) => x.id === storeId); if (st) { st.localRole = 'owner'; st.syncKey = key; st.syncPin = pin; } });
      // Conectar el listener YA, antes del aviso: si se espera a que el
      // usuario cierre el mensaje (el await de abajo no continua hasta que
      // toque "Aceptar"), este dispositivo se queda sordo a cambios remotos
      // (incluido un borrado desde otro dispositivo) mientras el aviso siga
      // en pantalla.
      attach(storeId);
      await customAlert('Sincronización activada. Comparte el código con tu equipo.');
    } else {
      const r = snap.data();
      if (r.deleted) { await customAlert('Esa tienda fue eliminada. Pide un código nuevo.'); return; }
      const isOwner = !r.createdBy || r.createdBy === syncClientId();
      const s = getState().stores.find((x) => x.id === storeId);
      if (!s) return;
      const prev = (r.members && (r.members[syncClientId()])) || (s.members && s.members[syncClientId()]) || {};
      const upd: Record<string, Member> = {};
      upd[syncClientId()] = { name: syncName(), role: isOwner ? 'owner' : 'worker', joinedAt: (prev as Member).joinedAt || Date.now() };
      await setDoc(ref, { members: upd }, { merge: true });
      if (isOwner && !r.createdBy) await setDoc(ref, { createdBy: syncClientId() }, { merge: true });
      mutate((d) => {
        const st = d.stores.find((x) => x.id === storeId);
        if (!st) return;
        st.members = Object.assign({}, JSON.parse(JSON.stringify(r.members || {})), upd);
        st.createdBy = r.createdBy || syncClientId();
        st.localRole = isOwner ? 'owner' : 'worker';
        st.syncKey = key;
        st.syncPin = pin;
      });
      attach(storeId);
      await customAlert(isOwner ? 'Tienda actualizada y sincronización confirmada.' : 'Vinculado a la tienda compartida.');
    }
  } catch (e) {
    console.warn(e);
    await customAlert('No se pudo sincronizar. Revisa tu conexión.');
  }
}

export async function removeMemberFn(storeId: string, memberId: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, toast: (m: string) => void) {
  const s = getState().stores.find((x) => x.id === storeId);
  // Nunca se puede quitar al dueño real (createdBy) del equipo: la tienda
  // siempre debe tener un dueño. Ni un admin ni el propio dueño pueden
  // hacerlo desde aqui (para borrar la tienda existe 'Borrar tienda').
  if (!s || !s.syncKey || !DB || memberId === syncClientId() || memberId === s.createdBy) return;
  const members = Object.assign({}, s.members || {});
  delete members[memberId];
  mutate((d) => { const st = d.stores.find((x) => x.id === storeId); if (st) st.members = members; });
  try {
    const del = deleteField();
    await setDoc(doc(collection(DB, 'stores'), s.syncKey), { members: { [memberId]: del } }, { merge: true });
    toast('Trabajador eliminado de la tienda.');
  } catch (e) { console.warn(e); toast('No se pudo eliminar al trabajador.'); }
}

// Solo el dueño real (createdBy) puede ascender/descender a un trabajador a
// administrador. Un admin puede ver el equipo y quitar trabajadores, pero no
// cambiar roles ni quitar a otro admin (eso evita que dos admins se
// enreden entre ellos).
export async function setMemberRoleFn(storeId: string, memberId: string, role: Role, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, toast: (m: string) => void) {
  const s = getState().stores.find((x) => x.id === storeId);
  // El rol del dueño real (createdBy) nunca cambia por aqui: siempre es
  // 'owner'. Y solo el dueño real puede ascender/descender a los demas.
  if (!s || !s.syncKey || !DB || memberId === syncClientId() || memberId === s.createdBy) return;
  if (s.createdBy !== syncClientId()) return;
  const cur = (s.members && s.members[memberId]) || { name: 'Trabajador', role: 'worker' as Role, joinedAt: Date.now() };
  const updated: Member = { ...cur, role };
  const members = Object.assign({}, s.members || {}, { [memberId]: updated });
  mutate((d) => { const st = d.stores.find((x) => x.id === storeId); if (st) st.members = members; });
  try {
    await setDoc(doc(collection(DB, 'stores'), s.syncKey), { members: { [memberId]: updated } }, { merge: true });
    toast(role === 'admin' ? 'Ahora es administrador.' : 'Ya no es administrador.');
  } catch (e) { console.warn(e); toast('No se pudo actualizar el permiso.'); }
}

export function deactivateSyncFn(id: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void) {
  const s = getState().stores.find((x) => x.id === id);
  if (!s) return;
  if (s.createdBy && s.createdBy !== syncClientId()) return;
  detach(id);
  mutate((d) => { const st = d.stores.find((x) => x.id === id); if (st) { delete st.syncKey; delete st.syncPin; } });
}

export function removeLocalStoreFn(storeId: string, _getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void) {
  detach(storeId);
  mutate((d) => {
    d.stores = d.stores.filter((x) => x.id !== storeId);
    if (d.activeStoreId === storeId) { d.activeStoreId = d.stores.length ? d.stores[0].id : null; d.tab = 'inicio'; }
  });
}

// Devuelve true si la tienda se elimino del dispositivo (para que quien
// llama, ej. StoreModal, sepa si debe cerrar su ventana o el usuario cancelo
// el dialogo de confirmacion).
export async function leaveStoreFn(id: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void): Promise<boolean> {
  const s = getState().stores.find((x) => x.id === id);
  if (!s || !s.syncKey) return false;
  const q = '¿Quieres salir de la tienda "' + s.name + '"? Se eliminará de este dispositivo y dejarás de recibir sus cambios. No se puede deshacer.';
  if (!(await customConfirm(q))) return false;
  if (DB) {
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), { members: { [syncClientId()]: deleteField() } }, { merge: true });
    } catch (e) { console.warn('No se pudo avisar del retiro:', e); }
  }
  removeLocalStoreFn(id, getState, mutate, detach);
  return true;
}

// Igual que leaveStoreFn: true si se borro, false si el usuario cancelo.
export async function deleteStoreFn(id: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void): Promise<boolean> {
  const s = getState().stores.find((x) => x.id === id);
  if (!s) return false;
  const shared = !!(s.syncKey && s.syncPin);
  const q = shared
    ? '¿Borrar la tienda "' + s.name + '"? Se borrará también en todos los dispositivos vinculados. No se puede deshacer.'
    : '¿Borrar la tienda "' + s.name + '"? Esta acción no se puede deshacer.';
  if (!(await customConfirm(q))) return false;
  if (DB && s.syncKey) {
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), { deleted: true }, { merge: true });
    } catch (e) { console.warn(e); }
  }
  removeLocalStoreFn(id, getState, mutate, detach);
  return true;
}
