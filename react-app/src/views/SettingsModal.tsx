import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName, deletedStores } from '../lib/core';
import type { DeletedStoreRecord } from '../lib/core';
import { useAppVersion } from '../lib/appVersion';
import { notifyEnabled, setNotifyEnabled, notifCats, setNotifCat } from '../lib/settings';
import { requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, disablePushForStore, pushConfigured } from '../lib/push';
import { setPushPrefs, restoreStoreFn } from '../lib/sync';
import { themePref, setThemePref, themeOptions } from '../lib/theme';
import type { ThemePref } from '../lib/theme';
import { Modal } from '../ui';
import type { NotifCat } from '../types';

const NOTIF_CAT_LABELS: { cat: NotifCat; label: string }[] = [
  { cat: 'nota', label: 'Notas y objetivos' },
  { cat: 'venta', label: 'Ventas' },
  { cat: 'producto', label: 'Productos' },
  { cat: 'cargamento', label: 'Cargamentos' },
];

// Ventana de ajustes de la app, que se abre desde la tuerca del menu lateral
// (el que sirve tambien para cambiar de tienda). Todo es por dispositivo y
// se guarda localmente, no viaja por Firestore. Las notificaciones se
// manejan con UN solo interruptor: sonido + vibracion de adentro de la app
// y, en segundo plano, el aviso del sistema y el push real de la tienda.
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, store, toast, replace, attach } = useStore();
  const version = useAppVersion();
  const [name, setName] = useState(syncName() === 'Trabajador' ? '' : syncName());
  const [notif, setNotif] = useState(notifyEnabled());
  const [cats, setCats] = useState(notifCats());
  const [busy, setBusy] = useState(false);
  const [permDenied, setPermDenied] = useState(false);
  const [pushState, setPushState] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemePref>(themePref());
  const [deleted, setDeleted] = useState(deletedStores());

  async function restoreOne(rec: DeletedStoreRecord) {
    if (busy) return;
    setBusy(true);
    try {
      const ok = await restoreStoreFn(rec.key, () => state, replace, attach, toast);
      if (ok) setDeleted(deletedStores());
    } finally {
      setBusy(false);
    }
  }

  function saveName() {
    syncSetName(name.trim());
    toast('Nombre actualizado. Se mostrará en notas, ventas e inventario.');
  }

  async function toggleNotifications(on: boolean) {
    if (busy) return;
    setBusy(true);
    setNotif(on);
    setNotifyEnabled(on);
    try {
      if (!on) {
        if (store && store.syncKey) await disablePushForStore(store.syncKey);
        setPushState(null);
        toast('Notificaciones apagadas en este dispositivo.');
        return;
      }
      toast('Notificaciones activadas: sonido y vibración al llegar algo nuevo.');
      if (store && store.syncKey) {
        setPushPrefs(store.syncKey, notifCats()).catch(() => {});
        if (pushConfigured()) {
          const r = await enablePushForStore(store.syncKey);
          setPermDenied(r === 'denied');
          if (r === 'ok') setPushState('Este dispositivo ya está registrado para recibir avisos con la app cerrada.');
          else if (r === 'unsupported' || r === 'error') setPushState('El aviso de fondo no se pudo registrar en este navegador; el sonido dentro de la app sigue funcionando.');
          else setPushState(null);
        } else {
          const p = await requestNotifyPermission();
          setPermDenied(p === 'denied');
          setPushState(p !== 'denied' ? 'Avisos del sistema activados en este dispositivo.' : null);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  function toggleCat(cat: NotifCat) {
    const cur = cats[cat] === undefined ? true : !!cats[cat];
    const next = !cur;
    setNotifCat(cat, next);
    const m = notifCats();
    setCats(m);
    if (store && store.syncKey) setPushPrefs(store.syncKey, m).catch(() => {});
  }

  return (
    <Modal onClose={onClose}>
      <h2>Opciones</h2>
      <div className="settings-block">
        <div className="label">Ajustes generales</div>
        <div className="field">
          <label>Tu nombre</label>
          <div className="settings-row">
            <input id="settings-name" maxLength={30} placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="button secondary" onClick={saveName}>Guardar</button>
          </div>
          <p className="muted">Es el nombre con el que firmas notas, ventas e inventario del equipo.</p>
        </div>
      </div>

      <div className="settings-block">
        <div className="label">Apariencia</div>
        <div className="field">
          <div className="settings-row">
            <select id="settings-theme" value={theme} onChange={(e) => { const v = e.target.value as ThemePref; setTheme(v); setThemePref(v); }} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd8e5', background: '#fff', color: 'var(--ink)' }}>
              {themeOptions().map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <p className="muted">El tema se aplica en este dispositivo. "Automático" usa el modo claro u oscuro que tenga el teléfono.</p>
        </div>
      </div>

      <div className="settings-block">
        <div className="label">Notificaciones</div>
        <div className="field">
          <div className="settings-row">
            <label className="switch">
              <input type="checkbox" checked={notif} onChange={(e) => toggleNotifications(e.target.checked)} /><span />
            </label>
            <span className="muted">{notif ? 'Activadas' : 'Apagadas'}</span>
          </div>
          <p className="muted">Algo nuevo del equipo: sonido, vibración y aviso aunque la app esté cerrada.</p>
          {permDenied && <p className="muted">El navegador bloqueó los avisos del sistema. Actívalos desde sus ajustes y vuelve aquí.</p>}
          {pushState && !permDenied && <p className="muted">{pushState}</p>}
          <div className="settings-cats">
            <div className="settings-cats-label">Recibir avisos de:</div>
            {NOTIF_CAT_LABELS.map(({ cat, label }) => {
              const on = cats[cat] === undefined ? true : !!cats[cat];
              return (
                <div key={cat} className={'settings-cat' + (!notif || !on ? ' off' : '')}>
                  <span>{label}</span>
                  <label className="switch">
                    <input type="checkbox" checked={on} disabled={!notif} onChange={() => toggleCat(cat)} /><span />
                  </label>
                </div>
              );
            })}
          </div>
          <p className="muted">Las categorías apagadas no llegan, ni siquiera con la app cerrada.</p>
        </div>
      </div>

      <div className="settings-block">
        <div className="label">Restaurar tienda borrada</div>
        {deleted.length ? (
          <div className="team-list" style={{ margin: 0 }}>
            {deleted.map((rec) => (
              <div key={rec.key} className="team-row" style={{ flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0, overflowWrap: 'break-word', flex: 1 }}>
                  <div className="team-name">{rec.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>Se puede restaurar hasta el {new Date(rec.deletedAt + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}</div>
                </div>
                <button className="button secondary" disabled={busy} onClick={() => restoreOne(rec)}>Restaurar</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No hay tiendas borradas recientemente para restaurar.</p>
        )}
        <p className="muted">Borrar una tienda la oculta de todos los dispositivos al instante, pero queda una copia en la nube por 14 días por si necesitas recuperarla.</p>
      </div>

      <p className="muted settings-version">Versión {version}</p>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose} disabled={busy}>Cerrar</button>
      </div>
    </Modal>
  );
}