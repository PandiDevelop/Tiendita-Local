import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName } from '../lib/core';
import { useAppVersion } from '../lib/appVersion';
import { notifyEnabled, setNotifyEnabled } from '../lib/settings';
import { requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, disablePushForStore, pushConfigured } from '../lib/push';
import { Modal } from '../ui';

// Ventana de ajustes de la app, que se abre desde la tuerca del menu lateral
// (el que sirve tambien para cambiar de tienda). Todo es por dispositivo y
// se guarda localmente, no viaja por Firestore. Las notificaciones se
// manejan con UN solo interruptor: sonido + vibracion de adentro de la app
// y, en segundo plano, el aviso del sistema y el push real de la tienda.
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { store, toast } = useStore();
  const version = useAppVersion();
  const [name, setName] = useState(syncName() === 'Trabajador' ? '' : syncName());
  const [notif, setNotif] = useState(notifyEnabled());
  const [busy, setBusy] = useState(false);
  const [permDenied, setPermDenied] = useState(false);

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
        toast('Notificaciones apagadas en este dispositivo.');
        return;
      }
      toast('Notificaciones activadas: sonido y vibración al llegar algo nuevo.');
      if (store && store.syncKey) {
        if (pushConfigured()) {
          const r = await enablePushForStore(store.syncKey);
          setPermDenied(r === 'denied');
        } else {
          const p = await requestNotifyPermission();
          setPermDenied(p === 'denied');
        }
      }
    } finally {
      setBusy(false);
    }
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
        <div className="label">Notificaciones</div>
        <div className="field">
          <div className="settings-row">
            <label className="switch">
              <input type="checkbox" checked={notif} onChange={(e) => toggleNotifications(e.target.checked)} /><span />
            </label>
            <span className="muted">{notif ? 'Activadas' : 'Apagadas'}</span>
          </div>
          <p className="muted">Sonido y vibración al llegar algo nuevo del equipo. Al activarlas también se intentan los avisos del sistema y del push, aunque la app esté cerrada.</p>
          {permDenied && <p className="muted">El navegador bloqueó los avisos del sistema. Actívalos desde sus ajustes y vuelve aquí.</p>}
        </div>
      </div>

      <p className="muted settings-version">Versión {version}</p>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose} disabled={busy}>Cerrar</button>
      </div>
    </Modal>
  );
}