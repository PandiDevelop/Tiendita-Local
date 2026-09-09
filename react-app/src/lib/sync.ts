import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeFirestore, Firestore, collection, doc, query, onSnapshot, setDoc, getDoc, getDocs, deleteDoc, deleteField } from 'firebase/firestore';
import type { AppState, Member, NotifCat, Product, Role, Sale, Store } from '../types';
import { toProductsArr, toSalesArr, toInvLogArr, toNoteLogArr, toNoteBoardArr, mergeItems, mergeInvLog, mergeNoteLog, syncKeyOf, syncClientId, syncName, normalizeStore, DEFAULT_STORE_IMAGE, uid, isNoteDeleted, markNoteDeleted, deletedNoteIdsOf, clearDeletedNotes } from './core';
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

// Ids de notas del tablero (ver Note en types.ts) que este cliente YA vio
// alguna vez, sea porque las mando el (push) o porque llegaron en un
// snapshot remoto. Sirve para dos cosas: (a) al mandar un push, saber que
// notas se borraron localmente desde la ultima vez para avisarle a
// Firestore con deleteField (si no, nunca se borrarian del lado de nadie
// mas); (b) al recibir un snapshot, distinguir una nota local nueva que
// AUN no se ha subido (no esta en remoto ni en este set: se conserva) de
// una que alguien mas borro en otro dispositivo (estaba en este set, ya no
// esta en remoto: se quita tambien aqui).
// OJO (bug arreglado): esto vivia solo en memoria. Si el dispositivo se
// recargaba (o volvia de segundo plano y el listener se re-suscribia desde
// cero) DESPUES de que otro dispositivo borrara una nota, el primer
// snapshot que llegaba ya no traia esa nota, pero como el set "visto" tambien
// habia quedado vacio por la recarga, el codigo no podia distinguir esa
// nota borrada de una nota local nueva que aun no se hubiera subido: la
// trataba como "nueva" y la conservaba para siempre, asi que nunca se
// borraba en ese dispositivo. Ahora se guarda tambien en localStorage (por
// tienda) para que sobreviva a una recarga.
const seenNoteIds = new Map<string, Set<string>>();
const SEEN_NOTES_KEY = 'mt_seen_notes_';

function loadSeenNoteIds(storeId: string): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_NOTES_KEY + storeId);
    const arr = raw ? JSON.parse(raw) : null;
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function getSeenNoteIds(storeId: string): Set<string> {
  let cur = seenNoteIds.get(storeId);
  if (!cur) { cur = loadSeenNoteIds(storeId); seenNoteIds.set(storeId, cur); }
  return cur;
}

function setSeenNoteIds(storeId: string, ids: Set<string>): void {
  seenNoteIds.set(storeId, ids);
  try { localStorage.setItem(SEEN_NOTES_KEY + storeId, JSON.stringify(Array.from(ids))); } catch { /* cuota llena: no es critico, solo se pierde la persistencia */ }
}

function clearSeenNoteIds(storeId: string): void {
  seenNoteIds.delete(storeId);
  try { localStorage.removeItem(SEEN_NOTES_KEY + storeId); } catch { /* ignorar */ }
}

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

// Le da a lib/push.ts (aviso push real, ver ese archivo) la MISMA instancia
// de Firebase que ya usa Firestore, en vez de que cada uno inicialice la
// suya. Llama syncReady() primero para asegurarse de que ya exista.
export function firebaseApp(): FirebaseApp | null {
  syncReady();
  return app;
}

// Guarda (o reemplaza) el token de FCM de ESTE dispositivo para la tienda
// dada, en el documento principal de Firestore (mapa por syncClientId,
// igual que "members": si el dispositivo ya tenia un token guardado antes,
// este simplemente lo pisa en vez de duplicar). El Worker de Cloudflare
// (ver push-worker/ en la raiz del repo) lee este mapa para saber a quien
// avisar cuando alguien publica una nota. No hace falta borrar el token
// nunca a mano: si deja de ser valido, FCM lo dice al mandar y ahi se
// podria limpiar (el Worker ya lo contempla).
export async function savePushToken(storeKey: string, token: string): Promise<void> {
  if (!syncReady() || !DB) return;
  await setDoc(storeDocRef(storeKey), {
    pushTokens: { [syncClientId()]: { token, updatedAt: Date.now(), name: syncName() } },
  }, { merge: true });
}

// Quita el token de FCM de ESTE dispositivo del documento de la tienda. Se
// usa cuando la persona apaga "Notificaciones" en Opciones: con el token
// fuera, el Worker de Cloudflare (ver push-worker/) deja de rutearle avisos
// a este dispositivo, y ademas el token se borra de la instalacion local de
// Firebase. Es best-effort: si la red falla a mitad, el peor caso es que un
// push viejo llegue una vez mas.
export async function removePushToken(storeKey: string): Promise<void> {
  if (!syncReady() || !DB || !storeKey) return;
  await setDoc(storeDocRef(storeKey), {
    pushTokens: { [syncClientId()]: deleteField() },
    pushPrefs: { [syncClientId()]: deleteField() },
  }, { merge: true });
}

// Guarda en el documento de la tienda que TIPOS de aviso quiere este
// dispositivo (mapa por syncClientId, igual que pushTokens/members). El
// Worker de Cloudflare (push-worker/) lo lee antes de mandarle un aviso FCM:
// apagar una categoria en Opciones hace que el Worker le saltee ese aviso,
// de modo que el silencio aplica incluso con la app cerrada - no solo al
// sonido local de adentro. Best-effort: si la red falla, el peor caso es que
// un aviso de una categoria apagada llegue una vez de mas.
export async function setPushPrefs(storeKey: string, prefs: Partial<Record<NotifCat, boolean>>): Promise<void> {
  if (!syncReady() || !DB || !storeKey) return;
  await setDoc(storeDocRef(storeKey), {
    pushPrefs: { [syncClientId()]: prefs },
  }, { merge: true });
}

// OJO (historia importante): hubo una version de esto con cada producto en
// su propio documento (subcoleccion "products" de la tienda), pensada para
// que el limite de ~1MB de un documento de Firestore no dependiera de
// cuantos productos tuviera el catalogo. Se revirtio: las reglas de
// seguridad de Firestore de este proyecto (configuradas aparte, en la
// consola de Firebase, no en este repo) solo daban permiso sobre el
// documento "stores/{codigo}", no sobre esa subcoleccion nueva, y nadie
// del equipo tenia acceso a la consola para agregar el permiso que hacia
// falta. Ese acceso YA existe, asi que volvemos al modelo de subcoleccion:
// cada producto vive en su propio documento bajo "stores/{codigo}/products",
// de modo que el limite de ~1 MiB de Firestore aplica por producto (no por
// catalogo) y un catalogo con muchas fotos ya no bloquea la sincronizacion.
// IMPORTANTE: recordar actualizar las reglas en la consola de Firebase
// (match /stores/{storeKey}/products/{productId}) - ver el README.
function storeDocRef(key: string) {
  return doc(collection(DB!, 'stores'), key);
}
// Coleccion de productos de una tienda: un documento por producto.
function productsColRef(key: string) {
  return collection(storeDocRef(key), 'products');
}
function productDocRef(key: string, productId: string) {
  return doc(productsColRef(key), productId);
}
// Un documento de Firestore no puede pasar de ~1 MiB. Como los productos ya
// no viven en el documento principal, el catalogo ya no esta limitado por
// ese tope; el tamaño del documento principal ahora es casi constante.
// IMPORTANTE: si alguien agrega mas adelante datos pesados al propio
// documento principal, recordar que el limite de Firestore es ~1 MiB.

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
  onPushFailing?: (storeId: string, code?: string) => void,
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
  // "Primed": ya llego al menos un snapshot real del documento principal Y
  // de la subcoleccion de productos de esta tienda desde la ultima vez que
  // se (re)conecto el listener (attach). Bug real que esto arregla: push()
  // se disparaba apenas arrancaba la app (o volvia de segundo plano),
  // usando el estado guardado en localStorage tal cual estaba antes de
  // cerrarla. Si mientras tanto OTRO dispositivo habia borrado una nota o
  // un producto, ese primer push - que salia ANTES de que llegara el
  // primer snapshot remoto que ya reflejaba ese borrado - volvia a subir
  // la version vieja (todavia con la nota/producto adentro) y la
  // "resucitaba" para todo el mundo. Ahora push() espera a que la tienda
  // quede "primed" antes de mandar nada: asi el estado local ya se
  // reconcilio con lo que de verdad hay en la nube (borrados incluidos)
  // antes de reenviar. pendingAgain (ver arriba) hace que, si un push
  // queria salir mientras tanto, se reintente solo apenas quede primed.
  const primedMain = new Set<string>();
  const primedProducts = new Set<string>();
  function isPrimed(storeId: string): boolean {
    return primedMain.has(storeId) && primedProducts.has(storeId);
  }
  function markPrimed(which: 'main' | 'products', storeId: string) {
    const set = which === 'main' ? primedMain : primedProducts;
    if (set.has(storeId)) return;
    set.add(storeId);
    if (isPrimed(storeId) && pendingAgain.delete(storeId)) push(storeId);
  }
  // Ultimo contenido de cada producto que SI se confirmo guardado en la
  // nube (por tienda). Cada producto vive en su propio documento de la
  // subcoleccion, pero igual solo se reescribe el que de verdad cambio desde
  // el ultimo push exitoso, para no gastar lecturas/escrituras de mas y para
  // no pisar con un JSON mas grande una edicion que otro dispositivo haya
  // hecho mientras tanto.
  const lastPushedProducts = new Map<string, Map<string, string>>();
  // Mismo truco de diffing que lastPushedProducts, pero para las notas del
  // tablero: antes CADA push mandaba TODAS las notas (con sus respuestas e
  // historial de ediciones completos) sin importar si de verdad cambiaron,
  // porque solo hacia falta tocar UNA nota (marcar un objetivo, responder un
  // hilo) para que se reescribiera el tablero entero. Con una tienda que ya
  // lleva varias notas/hilos eso vuelve cada push mas pesado de lo
  // necesario, y por eso los cambios se sentian lentos en llegar a los
  // demas dispositivos. Ahora solo se manda la nota que de verdad cambio
  // desde el ultimo push que SI se confirmo guardado.
  const lastPushedNotes = new Map<string, Map<string, string>>();
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
      noteBoard: s.noteBoard || [],
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
    if (!isPrimed(storeId)) {
      // Todavia no llego el primer snapshot remoto de esta tienda (ver el
      // comentario junto a primedMain/primedProducts arriba): no reenviar
      // el estado local todavia, podria estar desactualizado justo
      // despues de recargar la app o reconectar. markPrimed() reintenta
      // esto solo apenas la tienda quede "primed".
      pendingAgain.add(storeId);
      return;
    }
    const t = retryTimers.get(storeId);
    if (t) { clearTimeout(t); retryTimers.delete(storeId); }
    const f = fp(storeId);
    if (lastPush.get(storeId) === f) return;

    inFlight.add(storeId);
    try {
      // Los productos ahora viven cada uno en su propio documento de la
      // subcoleccion "products" (ver la nota junto a productDocRef), asi
      // que el catalogo completo ya no esta atado al limite de ~1 MiB del
      // documento principal. Aqui solo se reenvian los productos que de
      // verdad cambiaron desde el ultimo push que SI se confirmo guardado
      // (ver lastPushedProducts arriba), y se borran en la nube los que se
      // eliminaron localmente.
      const prevProd = lastPushedProducts.get(storeId) || new Map<string, string>();
      const nextProd = new Map<string, string>();
      const seenNow = new Set<string>();
      for (const p of s.products) {
        const j = JSON.stringify(p);
        nextProd.set(p.id, j);
        seenNow.add(p.id);
        if (prevProd.get(p.id) !== j) {
          // setDoc con merge escribe/actualiza el documento del producto.
          // El push falla de a un producto a la vez: si un catalogo tiene un
          // solo producto enorme que Firestore rechaza, solo ese falla y el
          // aviso le dice al usuario cual es, mientras el resto se guarda.
          await setDoc(productDocRef(s.syncKey!, p.id), JSON.parse(JSON.stringify(p)), { merge: true });
        }
      }
      // Productos que existian en la nube (estaban en prevProd) y ya no
      // estan en el catalogo local: se borran de la subcoleccion.
      for (const pid of prevProd.keys()) {
        if (!seenNow.has(pid)) await deleteDoc(productDocRef(s.syncKey!, pid));
      }

      const sales: Record<string, Sale> = {};
      s.sales.forEach((x) => (sales[x.id] = x));
      const main: Record<string, unknown> = {
        sales,
        categories: s.categories || [],
        categoryPricing: s.categoryPricing || {},
        events: s.events || [],
        updatedBy: cid(),
      };
      if (typeof s.notes === 'string' && s.notes) main.notes = s.notes;
      // OJO: setDoc(..., {merge:true}) NO interpreta claves con puntos como
      // field paths (eso solo aplica a updateDoc). Probado a mano contra la
      // base de datos real: mandar objetos anidados normales (como aqui)
      // con merge:true SI fusiona el mapa por clave de forma recursiva, sin
      // pisar las entradas que subio otro dispositivo.
      const noteLogPatch: Record<string, unknown> = {};
      (s.noteLog || []).forEach((e) => { if (e && e.id) noteLogPatch[e.id] = e; });
      if (Object.keys(noteLogPatch).length) main.noteLog = noteLogPatch;
      const invLogPatch: Record<string, unknown> = {};
      (s.invLog || []).forEach((e) => { if (e && e.id) invLogPatch[e.id] = e; });
      if (Object.keys(invLogPatch).length) main.invLog = invLogPatch;
      // Tablero de notas: igual que noteLog/invLog, mapa por id para que el
      // merge:true de Firestore fusione por clave sin pisar las notas de
      // otro dispositivo. A diferencia de esos dos (que nunca se borran),
      // aca SI hace falta avisar los borrados: cualquier id que este
      // cliente haya visto antes (seenNoteIds, persistido - ver arriba) y ya
      // no este en el tablero local se manda con deleteField() para que
      // tambien desaparezca en Firestore y, de ahi, en el resto de
      // dispositivos. Y al igual que con los productos (lastPushedProducts),
      // solo se incluye en el patch la nota que de verdad cambio desde el
      // ultimo push confirmado, no el tablero completo (ver el comentario
      // junto a lastPushedNotes).
      const prevSeenNotes = getSeenNoteIds(storeId);
      const prevNotes = lastPushedNotes.get(storeId) || new Map<string, string>();
      const nextNotes = new Map<string, string>();
      const noteBoardPatch: Record<string, unknown> = {};
      const currentNoteIds = new Set<string>();
      (s.noteBoard || []).forEach((n) => {
        if (!n || !n.id) return;
        currentNoteIds.add(n.id);
        const j = JSON.stringify(n);
        nextNotes.set(n.id, j);
        if (prevNotes.get(n.id) !== j) noteBoardPatch[n.id] = n;
      });
      prevSeenNotes.forEach((id) => { if (!currentNoteIds.has(id)) noteBoardPatch[id] = deleteField(); });
      // Refuerzo del borrado por el registro local (ver markNoteDeleted en
      // core.ts): la nota la borro (o dejo expirar) este dispositivo, aunque
      // prevSeenNotes ya no la mencione (un push exitoso anterior reemplazo
      // ese set). Se reenvia deleteField para que siga borrada en la nube y
      // no la resucite otro dispositivo con un tablero viejito.
      deletedNoteIdsOf(s).forEach((id) => { if (!currentNoteIds.has(id)) noteBoardPatch[id] = deleteField(); });
      if (Object.keys(noteBoardPatch).length) main.noteBoard = noteBoardPatch;
      main.inventory = s.inventory || {};
      if (!s.createdBy || s.createdBy === cid()) { main.name = s.name; main.image = s.image; }

      await setDoc(storeDocRef(s.syncKey), main, { merge: true });
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
      lastPushedNotes.set(storeId, nextNotes);
      setSeenNoteIds(storeId, currentNoteIds);
      failCount.delete(storeId);
    } catch (e) {
      console.warn('Push fallido:', e);
      const n = (failCount.get(storeId) || 0) + 1;
      failCount.set(storeId, n);
      // 'permission-denied' significa que las reglas de seguridad de
      // Firestore no dejan escribir ahi (no es un problema de red del
      // dispositivo). Un rechazo por tamaño de un producto individual llega
      // como 'invalid-argument' con "size"/"byte"/"maximum" en el mensaje.
      // Cualquiera de los dos se avisa especificamente en vez del generico
      // "revisa tu conexión", para no perder tiempo de diagnostico.
      const code = e && typeof e === 'object' && 'code' in e ? String((e as { code?: unknown }).code) : undefined;
      if (n === 3 && onPushFailing) onPushFailing(storeId, code);
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

  function attach(storeId: string) {
    if (!syncReady() || !DB) return;
    const prev = subs.get(storeId);
    if (prev) { prev(); subs.delete(storeId); }
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey) return;
    primedMain.delete(storeId);
    primedProducts.delete(storeId);
    const unsubs: (() => void)[] = [];
    // Listener del documento principal: la meta de la tienda (nombre, foto,
    // ventas, categorias, notas, inventario, miembros, ...). Los productos
    // ya NO llegan por aqui (viven en la subcoleccion de abajo).
    const unMain = onSnapshot(storeDocRef(s.syncKey), (snap) => {
      markPrimed('main', storeId);
      if (!snap || !snap.exists()) return;
      const d = snap.data();
      if (!d) return;
      if ((d.deleted as boolean)) {
        removeStore(storeId, 'Esta tienda fue borrada por otro dispositivo.');
        return;
      }
      if (d.updatedBy !== cid()) applyRemote(storeId, d);
      if (Array.isArray(d.noteLog) || Array.isArray(d.invLog)) repairDoc(storeId, d);
      // Tiendas creadas con el modelo viejo llevan los productos embebidos en
      // el documento principal: se migran una sola vez a la subcoleccion.
      if (d.products) migrateLegacyProducts(storeId, d.products);
    }, (e) => {
      // Cuando el listener de Firestore falla (un corte de red, el celular
      // se quedo sin señal un rato, etc.) el SDK NO lo reconecta solo: una
      // vez que este callback de error se dispara, ese "oido" queda muerto
      // para siempre hasta que alguien lo vuelva a suscribir. Antes eso
      // significaba quedarse sin tiempo real hasta recargar la pagina a
      // mano. Ahora se reintenta solo despues de un momento.
      console.warn('Suscripción doc:', e);
      setTimeout(() => attach(storeId), 3000);
    });
    unsubs.push(unMain);
    // Listener de la subcoleccion de productos: cada producto es un documento
    // propio (ver la nota junto a productDocRef). Se aplica el catalogo que
    // llega desde la nube, fusionandolo por id en el estado local.
    const unProducts = onSnapshot(query(productsColRef(s.syncKey)), (snap) => {
      markPrimed('products', storeId);
      const remoteProducts: Record<string, unknown> = {};
      snap.forEach((pd) => { remoteProducts[pd.id] = pd.data(); });
      // El snapshot de productos no trae updatedBy, asi que applyRemote lo
      // aplica siempre. El merge es por id y no duplica: aplicar el mismo
      // catalogo dos veces da el mismo resultado (idempotente).
      applyRemote(storeId, { products: remoteProducts });
    }, (e) => {
      console.warn('Suscripción productos:', e);
      setTimeout(() => attach(storeId), 3000);
    });
    unsubs.push(unProducts);
    subs.set(storeId, () => { unsubs.forEach((u) => u()); });
  }

  // Una sola vez por tienda: copia los productos que estan embebidos en el
  // documento principal (modelo viejo) a su propio documento en la
  // subcoleccion y los borra del documento principal. Idempotente: si ya no
  // hay la clave "products" en el documento, no hace nada.
  function migrateLegacyProducts(storeId: string, legacy: unknown) {
    if (!legacy || typeof legacy !== 'object') return;
    const s = getState().stores.find((x) => x.id === storeId);
    if (!s || !s.syncKey || !DB) return;
    const products = Array.isArray(legacy)
      ? legacy as unknown[]
      : Object.values(legacy as Record<string, unknown>);
    if (!products.length) return;
    (async () => {
      const writes: Promise<unknown>[] = [];
      for (const p of products) {
        const prod = p as { id?: unknown } & Record<string, unknown>;
        if (!prod || !prod.id) continue;
        writes.push(setDoc(productDocRef(s.syncKey!, String(prod.id)), JSON.parse(JSON.stringify(p)), { merge: true }));
      }
      // Se quita "products" del documento principal para no duplicar datos:
      // con deleteField la clave se elimina del documento remoto.
      if (writes.length) {
        writes.push(setDoc(storeDocRef(s.syncKey!), { products: deleteField(), updatedBy: cid() }, { merge: true }));
      }
      await Promise.all(writes);
    })().catch((e) => console.warn('Migración de productos fallida:', e));
  }

  function detach(storeId: string) {
    const un = subs.get(storeId);
    if (un) { un(); subs.delete(storeId); }
    const rt = retryTimers.get(storeId);
    if (rt) { clearTimeout(rt); retryTimers.delete(storeId); }
    failCount.delete(storeId);
    lastPushedProducts.delete(storeId);
    lastPushedNotes.delete(storeId);
    primedMain.delete(storeId);
    primedProducts.delete(storeId);
    pendingAgain.delete(storeId);
    // Se borra tambien lo persistido en localStorage: detach() solo se
    // llama cuando la tienda de verdad se quita de este dispositivo (o se
    // desactiva la sincronizacion), no en cada re-suscripcion normal - ver
    // el comentario junto a getSeenNoteIds/setSeenNoteIds.
    clearSeenNoteIds(storeId);
    const s = getState().stores.find((x) => x.id === storeId);
    if (s) clearDeletedNotes(s);
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
    if (Array.isArray(remote.events)) {
      st.events = JSON.parse(JSON.stringify(remote.events)) as Store['events'];
    }

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
    // Tablero de notas: a diferencia de mergeNoteLog (union pura, nunca
    // borra), aca se reconcilia con lo que este cliente ya vio antes
    // (seenNoteIds) para que una nota borrada en otro dispositivo tambien
    // desaparezca aqui en vez de quedar pegada para siempre - ver el
    // comentario junto a seenNoteIds arriba.
    // OJO (bug arreglado): la condicion antes era "remoteNoteBoard ||
    // prevSeenNotes.size". Un snapshot de la subcoleccion de PRODUCTOS
    // (que llega sin noteBoard ni updatedBy) hacia que esta reconciliacion
    // corriera con remoto vacio y BORRARA del tablero local todas las notas
    // ya vistas (hasta que el siguiente snapshot principal las restauraba):
    // por eso las notas aparecian/desaparecian a cada rato y el orden se
    // barajaba. Ahora solo se reconcilia cuando el snapshot de verdad trae
    // el tablero; los snapshots de productos dejan las notas intactas.
    {
      const remoteNoteBoard = remote.noteBoard && typeof remote.noteBoard === 'object' ? remote.noteBoard as Record<string, unknown> : null;
      if (remoteNoteBoard) {
        const prevSeenNotes = getSeenNoteIds(storeId);
        const remoteNoteIds = new Set(Object.keys(remoteNoteBoard));
        // Notas que este cliente ya habia visto y el remoto ya no trae fueron
        // borradas o expiraron en otro dispositivo: marcarlas como borradas
        // evita que la migracion de noteLog las devuelva si el tablero llega
        // a quedar vacio (ver deletedNoteIdsOf en core.ts).
        (st.noteBoard || []).forEach((n) => {
          if (prevSeenNotes.has(n.id) && !remoteNoteIds.has(n.id)) markNoteDeleted(st, n.id);
        });
        const kept = (st.noteBoard || []).filter((n) => remoteNoteIds.has(n.id) || !prevSeenNotes.has(n.id));
        const map = new Map(kept.map((n) => [n.id, n]));
        // Una nota que este dispositivo borro (o dejo expirar) NO vuelve,
        // aunque un snapshot viejito todavia la traiga en la nube (push de
        // borrado que por algun motivo no llego a aplicarse, tablero stale de
        // otro dispositivo, etc.): el borrado local gana, siempre.
        toNoteBoardArr(remoteNoteBoard).forEach((n) => {
          if (isNoteDeleted(st, n.id)) return;
          map.set(n.id, n);
        });
        st.noteBoard = Array.from(map.values());
        const nextSeen = new Set(prevSeenNotes);
        remoteNoteIds.forEach((id) => nextSeen.add(id));
        setSeenNoteIds(storeId, nextSeen);
      }
    }
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

// Lee todos los productos de la subcoleccion de una tienda (un documento por
// producto). El modelo nuevo guarda cada producto en su propio documento para
// que el limite de ~1 MiB de Firestore no limite el tamaño del catalogo.
async function loadProducts(key: string): Promise<Product[]> {
  if (!DB) return [];
  const q = query(productsColRef(key));
  const snap = await getDocs(q);
  const out: Product[] = [];
  snap.forEach((pd) => { const d = pd.data(); if (d) out.push(d as Product); });
  return out;
}

// True si ya hay un empleado distinto (otro dispositivo/registro) con el mismo
// nombre configurado en este dispositivo. El nombre se compara sin mayusculas
// y sin espacios de mas para que "Ana " y "ana" se consideren duplicados.
function clashName(members: Record<string, Member>): boolean {
  const n = syncName().trim().toLowerCase();
  if (!n) return false;
  return Object.keys(members).some(
    (k) => k !== syncClientId() && (members[k] && (members[k].name || '').trim().toLowerCase()) === n,
  );
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
    const remote: Record<string, Member> = (r.members || {}) as Record<string, Member>;
    // Cada empleado se registra con un UUID unico (eid) generado aqui. El
    // nombre tampoco puede repetirse entre empleados de la tienda: antes de
    // unirse se valida contra los miembros remotos, y al sincronizar (ver
    // joinStore/activateSync y validateMemberName) se vuelve a comprobar.
    if (clashName(remote)) {
      await customAlert('Ya hay un empleado con ese nombre en la tienda. Cambia tu nombre y vuelve a intentarlo.');
      return;
    }
    const members: Record<string, Member> = {};
    members[syncClientId()] = { name: syncName(), role: 'worker', joinedAt: Date.now(), eid: (remote[syncClientId()] && remote[syncClientId()].eid) || uid() };
    await setDoc(ref, { members }, { merge: true });
    // Productos: se combinan los que aun puedan vivir embebidos en el
    // documento principal (modelo viejo) con los de la subcoleccion (modelo
    // nuevo), ganando la subcoleccion en caso de conflicto.
    const legacyProducts = toProductsArr(r.products);
    const subProducts = await loadProducts(key);
    const mergedProducts = new Map<string, Product>();
    legacyProducts.forEach((p) => mergedProducts.set(p.id, p));
    subProducts.forEach((p) => mergedProducts.set(p.id, p));
    const s: Store = {
      id: uid(),
      name: r.name || 'Tienda compartida',
      image: r.image || DEFAULT_STORE_IMAGE,
      products: Array.from(mergedProducts.values()),
      sales: toSalesArr(r.sales),
      categories: JSON.parse(JSON.stringify((r.categories || []))),
      categoryPricing: r.categoryPricing && typeof r.categoryPricing === 'object' ? JSON.parse(JSON.stringify(r.categoryPricing)) : {},
      events: Array.isArray(r.events) ? JSON.parse(JSON.stringify(r.events)) : [],
      inventory: r.inventory && typeof r.inventory === 'object' ? { ...(r.inventory as Record<string, number>) } : {},
      notes: typeof r.notes === 'string' ? r.notes : '',
      noteLog: toNoteLogArr(r.noteLog),
      noteBoard: toNoteBoardArr(r.noteBoard),
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
      members[syncClientId()] = { name: syncName(), role: 'owner', joinedAt: Date.now(), eid: uid() };
      const noteLog: Record<string, unknown> = {}, invLog: Record<string, unknown> = {};
      (s.noteLog || []).forEach((e) => { if (e && e.id) noteLog[e.id] = e; });
      (s.invLog || []).forEach((e) => { if (e && e.id) invLog[e.id] = e; });
      // Los productos se guardan cada uno en su propio documento de la
      // subcoleccion (ver la nota junto a productDocRef), no embebidos en el
      // documento principal.
      await Promise.all(s.products.map((p) => setDoc(productDocRef(key, p.id), JSON.parse(JSON.stringify(p)), { merge: true })));
      await setDoc(ref, {
        name: s.name, image: s.image, sales, categories: s.categories || [],
        categoryPricing: s.categoryPricing || {},
        notes: s.notes || '', noteLog, invLog, inventory: s.inventory || {},
        events: s.events || [],
        createdBy: syncClientId(), members, updatedBy: syncClientId(),
      }, { merge: true });
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
      if (clashName((r.members || {}) as Record<string, Member>)) {
        await customAlert('Ya hay un empleado con ese nombre en la tienda. Cambia tu nombre y vuelve a intentarlo.');
        return;
      }
      const upd: Record<string, Member> = {};
      upd[syncClientId()] = { name: syncName(), role: isOwner ? 'owner' : 'worker', joinedAt: (prev as Member).joinedAt || Date.now(), eid: (prev as Member).eid || uid() };
      await setDoc(ref, { members: upd }, { merge: true });
      if (isOwner && !r.createdBy) await setDoc(ref, { createdBy: syncClientId() }, { merge: true });
      // Se incorporan tambien los productos de la subcoleccion, para que el
      // estado local quede completo desde ya (el listener attach() los
      // actualiza igual luego, en tiempo real).
      const remoteProducts = await loadProducts(key);
      const mergedProducts = new Map<string, Product>();
      s.products.forEach((p) => mergedProducts.set(p.id, p));
      remoteProducts.forEach((p) => mergedProducts.set(p.id, p));
      mutate((d) => {
        const st = d.stores.find((x) => x.id === storeId);
        if (!st) return;
        st.members = Object.assign({}, JSON.parse(JSON.stringify(r.members || {})), upd);
        st.createdBy = r.createdBy || syncClientId();
        st.localRole = isOwner ? 'owner' : 'worker';
        st.syncKey = key;
        st.syncPin = pin;
        st.products = Array.from(mergedProducts.values());
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
