import { useState } from 'react';
import { useStore } from '../store';
import { DEFAULT_STORE_IMAGE, compressImage, esc, myRole, syncClientId, syncGenPin, syncName, syncSetName, uid } from '../lib/core';
import { deactivateSyncFn, leaveStoreFn, deleteStoreFn, removeMemberFn, setMemberRoleFn } from '../lib/sync';
import { ImagePicker, Modal } from '../ui';
import type { Member, Role } from '../types';

export function StoreModal({ editing, onClose }: { editing?: boolean; onClose: () => void }) {
  const { state, store, replace, activate, toast, attach } = useStore();
  const s = editing ? store : undefined;
  const me = syncClientId();
  const isEmployee = !!(s && s.syncKey && s.createdBy && s.createdBy !== me);
  const isOwner = !(s && s.syncKey && s.createdBy && s.createdBy !== me);
  // Un admin (trabajador con permiso especial que el dueño le dio) tambien
  // puede ver y gestionar el equipo, aunque solo el dueño real puede
  // ascender/descender admins o quitar a otro admin.
  const canManage = isOwner || (!!s && myRole(s) === 'admin');

  const [name, setName] = useState(s?.name || '');
  const [image, setImage] = useState(s?.image || '');
  const [myName, setMyName] = useState(syncName() === 'Trabajador' ? '' : syncName());
  const [pin, setPin] = useState(s?.syncPin || s?.syncKey || syncGenPin());
  const [, force] = useState(0);

  const members = s?.members || {};
  const others = Object.keys(members).filter((x) => x !== me);

  function onFile(f: File | undefined) {
    if (!f) return;
    compressImage(f, 600, 0.85).then((data) => setImage(data));
  }

  function renderAgain() { force((n) => n + 1); }

  async function save() {
    if (myName.trim()) syncSetName(myName.trim());
    const target = s;
    if (isEmployee) {
      saveClose();
      renderAgain();
      return;
    }
    const nm = name.trim();
    if (!nm) return toast('Escribe un nombre para la tienda.');
    let savedId = '';
    replace((d) => {
      if (editing && target) {
        const st = d.stores.find((x) => x.id === target.id);
        if (st) { st.name = nm; st.image = image || DEFAULT_STORE_IMAGE; }
        savedId = target.id;
      } else {
        const st = { id: uid(), name: nm, image: image || DEFAULT_STORE_IMAGE, products: [], sales: [], categories: [], inventory: {}, notes: '', noteLog: [], invLog: [] };
        d.stores.push(st);
        d.activeStoreId = st.id;
        savedId = st.id;
      }
    });
    if (pin.trim() && savedId) {
      await activate(savedId, pin.trim());
      attach(savedId);
    }
    toast('Tienda guardada.');
    onClose();
  }

  function saveClose() {
    toast('Tienda guardada.');
    onClose();
  }

  function deactivate() {
    if (!s) return;
    deactivateSyncFn(s.id, () => state, replace, attach);
    renderAgain();
    toast('Sincronización desactivada. La tienda queda solo en este dispositivo.');
  }

  // Activa la sincronización con el código escrito. Solo tiene sentido cuando
  // la tienda ya existe (para una tienda nueva se activa al guardarla).
  async function activateSyncNow() {
    if (!s) return;
    if (myName.trim()) syncSetName(myName.trim());
    const code = pin.trim();
    if (!code) return toast('Escribe el código de sincronización.');
    await activate(s.id, code);
    attach(s.id);
    renderAgain();
    toast('Sincronización activada.');
  }

  function leave() {
    if (!s) return;
    leaveStoreFn(s.id, () => state, replace, attach).then((ok) => { if (ok) onClose(); });
  }

  function del() {
    if (!s) return;
    deleteStoreFn(s.id, () => state, replace, attach).then((ok) => { if (ok) onClose(); });
  }

  function removeMember(memberId: string) {
    if (!s) return;
    removeMemberFn(s.id, memberId, () => state, replace, toast);
    renderAgain();
  }

  function setRole(memberId: string, role: Role) {
    if (!s) return;
    setMemberRoleFn(s.id, memberId, role, () => state, replace, toast);
    renderAgain();
  }

  return (
    <Modal onClose={onClose}>
      <h2>{editing ? 'Editar tienda' : 'Nueva tienda'}</h2>
      <div className="field"><label>Nombre de la tienda</label>
        <input id="store-name" maxLength={40} placeholder="Ej. Dulces Aurora" value={name} onChange={(e) => setName(e.target.value)} disabled={isEmployee} />
      </div>
      <div className="field"><label>Imagen de la tienda</label>
        <ImagePicker id="store-image" src={image || DEFAULT_STORE_IMAGE} cls="image-preview" disabled={isEmployee} hint="Puedes subir un logo o foto. Si no eliges una, se usará la tienda predeterminada." onFile={onFile} />
      </div>
      {s && s.syncKey ? (
        <div className="field sync-field">
          <div className="label">Sincronización activa</div>
          <div className="image-picker">
            <div style={{ minWidth: 0, flex: 1, display: 'grid', gap: 12 }}>
              <div><div className="label" style={{ margin: '0 0 6px' }}>Tu nombre</div>
                <input id="sync-name" maxLength={30} placeholder="Tu nombre" value={myName} onChange={(e) => setMyName(e.target.value)} />
              </div>
              <div><div className="label" style={{ margin: '0 0 6px' }}>Código de sincronización</div>
                <div className="pin-box"><strong style={{ letterSpacing: '1.5px' }}>{esc(s.syncPin || s.syncKey)}</strong></div>
                <p className="muted">Comparte este código con tu equipo. Los cambios se ven en tiempo real.</p>
              </div>
              {canManage && <>
                <div className="label" style={{ margin: '2px 0 6px' }}>Trabajadores vinculados</div>
                {others.length ? (
                  <div style={{ display: 'grid', gap: 6 }}>
                    {others.map((mi) => {
                      const mm = members[mi] as Member;
                      const isTheOwner = mi === s.createdBy || (!!mm && mm.role === 'owner');
                      const isAdmin = !!mm && mm.role === 'admin';
                      return (
                        <div key={mi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span>{esc(mm && mm.name ? mm.name : 'Trabajador')}{isTheOwner && <span className="tag" style={{ marginLeft: 6 }}>Dueño</span>}{isAdmin && <span className="tag" style={{ marginLeft: 6 }}>Admin</span>}</span>
                          {!isTheOwner && (
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              {isOwner && (
                                <button className="button secondary" style={{ padding: '5px 9px', fontSize: 12 }} onClick={() => setRole(mi, isAdmin ? 'worker' : 'admin')}>
                                  {isAdmin ? 'Quitar admin' : 'Hacer admin'}
                                </button>
                              )}
                              {(isOwner || !isAdmin) && <button className="icon-remove" title="Quitar de la tienda" onClick={() => removeMember(mi)}>✕</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : <p className="muted">Aún no hay trabajadores vinculados.</p>}
                {!isOwner && <p className="muted">Como administrador puedes ver el equipo y quitar trabajadores. Solo el dueño puede dar o quitar el permiso de administrador.</p>}
              </>}
            </div>
          </div>
          {isOwner && <button className="button secondary" style={{ width: '100%', marginTop: 10 }} onClick={deactivate}>Desactivar sincronización</button>}
          {isEmployee && <button className="button secondary leave-btn" onClick={leave}>Desvincularse de esta tienda</button>}
        </div>
      ) : (
        <div className="field sync-field">
          <div className="label">Sincronización en tiempo real (opcional)</div>
          <div className="image-picker">
            <div style={{ minWidth: 0, flex: 1, display: 'grid', gap: 12 }}>
              <div><div className="label" style={{ margin: '0 0 6px' }}>Tu nombre</div>
                <input id="sync-name" maxLength={30} placeholder="Tu nombre" value={myName} onChange={(e) => setMyName(e.target.value)} />
              </div>
              <div><div className="label" style={{ margin: '0 0 6px' }}>Código de vinculación</div>
                <input id="sync-pin" maxLength={30} placeholder="Código de vinculación" value={pin} onChange={(e) => setPin(e.target.value)} />
              </div>
              <p className="muted" style={{ marginTop: 4 }}>Quienes tengan el mismo código verán y editarán esta tienda en tiempo real.</p>
            </div>
          </div>
          {s && isOwner && <button className="button secondary" style={{ width: '100%', marginTop: 10 }} onClick={activateSyncNow}>Activar sincronización</button>}
        </div>
      )}
      {s && isOwner ? (
        <div className="field danger-field">
          <div className="danger-zone">
            <span><b className="danger-t">Borrar tienda</b><br /><span className="muted">Elimina esta tienda del dispositivo{s.syncKey ? ' y de todos los que tienen el código' : ''}. No se puede deshacer.</span></span>
            <button className="button danger" onClick={del}>Borrar</button>
          </div>
        </div>
      ) : null}
      <div className="modal-actions">
        <button className="button secondary" onClick={onClose}>Cancelar</button>
        <button className="button primary" onClick={save}>Guardar tienda</button>
      </div>
    </Modal>
  );
}