import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, doc, onSnapshot, setDoc, getDoc, deleteField } from 'firebase/firestore';
import type { AppState, Member, Product, Sale, Store } from '../types';
import { toProductsArr, toSalesArr, toInvLogArr, mergeItems, mergeInvLog, syncKeyOf, syncClientId, syncName, normalizeStore, DEFAULT_STORE_IMAGE, uid } from './core';

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

  function fp(storeId: string): string {
    const s = getState().stores.find((x) => x.id === storeId);
    return s ? JSON.stringify([s.name, s.image, s.products, s.sales, s.categories, s.notes, s.invLog]) : '';
  }

  async function push(storeId: string) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !DB) return;
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
    if (s.invLog && s.invLog.length) payload.invLog = s.invLog;
    if (!s.createdBy || s.createdBy === cid()) { payload.name = s.name; payload.image = s.image; }
    try {
      await setDoc(doc(collection(DB, 'stores'), s.syncKey), payload, { merge: true });
    } catch (e) { console.warn('Push fallido:', e); }
  }

  function schedule(storeId: string) {
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !DB) return;
    const t = timers.get(storeId);
    if (t) clearTimeout(t);
    timers.set(storeId, setTimeout(() => { timers.delete(storeId); push(storeId); }, 600));
  }

  function attach(storeId: string) {
    if (!DB) return;
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
    }, (e) => console.warn('Suscripción:', e));
    subs.set(storeId, un);
  }

  function detach(storeId: string) {
    const un = subs.get(storeId);
    if (un) { un(); subs.delete(storeId); }
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
    st.invLog = mergeInvLog(st.invLog, toInvLogArr(remote.invLog));
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
      inventory: {},
      notes: typeof r.notes === 'string' ? r.notes : '',
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
      await setDoc(ref, {
        name: s.name, image: s.image, products, sales, categories: s.categories || [],
        notes: s.notes || '', invLog: s.invLog || [],
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
