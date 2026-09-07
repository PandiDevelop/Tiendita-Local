import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, onSnapshot, setDoc, getDoc, deleteField } from 'firebase/firestore';
import type { AppState, Member, Product, Sale, Store } from '../types';
import { toProductsArr, toSalesArr, toInvLogArr, toNoteLogArr, mergeItems, mergeInvLog, mergeNoteLog, syncKeyOf, syncClientId, syncName, normalizeStore, DEFAULT_STORE_IMAGE, uid } from './core';

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
    DB = getFirestore(app);
    return true;
  } catch (e) {
    console.warn('Firebase no disponible:', e);
    return false;
  }
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
): SyncHandle {
  const subs = new Map<string, () => void>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
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
      categories: s.categories || [], notes: s.notes || '', noteLog: s.noteLog || [],
      invLog: s.invLog || [], inventory: s.inventory || {},
    }));
  }

  async function push(storeId: string) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !syncReady() || !DB) return;
    const f = fp(storeId);
    if (lastPush.get(storeId) === f) return;
    lastPush.set(storeId, f);
    const products: Record<string, Product> = {}, sales: Record<string, Sale> = {};
    s.products.forEach((p) => (products[p.id] = p));
    s.sales.forEach((x) => (sales[x.id] = x));
    const payload: Record<string, unknown> = {
      products,
      sales,
      categories: s.categories || [],
      updatedBy: cid(),
    };
    if (typeof s.notes === 'string' && s.notes) payload.notes = s.notes;
    // Firestore con merge reemplaza arrays completos, así que subimos cada
    // entrada con path punteado (noteLog.<id>) para fusionar campo a campo y
    // nunca pisar lo que otro dispositivo agrego.
    (s.noteLog || []).forEach((e) => { if (e && e.id) payload['noteLog.' + e.id] = e; });
    (s.invLog || []).forEach((e) => { if (e && e.id) payload['invLog.' + e.id] = e; });
    payload.inventory = s.inventory || {};
    if (!s.createdBy || s.createdBy === cid()) { payload.name = s.name; payload.image = s.image; }
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), payload, { merge: true });
    } catch (e) { console.warn('Push fallido:', e); }
  }

  function schedule(storeId: string) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !syncReady() || !DB) return;
    const t = timers.get(storeId);
    if (t) clearTimeout(t);
    timers.set(storeId, setTimeout(() => { timers.delete(storeId); push(storeId); }, 600));
  }

  function attach(storeId: string) {
    if (!syncReady() || !DB) return;
    const prev = subs.get(storeId);
    if (prev) { prev(); subs.delete(storeId); }
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey) return;
    const un = onSnapshot(doc(collection(DB, 'stores'), s.syncKey), (snap) => {
      if (!snap || !snap.exists) return;
      const d = snap.data();
      if (!d) return;
      if ((d.deleted as boolean)) {
        removeStore(storeId, 'Esta tienda fue borrada por otro dispositivo.');
        return;
      }
      if (d.updatedBy !== cid()) applyRemote(storeId, d);
      if (Array.isArray(d.noteLog) || Array.isArray(d.invLog)) repairDoc(storeId, d);
    }, (e) => console.warn('Suscripción:', e));
    subs.set(storeId, un);
  }

  function detach(storeId: string) {
    const un = subs.get(storeId);
    if (un) { un(); subs.delete(storeId); }
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
      setDoc(doc(collection(DB, 'stores'), s.syncKey), patch, { merge: true }).catch((e) => console.warn('Repair del doc:', e));
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

    if (remote.categories) {
      const cur = st.categories || [];
      (remote.categories as string[]).forEach((c) => { const v = (c || '').trim(); if (v && !cur.includes(v)) cur.push(v); });
      st.categories = cur;
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

export async function joinStore(pin: string, mutate: (fn: (d: AppState) => void) => void, attach: (id: string) => void) {
  if (!pin) return alert('Escribe el código.');
  if (!syncReady()) return alert('Configura Firebase primero');
  const key = syncKeyOf(pin);
  try {
    const snap = await getDoc(doc(collection(DB!, 'stores'), key));
    if (!snap.exists()) return alert('No existe una tienda con ese código.');
    const r = snap.data();
    if (r.deleted) return alert('Esa tienda fue eliminada. Pide un código nuevo.');
    const members: Record<string, Member> = {};
    members[syncClientId()] = { name: syncName(), role: 'worker', joinedAt: Date.now() };
    await setDoc(doc(collection(DB!, 'stores'), key), { members }, { merge: true });
    const s: Store = {
      id: uid(),
      name: r.name || 'Tienda compartida',
      image: r.image || DEFAULT_STORE_IMAGE,
      products: toProductsArr(r.products),
      sales: toSalesArr(r.sales),
      categories: JSON.parse(JSON.stringify((r.categories || []))),
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
    alert('Tienda vinculada.');
  } catch (e) {
    console.warn(e);
    alert('No se pudo conectar con la tienda.');
  }
}

export async function activateSync(storeId: string, pin: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, attach: (id: string) => void) {
  if (!syncReady()) { alert('Configura Firebase primero'); return; }
  const key = syncKeyOf(pin);
  const ref = doc(collection(DB!, 'stores'), key);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const s = getState().stores.find((x) => x.id === storeId);
      if (!s) return;
      const products: Record<string, Product> = {}, sales: Record<string, Sale> = {};
      s.products.forEach((p) => (products[p.id] = p));
      s.sales.forEach((x) => (sales[x.id] = x));
      const members: Record<string, Member> = {};
      members[syncClientId()] = { name: syncName(), role: 'owner', joinedAt: Date.now() };
      const noteLog: Record<string, unknown> = {}, invLog: Record<string, unknown> = {};
      (s.noteLog || []).forEach((e) => { if (e && e.id) noteLog[e.id] = e; });
      (s.invLog || []).forEach((e) => { if (e && e.id) invLog[e.id] = e; });
      await setDoc(ref, {
        name: s.name, image: s.image, products, sales, categories: s.categories || [],
        notes: s.notes || '', noteLog, invLog, inventory: s.inventory || {},
        createdBy: syncClientId(), members, updatedBy: syncClientId(),
      }, { merge: true });
      mutate((d) => { const st = d.stores.find((x) => x.id === storeId); if (st) { st.localRole = 'owner'; st.syncKey = key; st.syncPin = pin; } });
      alert('Sincronización activada. Comparte el código con tu equipo.');
    } else {
      const r = snap.data();
      if (r.deleted) { alert('Esa tienda fue eliminada. Pide un código nuevo.'); return; }
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
      alert(isOwner ? 'Tienda actualizada y sincronización confirmada.' : 'Vinculado a la tienda compartida.');
    }
    attach(storeId);
  } catch (e) {
    console.warn(e);
    alert('No se pudo sincronizar. Revisa tu conexión.');
  }
}

export async function removeMemberFn(storeId: string, memberId: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, toast: (m: string) => void) {
  const s = getState().stores.find((x) => x.id === storeId);
  if (!s || !s.syncKey || !DB || memberId === syncClientId()) return;
  const members = Object.assign({}, s.members || {});
  delete members[memberId];
  mutate((d) => { const st = d.stores.find((x) => x.id === storeId); if (st) st.members = members; });
  try {
    const del = deleteField();
    await setDoc(doc(collection(DB, 'stores'), s.syncKey), { members: { [memberId]: del } }, { merge: true });
    toast('Trabajador eliminado de la tienda.');
  } catch (e) { console.warn(e); toast('No se pudo eliminar al trabajador.'); }
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

export async function leaveStoreFn(id: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void) {
  const s = getState().stores.find((x) => x.id === id);
  if (!s || !s.syncKey) return;
  const q = '¿Quieres salir de la tienda "' + s.name + '"? Se eliminará de este dispositivo y dejarás de recibir sus cambios. No se puede deshacer.';
  if (!confirm(q)) return;
  if (DB) {
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), { members: { [syncClientId()]: deleteField() } }, { merge: true });
    } catch (e) { console.warn('No se pudo avisar del retiro:', e); }
  }
  removeLocalStoreFn(id, getState, mutate, detach);
}

export async function deleteStoreFn(id: string, getState: () => AppState, mutate: (fn: (d: AppState) => void) => void, detach: (storeId: string) => void) {
  const s = getState().stores.find((x) => x.id === id);
  if (!s) return;
  const shared = !!(s.syncKey && s.syncPin);
  const q = shared
    ? '¿Borrar la tienda "' + s.name + '"? Se borrará también en todos los dispositivos vinculados. No se puede deshacer.'
    : '¿Borrar la tienda "' + s.name + '"? Esta acción no se puede deshacer.';
  if (!confirm(q)) return;
  if (DB && s.syncKey) {
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), { deleted: true }, { merge: true });
    } catch (e) { console.warn(e); }
  }
  removeLocalStoreFn(id, getState, mutate, detach);
}
