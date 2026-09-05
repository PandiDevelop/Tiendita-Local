// ===== Sincronización en tiempo real entre dispositivos (Cloud Firestore) =====
// Cada tienda compartida usa un "código" (PIN). El código se convierte en la clave
// del documento compartido; quien conozca el código accede a la misma tienda.
const syncClientId =
  localStorage.getItem('mi-tiendita-client') ||
  (localStorage.setItem('mi-tiendita-client', Math.random().toString(36).slice(2) + Date.now().toString(36)),
   localStorage.getItem('mi-tiendita-client'));
let DB = null;
const SYNC_ON = {};   // storeId -> unsubscribe()
const SYNC_TMR = {};  // storeId -> timeout
const LAST_PUSH = {}; // storeId -> huella del último push (evita ecos y escrituras vacías)
const SYNC_DEFAULT_NAME = 'Trabajador';

function syncReady() {
  if (DB) return true;
  const cfg = window.FIREBASE_CONFIG;
  if (!cfg || !cfg.projectId) return false;
  try {
    firebase.initializeApp(cfg);
    DB = firebase.firestore();
    return true;
  } catch (e) {
    console.warn('Firebase no disponible:', e);
    return false;
  }
}
function syncName() {
  return localStorage.getItem('mi-tiendita-user') || SYNC_DEFAULT_NAME;
}
function syncSetName(v) {
  localStorage.setItem('mi-tiendita-user', (v && v.trim()) ? v.trim() : SYNC_DEFAULT_NAME);
}

// FNV-1a sobre el PIN -> clave de documento DETERMINISTA (el mismo PIN siempre
// produce el mismo documento en todos los dispositivos).
function syncKeyOf(pin) {
  let h = 0x811c9dc5;
  const str = 'mitiendita:' + String(pin);
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return 'st' + ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

// En Firestore los productos y ventas se guardan como MAPA {id: objeto}: al hacer
// set(...,{merge:true}) cada clave se actualiza por separado, así dos dispositivos
// pueden editar/crear productos distintos a la vez sin pisarse. Estos helpers
// convierten ese mapa (o el formato antiguo de arreglo) a los arreglos locales.
function toProductsArr(src) {
  if (!src) return [];
  return Array.isArray(src) ? JSON.parse(JSON.stringify(src)) : Object.keys(src).map(k => JSON.parse(JSON.stringify(src[k])));
}
function toSalesArr(src) {
  if (!src) return [];
  return Array.isArray(src) ? JSON.parse(JSON.stringify(src)) : Object.keys(src).map(k => JSON.parse(JSON.stringify(src[k])));
}

// Fusión segura de contadores: por fila (producto+promoción) gana la mayor
// cantidad, así dos trabajadores que registran a la vez no pierden ventas.
function mergeItems(a, b) {
  const map = new Map();
  (a || []).forEach(i => map.set(i.productId + '|' + (i.promotionId || ''), JSON.parse(JSON.stringify(i))));
  (b || []).forEach(i => {
    const k = i.productId + '|' + (i.promotionId || '');
    const cur = map.get(k);
    if (!cur || cur.qty < i.qty) map.set(k, JSON.parse(JSON.stringify(i)));
  });
  return Array.from(map.values());
}

// Aplica lo que llega de la nube sin borrar datos locales: UNIÓN por id.
// También detecta si este dispositivo fue expulsado de la tienda.
function syncApply(storeId, remote) {
  if (!remote || remote.updatedBy === syncClientId) return;
  const s = state.stores.find(x => x.id === storeId);
  if (!s) return;

  const members = remote.members ? JSON.parse(JSON.stringify(remote.members)) : null;
  const removed = remote.createdBy && remote.createdBy !== syncClientId && (!remote.members || !remote.members[syncClientId]);
  if (removed) {
    s.members = members || {};
    delete s.syncKey; delete s.syncPin;
    save(); render(); toast('Fuiste eliminado de esta tienda.');
    detachSync(storeId);
    return;
  }
  if (members) s.members = members;
  if (remote.createdBy && remote.createdBy !== s.createdBy) s.createdBy = remote.createdBy;

  const products = new Map(s.products.map(p => [p.id, p]));
  toProductsArr(remote.products).forEach(p => products.set(p.id, p));
  s.products = Array.from(products.values());

  const sales = new Map(s.sales.map(x => [x.id, x]));
  toSalesArr(remote.sales).forEach(rs => {
    const ls = sales.get(rs.id);
    if (ls) {
      sales.set(rs.id, Object.assign({}, ls, { items: mergeItems(ls.items, rs.items), closed: ls.closed || !!rs.closed }));
    } else {
      sales.set(rs.id, JSON.parse(JSON.stringify(rs)));
    }
  });
  s.sales = Array.from(sales.values());

  if (remote.name && remote.name !== s.name) s.name = remote.name;
  if (remote.image && remote.image !== s.image) s.image = remote.image;
  save();
  render();
}

// Sube el estado local con merge:true. Cada producto/venta se graba bajo su propio
// id, de modo que un push nunca elimina lo que escribió el otro dispositivo.
// La lista de "members" se guarda SOLO en las operaciones de alta/eliminación de
// miembros (no aquí) para que el creador controle quién pertenece.
async function pushSync(storeId) {
  const s = state.stores.find(x => x.id === storeId);
  if (!s || !s.syncKey || !DB) return;
  const syncFp = JSON.stringify([s.name, s.image, s.products, s.sales]);
  if (LAST_PUSH[storeId] === syncFp) return;
  LAST_PUSH[storeId] = syncFp;
  const products = {}, sales = {};
  s.products.forEach(p => products[p.id] = p);
  s.sales.forEach(x => sales[x.id] = x);
  try {
    await DB.collection('stores').doc(s.syncKey).set({
      name: s.name,
      image: s.image,
      products,
      sales,
      updatedBy: syncClientId,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (e) { console.warn('Push fallido:', e); }
}
function scheduleSync(storeId) {
  const s = state.stores.find(x => x.id === storeId);
  if (!s || !s.syncKey || !DB) return;
  clearTimeout(SYNC_TMR[storeId]);
  SYNC_TMR[storeId] = setTimeout(() => { delete SYNC_TMR[storeId]; pushSync(storeId); }, 600);
}
function attachSync(storeId) {
  if (!DB) return;
  if (SYNC_ON[storeId]) { SYNC_ON[storeId](); delete SYNC_ON[storeId]; }
  const s = state.stores.find(x => x.id === storeId);
  if (!s || !s.syncKey) return;
  SYNC_ON[storeId] = DB.collection('stores').doc(s.syncKey).onSnapshot(snap => {
    if (snap.exists) {
      const d = snap.data();
      if (d.updatedBy !== syncClientId) syncApply(storeId, d);
    }
  }, e => console.warn('Suscripción:', e));
}
function detachSync(storeId) {
  if (SYNC_ON[storeId]) { SYNC_ON[storeId](); delete SYNC_ON[storeId]; }
}
function myMember(s) {
  return {
    name: syncName(),
    role: (s && s.createdBy === syncClientId) ? 'owner' : 'worker',
    joinedAt: (s && s.members && s.members[syncClientId] && s.members[syncClientId].joinedAt) || Date.now()
  };
}
async function activateSync(s, pin) {
  if (!syncReady()) { toast('Configura Firebase primero (ver README).'); return; }
  const key = syncKeyOf(pin);
  const ref = DB.collection('stores').doc(key);
  try {
    const snap = await ref.get();
    if (!snap.exists) {
      const products = {}, sales = {};
      s.products.forEach(p => products[p.id] = p);
      s.sales.forEach(x => sales[x.id] = x);
      const members = {};
      members[syncClientId] = { name: syncName(), role: 'owner', joinedAt: Date.now() };
      await ref.set({
        name: s.name,
        image: s.image,
        products,
        sales,
        createdBy: syncClientId,
        members,
        updatedBy: syncClientId,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      toast('Sincronización activada. Comparte el código con tu equipo.');
    } else {
      const r = snap.data();
      const isOwner = !r.createdBy || r.createdBy === syncClientId;
      const prev = (r.members && r.members[syncClientId]) || (s.members && s.members[syncClientId]) || {};
      const upd = {};
      upd[syncClientId] = { name: syncName(), role: isOwner ? 'owner' : 'worker', joinedAt: prev.joinedAt || Date.now() };
      await ref.set({ members: upd }, { merge: true });
      if (isOwner && !r.createdBy) await ref.set({ createdBy: syncClientId }, { merge: true });
      s.members = JSON.parse(JSON.stringify(r.members || {}));
      s.createdBy = r.createdBy || syncClientId;
      Object.assign(s.members, upd);
      toast(isOwner ? 'Tienda actualizada y sincronización confirmada.' : 'Vinculado a la tienda compartida.');
    }
    s.syncKey = key;
    s.syncPin = pin;
    save(); render(); attachSync(s.id);
  } catch (e) { console.warn(e); toast('No se pudo sincronizar. Revisa tu conexión.'); }
}
async function removeMember(storeId, memberId) {
  const s = state.stores.find(x => x.id === storeId);
  if (!s || !s.syncKey || !DB || memberId === syncClientId) return;
  const members = Object.assign({}, s.members || {});
  delete members[memberId];
  s.members = members;
  save(); render();
  try {
    const del = firebase.firestore.FieldValue.delete();
    const upd = {};
    upd[memberId] = del;
    await DB.collection('stores').doc(s.syncKey).set({ members: upd }, { merge: true });
    toast('Trabajador eliminado de la tienda.');
  } catch (e) { console.warn(e); toast('No se pudo eliminar al trabajador.'); }
}
function deactivateSync(id) {
  const s = state.stores.find(x => x.id === id);
  if (!s) return;
  detachSync(id);
  delete s.syncKey; delete s.syncPin;
  save(); render(); toast('Sincronización desactivada. La tienda queda solo en este dispositivo.');
}

// ===== Overrides que conservan el comportamiento original =====
// IMPORTANTE: se asigna a window.* con función anónima y se guarda el original
// ANTES, para no chocar con el hoisting de "function" (evita recursión).

// Envía los cambios locales al servidor cada vez que se guarda una tienda sincronizada.
var saveBase = save;
window.save = function () {
  saveBase();
  state.stores.forEach(s => { if (s.syncKey) scheduleSync(s.id); });
};

// Quién registró cada venta: se guarda en el día al cambiarlo, y se muestra
// en Historial y en el panel de Ventas del día.
var changeQtyBase = changeQty;
window.changeQty = function (sid, pid, promoid, d) {
  const s = store();
  const sale = s && s.sales.find(x => x.id === sid);
  if (sale) sale.by = syncName();
  changeQtyBase(sid, pid, promoid, d);
};
var editSaleBase = editSale;
window.editSale = function (id) {
  const s = store();
  const sale = s && s.sales.find(x => x.id === id);
  if (sale) sale.by = syncName();
  editSaleBase(id);
};

// Añade la sección de sincronización al modal de tienda (crear/editar):
// código, tu nombre y (si eres el creador) la lista de trabajadores con opción a quitar.
var storeModalBase = storeModal;
window.storeModal = function (id) {
  storeModalBase(id);
  const m = document.querySelector('.modal');
  if (!m) return;
  const s = id ? state.stores.find(x => x.id === id) : null;
  const field = document.createElement('div');
  field.className = 'field sync-field';
  if (s && s.syncKey) {
    const members = s.members || {};
    const owner = s.createdBy === syncClientId;
    const others = Object.keys(members).filter(x => x !== syncClientId);
    const list = others.map(x => {
      const mm = members[x];
      return `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span>${esc(mm && mm.name ? mm.name : 'Trabajador')}</span>${owner ? `<button class="icon-btn" title="Quitar de la tienda" onclick="removeMember('${s.id}','${x}')">×</button>` : ''}</div>`;
    }).join('');
    field.innerHTML = `<input type="hidden" id="sync-pin" value="${esc(s.syncPin || s.syncKey)}"><div class="label">Sincronización activa</div><div class="image-picker"><div style="min-width:0;flex:1"><strong style="letter-spacing:1.5px">${esc(s.syncPin || s.syncKey)}</strong><p class="muted">Comparte este código con tu equipo. Los cambios se ven en tiempo real.</p><input id="sync-name" maxlength="30" placeholder="Tu nombre" value="${esc(syncName() === SYNC_DEFAULT_NAME ? '' : syncName())}">${owner ? `<div class="label" style="margin-top:14px">Trabajadores vinculados</div>${others.length ? `<div style="display:grid;gap:6px">${list}</div>` : '<p class="muted">Aún no hay trabajadores vinculados.</p>'}` : ''}</div><button class="icon-btn" title="Desvincular" onclick="deactivateSync('${s.id}')">×</button></div>`;
  } else {
    const ok = window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId;
    const hint = ok
      ? 'Quienes tengan el mismo código verán y editarán esta tienda en tiempo real.'
      : 'Sincronización desactivada: configura Firebase primero (ver README).';
    field.innerHTML = `<div class="label">Sincronización en tiempo real (opcional)</div><div class="image-picker"><div style="min-width:0;flex:1"><input id="sync-pin" maxlength="30" placeholder="Código compartido de la tienda"><input id="sync-name" maxlength="30" placeholder="Tu nombre (para ver quién registra las ventas)"><p class="muted">${hint}</p></div></div>`;
  }
  const actions = m.querySelector('.modal-actions');
  if (actions) actions.before(field);
};

// Al guardar una tienda: guarda tu nombre y, si hay código, activa/refresca la sincronización.
var saveStoreBase = saveStore;
window.saveStore = async function (id) {
  const nameEl = document.getElementById('sync-name');
  const name = nameEl ? nameEl.value.trim() : '';
  if (name) syncSetName(name);
  const pinEl = document.getElementById('sync-pin');
  const pin = pinEl ? pinEl.value.trim() : '';
  saveStoreBase(id);
  const s = state.stores.find(x => x.id === (id || state.activeStoreId));
  if (s && pin) await activateSync(s, pin);
};

// Botón "Unirme a una tienda" en la pantalla de bienvenida.
var welcomeBase = welcome;
window.welcome = function () {
  return welcomeBase() + `<p style="margin-top:16px"><button class="button secondary" onclick="joinModal()">Unirme a una tienda</button></p>`;
};

// Añade "Unirme a una tienda" en el menú lateral y en el encabezado móvil,
// para que un dispositivo que ya tiene tiendas también pueda unirse, y muestra
// quién registró cada venta.
var renderBase = render;
window.render = function () {
  renderBase();
  document.querySelectorAll('.sidebar .new-store, .mobile-head .new-store').forEach(btn => {
    if (btn.nextElementSibling && btn.nextElementSibling.classList.contains('sync-join')) return;
    const t = document.createElement('template');
    t.innerHTML = `<button class="new-store sync-join" onclick="joinModal()">Unirme a una tienda</button>`;
    btn.insertAdjacentElement('afterend', t.content.firstElementChild);
  });
  const cur = state.stores.length ? store() : null;
  if (cur) {
    const closed = cur.sales.filter(x => x.closed).sort((a, b) => b.date.localeCompare(a.date));
    const rows = document.querySelectorAll('.history-row');
    rows.forEach((row, i) => {
      const sale = closed[i];
      if (sale && sale.by) {
        const d = row.querySelector('.date');
        if (d && !d.querySelector('.by-name')) {
          const sp = document.createElement('span');
          sp.className = 'tag by-name';
          sp.textContent = sale.by;
          d.appendChild(sp);
        }
      }
    });
    if (state.tab === 'ventas') {
      const sale = cur.sales.find(x => x.id === state.editingSaleId);
      const panel = document.querySelector('.panel');
      if (sale && sale.by && panel && !panel.querySelector('.by-line')) {
        const pj = document.createElement('div');
        pj.className = 'muted by-line';
        pj.textContent = 'Registrando: ' + sale.by;
        panel.prepend(pj);
      }
    }
  }
};
function joinModal() {
  const myName = syncName();
  modal(`<h2>Unirme a una tienda</h2><div class="field"><label>Tu nombre</label><input id="sync-name" maxlength="30" placeholder="Cómo te llaman tus compañeros" ${myName === SYNC_DEFAULT_NAME ? 'autofocus' : ''}></div><div class="field"><label>¿Tienes el código de tu tienda?</label><input id="sync-pin" maxlength="30" placeholder="Código compartido" ${myName === SYNC_DEFAULT_NAME ? '' : 'autofocus'}></div><p class="muted">Pega el código que te dio quien creó la tienda. Sus productos y ventas aparecerán aquí.</p><div class="modal-actions"><button class="button secondary" onclick="closeModal()">Cancelar</button><button class="button primary" onclick="joinStore()">Vincular</button></div>`);
}
async function joinStore() {
  const pinEl = document.getElementById('sync-pin');
  const nameEl = document.getElementById('sync-name');
  const pin = pinEl ? pinEl.value.trim() : '';
  const name = nameEl ? nameEl.value.trim() : '';
  if (!pin) return toast('Escribe el código.');
  if (name) syncSetName(name);
  if (!syncReady()) return toast('Configura Firebase primero (ver README).');
  const key = syncKeyOf(pin);
  try {
    const snap = await DB.collection('stores').doc(key).get();
    if (!snap.exists) return toast('No existe una tienda con ese código.');
    const r = snap.data();
    const members = {};
    members[syncClientId] = { name: syncName(), role: 'worker', joinedAt: Date.now() };
    await DB.collection('stores').doc(key).set({ members: members }, { merge: true });
    const s = {
      id: crypto.randomUUID(),
      name: r.name || 'Tienda compartida',
      image: r.image || defaultStoreImage,
      products: toProductsArr(r.products),
      sales: toSalesArr(r.sales),
      syncKey: key,
      syncPin: pin,
      createdBy: r.createdBy || null,
      members: JSON.parse(JSON.stringify(r.members || {}))
    };
    Object.assign(s.members, members);
    state.stores.push(s);
    state.activeStoreId = s.id;
    state.tab = 'inicio';
    save(); closeModal(); render(); attachSync(s.id);
    toast('Tienda vinculada.');
  } catch (e) { console.warn(e); toast('No se pudo conectar con la tienda.'); }
}

// El registro abierto de un día usa un id determinista para que todos los
// dispositivos editen la MISMA fila de ventas del mismo día, y guarda quién lo abre.
window.startDay = function () {
  const s = store();
  let sale = s.sales.find(x => x.date === today());
  if (sale) { syncSale(sale, s); sale.closed = false; }
  else { sale = { id: 'day-' + today(), date: today(), closed: false, items: [] }; syncSale(sale, s); s.sales.push(sale); }
  sale.by = syncName();
  state.editingSaleId = sale.id;
  state.tab = 'ventas';
  save(); render(); toast('Registro de hoy abierto.');
};

// Suscríbete a las tiendas ya compartidas al cargar.
function syncInit() {
  if (!syncReady()) return;
  state.stores.forEach(s => { if (s.syncKey) attachSync(s.id); });
}
syncInit();

// Re-renderiza para aplicar los botones "Unirme" del menú lateral/encabezado
// (la primera render ocurre antes de que este script cargue).
render();