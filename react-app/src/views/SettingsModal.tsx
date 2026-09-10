import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName, deletedStores, canManageNotes } from '../lib/core';
import type { DeletedStoreRecord } from '../lib/core';
import { useAppVersion } from '../lib/appVersion';
import { notifyEnabled, setNotifyEnabled, notifCats, setNotifCat } from '../lib/settings';
import { requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, disablePushForStore, pushConfigured } from '../lib/push';
import { setPushPrefs, restoreStoreFn } from '../lib/sync';
import { themePref, setThemePref, themeOptions } from '../lib/theme';
import type { ThemePref } from '../lib/theme';
import { exportNotesArchiveTxt, exportObjectivesArchiveTxt } from '../lib/notesArchive';
import { DownloadIcon, Modal } from '../ui';
import type { NotifCat } from '../types';

const NOTIF_CAT_LABELS: { cat: NotifCat; label: string }[] = [
  { cat: 'nota', label: 'Notas y objetivos' },
  { cat: 'venta', label: 'Ventas' },
  { cat: 'producto', label: 'Productos' },
  { cat: 'cargamento', label: 'Cargamentos' },
];

// Los temas ocultos (owen/crisdeku/pandi) no se ofrecen, pero si uno está
// activo se muestra con su logo junto a los temas normales.
const DEV_THEME_META: Record<string, { name: string; logo: string }> = {
  owen: { name: 'Owen-chan', logo: './logo-owen.png' },
  crisdeku: { name: 'Crisdeku', logo: './logo-crisdeku.png' },
  pandi: { name: 'Pandi', logo: './logo-pandi.png' },
};

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
          <div className="theme-chip-row">
            {themeOptions().map((o) => (
              <button key={o.value} type="button" className={'theme-chip' + (theme === o.value ? ' active' : '')} onClick={() => { setTheme(o.value); setThemePref(o.value); }}>{o.label}</button>
            ))}
          </div>
          {DEV_THEME_META[theme] && (
            <div className="theme-dev-box">
              <img className="theme-dev-logo" src={DEV_THEME_META[theme].logo} alt="" />
              <span>Tema oculto activo: <b>{DEV_THEME_META[theme].name}</b></span>
            </div>
          )}
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
        <div className="label">Registros</div>
        <div className="field">
          {store && canManageNotes(store) ? (
            <>
              <div className="settings-row" style={{ flexWrap: 'wrap' }}>
                <button className="button outline" onClick={() => exportNotesArchiveTxt(store.id, store.name)} title="Descarga lo que este dispositivo registró de notas y respuestas de hilos, incluidas las que ya desaparecieron"><DownloadIcon /> Descargar registros de notas</button>
                <button className="button outline" onClick={() => exportObjectivesArchiveTxt(store.id, store.name)} title="Descarga lo que este dispositivo registró de listas de objetivos"><DownloadIcon /> Descargar registros de objetivos</button>
              </div>
              <p className="muted">Solo llegan los registros que este dispositivo alcanzó a ver; cada equipo descarga los suyos.</p>
            </>
          ) : (
            <p className="muted">Los registros de notas y objetivos están disponibles para el dueño y los administradores.</p>
          )}
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
                </div>
                <button className="button secondary" disabled={busy} onClick={() => restoreOne(rec)}>Restaurar</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No hay tiendas borradas para restaurar.</p>
        )}
        <p className="muted">Las tiendas borradas aparecerán aquí durante 14 días.</p>
      </div>

      <p className="muted settings-version">Versión {version}</p>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose} disabled={busy}>Cerrar</button>
      </div>
    </Modal>
  );
}