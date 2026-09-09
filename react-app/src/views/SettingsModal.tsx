import { useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName } from '../lib/core';
import { useAppVersion } from '../lib/appVersion';
import { soundEnabled, setSoundEnabled } from '../lib/settings';
import { notifyPermission, requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, pushConfigured } from '../lib/push';
import { BellIcon, Modal } from '../ui';

// Ventana de ajustes de la app, que se abre desde la tuerca del menu lateral
// (el que sirve tambien para cambiar de tienda). Ajustes generales (nombre,
// sonido) y notificaciones (aviso del sistema y push real por tienda), de
// este dispositivo: no viajan por Firestore.
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { store, toast } = useStore();
  const version = useAppVersion();
  const [name, setName] = useState(syncName() === 'Trabajador' ? '' : syncName());
  const [sound, setSound] = useState(soundEnabled());
  const [notifyState, setNotifyState] = useState(notifyPermission());
  const [busy, setBusy] = useState(false);

  function saveName() {
    syncSetName(name.trim());
    toast('Nombre actualizado. Se mostrará en notas, ventas e inventario.');
  }

  async function enableNotify() {
    if (busy) return;
    setBusy(true);
    try {
      const p = await requestNotifyPermission();
      setNotifyState(p);
      if (p === 'granted') toast('Avisos del sistema activados.');
      else if (p === 'denied') toast('El navegador bloqueó el permiso. Actívalo desde sus ajustes y vuelve aquí.');
      else toast('Aún no se activaron: aprovecha cuando el navegador pregunte.');
    } finally {
      setBusy(false);
    }
  }

  async function enablePush() {
    if (busy || !store || !store.syncKey) return;
    setBusy(true);
    const r = await enablePushForStore(store.syncKey);
    setBusy(false);
    toast(
      r === 'ok'
        ? 'Aviso push activado para esta tienda.'
        : r === 'denied'
        ? 'Hace falta el permiso del sistema para recibir avisos.'
        : 'No se pudo activar el aviso push en este dispositivo.',
    );
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
        <div className="field">
          <label>Sonido de notas nuevas</label>
          <div className="settings-row">
            <label className="switch">
              <input type="checkbox" checked={sound} onChange={(e) => { setSound(e.target.checked); setSoundEnabled(e.target.checked); }} /><span />
            </label>
            <span className="muted">{sound ? 'Activado' : 'Silenciado'}</span>
          </div>
        </div>
      </div>

      <div className="settings-block">
        <div className="label">Notificaciones</div>
        <div className="field">
          <div className="label">Aviso del sistema</div>
          {notifyState === 'granted' ? (
            <p className="muted">Activados: llegan avisos de notas nuevas aunque la app esté cerrada o en otra pestaña.</p>
          ) : notifyState === 'denied' ? (
            <p className="muted">El navegador los tiene bloqueados. Actívalos desde sus ajustes y vuelve a abrir esto.</p>
          ) : (
            <button className="button secondary" onClick={enableNotify} disabled={busy}><BellIcon /> Activar avisos del sistema</button>
          )}
        </div>
        {pushConfigured() && store && store.syncKey && (
          <div className="field">
            <div className="label">Aviso push de la tienda</div>
            <p className="muted">Notificaciones reales para “{store.name}”: llegan aunque la app esté completamente cerrada. Necesita el permiso del sistema de arriba.</p>
            <button className="button secondary" onClick={enablePush} disabled={busy}>Activar aviso push</button>
          </div>
        )}
      </div>

      <p className="muted settings-version">Versión {version}</p>
      <div className="modal-actions">
        <button className="button primary" onClick={onClose}>Cerrar</button>
      </div>
    </Modal>
  );
}