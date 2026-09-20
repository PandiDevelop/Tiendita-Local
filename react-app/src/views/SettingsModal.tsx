import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { syncName, syncSetName, resetClientId, deletedStores, canManageNotes } from '../lib/core';
import type { DeletedStoreRecord } from '../lib/core';
import { accountEmail, setAccountEmail, setAccountId, sessionActive } from '../lib/accountStore';
import { currentIdentity, linkStoresToAccount, onAccountChange, registerAccount, sendPasswordReset, signInAccount, signOutAccount } from '../lib/account';
import { useAppVersion } from '../lib/appVersion';
import { notifyEnabled, setNotifyEnabled, notifCats, setNotifCat } from '../lib/settings';
import { requestNotifyPermission } from '../lib/sound';
import { enablePushForStore, disablePushForStore, pushConfigured } from '../lib/push';
import { setPushPrefs, restoreStoreFn } from '../lib/sync';
import { themePref, setThemePref, themeOptions } from '../lib/theme';
import type { ThemePref } from '../lib/theme';
import { exportNotesArchiveTxt, exportObjectivesArchiveTxt } from '../lib/notesArchive';
import { DownloadIcon, Modal, CloseIcon, EyeIcon, EyeOffIcon } from '../ui';
import { useInstallable } from '../lib/install';
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
  owen: { name: 'Owen-chan', logo: './design/logo-owen.png' },
  crisdeku: { name: 'Crisdeku', logo: './design/logo-crisdeku.png' },
  pandi: { name: 'Pandi', logo: './design/logo-pandi.png' },
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
  const installable = useInstallable();
  const [acct, setAcct] = useState<boolean>(sessionActive());
  const [showAccount, setShowAccount] = useState(false);
  const [acctEmail, setAcctEmail] = useState<string | null>(accountEmail());
  const [accBusy, setAccBusy] = useState(false);
  const [aemail, setAemail] = useState('');
  const [apass, setApass] = useState('');
  const [auser, setAuser] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [accNote, setAccNote] = useState<string | null>(null);
  const accNoteTimer = useRef<number | null>(null);

  // Mensaje temporal de la popup de cuenta (se ve durante unos segundos).
  function flashAccNote(msg: string) {
    setAccNote(msg);
    if (accNoteTimer.current) window.clearTimeout(accNoteTimer.current);
    accNoteTimer.current = window.setTimeout(() => setAccNote(null), 4000);
  }

  function closeAccountPopup() {
    setAemail('');
    setApass('');
    setAuser('');
    setShowPass(false);
    setAccNote(null);
    setShowAccount(false);
  }

  // Si una sesión se restaura o se cierra entre tanto (p. ej. la de Firebase
  // que se recupera al arrancar), el estado de "conectado" se refresca solo.
  useEffect(() => onAccountChange(() => setAcct(sessionActive())), []);

  async function doSignIn() {
    if (accBusy) return;
    if (!aemail.trim() || !apass) { flashAccNote('Escribe tu correo y contraseña.'); return; }
    setAccBusy(true);
    try {
      const from = currentIdentity();
      const r = await signInAccount(aemail, apass);
      if (!r.ok || !r.uid) { flashAccNote(r.message); toast(r.message); return; }
      setAccountEmail(r.email || null);
      const link = await linkStoresToAccount(r.uid, from, () => state, replace);
      setAccountId(r.uid);
      resetClientId();
      setAcct(true);
      setAcctEmail(r.email || null);
      if (link.stores) flashAccNote('Tus tiendas quedaron vinculadas a tu cuenta. Puedes recuperarlas iniciando sesión en otro teléfono.');
      else flashAccNote('Sesión iniciada. Vincula una tienda con su código y serás el dueño en este teléfono.');
      setApass('');
    } finally {
      setAccBusy(false);
    }
  }

  async function doRegister() {
    if (accBusy) return;
    if (!aemail.trim() || !apass) { flashAccNote('Escribe tu correo y una contraseña.'); return; }
    if (!auser.trim()) { flashAccNote('Escribe tu nombre de usuario: será con el que firmes notas, ventas e inventario.'); return; }
    setAccBusy(true);
    try {
      const r = await registerAccount(aemail, apass, auser);
      if (r.ok) setApass('');
      flashAccNote(r.message);
      toast(r.message);
    } finally {
      setAccBusy(false);
    }
  }

  async function doResetPass() {
    if (accBusy) return;
    if (!aemail.trim()) { flashAccNote('Escribe tu correo primero.'); return; }
    setAccBusy(true);
    try {
      const r = await sendPasswordReset(aemail);
      flashAccNote(r.message);
      toast(r.message);
    } finally {
      setAccBusy(false);
    }
  }

  async function doLogout() {
    if (accBusy) return;
    setAccBusy(true);
    try {
      const r = await signOutAccount();
      flashAccNote(r.message);
      toast(r.message);
      setAcct(false);
      setAcctEmail(null);
    } finally {
      setAccBusy(false);
    }
  }

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
      <div className="modal-float-actions">
        <button type="button" className="icon-btn float-cancel" title="Cerrar" aria-label="Cerrar" disabled={busy} onClick={onClose}><CloseIcon size={15} /></button>
      </div>
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
        <div className="label">Cuenta</div>
        <div className="field">
          <div className="settings-row">
            <button className="button outline" onClick={() => setShowAccount(true)} title="Vincula tu correo para poder recuperar tus tiendas si cambias de teléfono o reinstalas la app">Sincroniza tu cuenta</button>
          </div>
          {acct ? (
            <p className="muted">Estás conectado a <b>{acctEmail || 'tu cuenta'}</b>. Si pierdes el teléfono o reinstalas la app, entra con tu correo y el código de tu tienda para recuperarla como dueño.</p>
          ) : (
            <p className="muted">Con una cuenta, si pierdes el teléfono o reinstalas la app, vuelves a entrar con tu correo y recuperas tus tiendas como dueño.</p>
          )}
        </div>
      </div>

      {showAccount && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) closeAccountPopup(); }}>
          <div className="modal settings-account-modal">
            <div className="settings-account-head">
              <h2>Cuenta</h2>
              <button className="account-close" onClick={closeAccountPopup} title="Cerrar" aria-label="Cerrar"><CloseIcon size={14} /></button>
            </div>
            {acct ? (
              <>
                <p className="muted"><b>Estás conectado a {acctEmail || 'tu cuenta'}</b>.</p>
                <div className="settings-row" style={{ flexWrap: 'wrap' }}>
                  <button className="button outline" disabled={accBusy} onClick={doLogout} title="Termina la sesión de Firebase en este navegador">Cerrar sesión</button>
                </div>
                <p className="muted">Cerrar sesión no quita tus tiendas de este dispositivo: sigues viéndolas igual.</p>
              </>
            ) : (
              <>
                <div className="field settings-account">
                  <label htmlFor="account-email">Correo</label>
                  <input id="account-email" type="email" maxLength={120} autoComplete="email" placeholder="tucorreo@ejemplo.com" value={aemail} onChange={(e) => setAemail(e.target.value)} />
                </div>
                <div className="field settings-account">
                  <label htmlFor="account-pass">Contraseña</label>
                  <div className="password-wrap">
                    <input id="account-pass" type={showPass ? 'text' : 'password'} maxLength={120} autoComplete="current-password" placeholder="Mínimo 6 caracteres" value={apass} onChange={(e) => setApass(e.target.value)} />
                    <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)} title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'} aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}>
                      {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                </div>
                <div className="field settings-account">
                  <label htmlFor="account-name">Nombre de usuario</label>
                  <input id="account-name" type="text" maxLength={30} autoComplete="nickname" placeholder="Cómo te llamarán tus compañeros" value={auser} onChange={(e) => setAuser(e.target.value)} />
                </div>
                <div className="settings-row account-actions" style={{ flexWrap: 'wrap' }}>
                  <button className="button secondary" disabled={accBusy} onClick={doSignIn}>Iniciar sesión</button>
                  <button className="button secondary" disabled={accBusy} onClick={doRegister}>Crear cuenta</button>
                </div>
                <button className="link-btn" disabled={accBusy} onClick={doResetPass}>¿Olvidaste tu contraseña?</button>
                <p className="muted">Tu nombre de usuario será el mismo en todos los teléfonos donde inicies sesión.</p>
                <p className="muted">Te enviaremos un correo para confirmar tu cuenta antes de usarla.</p>
              </>
            )}
            {accNote && <p className="account-note" role="status">{accNote}</p>}
            {accBusy && (
              <div className="account-loading" role="status" aria-label="Cargando">
                <span className="spinner" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="settings-block">
        <div className="label">Apariencia</div>
        <div className="field">
          <div className="theme-chip-row">
            {themeOptions().map((o) => (
              <button key={o.value} type="button" className={'theme-chip' + (theme === o.value ? ' active' : '')} onClick={() => { setTheme(o.value); setThemePref(o.value); }}>{o.label}</button>
            ))}
            {DEV_THEME_META[theme] && (
              <div className="theme-dev-box">
                <img className="theme-dev-logo" src={DEV_THEME_META[theme].logo} alt="" />
                <span>Tema oculto activo: <b>{DEV_THEME_META[theme].name}</b></span>
              </div>
            )}
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
        <div className="label">App instalada</div>
        <div className="field">
          {installable.installed ? (
            <p className="muted">Ya está instalada como app en este dispositivo.</p>
          ) : installable.ready ? (
            <div className="settings-row">
              <button className="button outline" onClick={installable.install} title="Instala la app en el escritorio o pantalla de inicio para que abra como una app normal, sin la barra del navegador">Instalar la app</button>
            </div>
          ) : (
            <p className="muted">Abre el sitio en Chrome y toca "Instalar app" (icono de monitor con flecha en la barra): queda como una app normal, con su icono en el escritorio y la pantalla de inicio.</p>
          )}
          <p className="muted">Instalada abre en su propia ventana, sin la barra de Chrome.</p>
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
    </Modal>
  );
}