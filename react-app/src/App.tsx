import { useEffect, useRef, useState } from 'react';
import { useStore, type ModalKind } from './store';
import { canManageTeam, esc } from './lib/core';
import { useAppVersion } from './lib/appVersion';
import { initDeepLink, readDeepTab } from './lib/deepLink';
import { pushOverlay } from './lib/backStack';
import { preloadDevAssets } from './lib/preload';
import { resolvedTheme } from './lib/theme';

preloadDevAssets();
import { DialogHost, GearIcon, ImageLightboxHost, Logo, MenuIcon, StoreImage, Toast } from './ui';
import { DevThemesModal } from './views/DevThemes';
import { Dashboard } from './views/Dashboard';
import { Catalog } from './views/Catalog';
import { Inventory } from './views/Inventory';
import { Profit } from './views/Profit';
import { Notes } from './views/Notes';
import { Employees } from './views/Employees';
import { Events } from './views/Events';
import { StoreModal } from './views/StoreModal';
import { JoinModal } from './views/Join';
import { SettingsModal } from './views/SettingsModal';
import { ProductForm } from './views/ProductForm';
import { SaleRegistration } from './views/SaleRegistration';

const DEV_LOGO: Record<string, string> = {
  owen: './logo-owen.png',
  crisdeku: './logo-crisdeku.png',
  pandi: './logo-pandi.png',
};

function MenuClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <>
      <span className="clock-date">{now.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      <span className="clock-time">{now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
    </>
  );
}

export function App() {
  const { state, store, setTab, replace, modal, modalArg, setModal, toastMsg } = useStore();
  const s = store;
  const version = useAppVersion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  // La cita junto al nombre de la tienda solo aparece con un tema de dev.
  const [, setThemeTick] = useState(0);
  useEffect(() => {
    const h = () => setThemeTick((n) => n + 1);
    window.addEventListener('mt-theme-changed', h);
    return () => window.removeEventListener('mt-theme-changed', h);
  }, []);
  const t = resolvedTheme();
  const devTheme = t === 'owen' || t === 'crisdeku' || t === 'pandi';
  // Menú oculto de desarrollo: 10 toques seguidos en el logo de la app.
  const logoTaps = useRef(0);
  const logoTimer = useRef<number | undefined>(undefined);

  function tapLogo() {
    logoTaps.current += 1;
    if (logoTimer.current) window.clearTimeout(logoTimer.current);
    logoTimer.current = window.setTimeout(() => { logoTaps.current = 0; }, 1600);
    if (logoTaps.current >= 10) {
      logoTaps.current = 0;
      setMenuOpen(false);
      setDevOpen(true);
    }
  }
  // Dueño real o admin (permiso que el dueño le dio a un trabajador): ambos
  // ven la pestaña de Empleados.
  const owner = !s || canManageTeam(s);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => { document.body.classList.remove('menu-open'); };
  }, [menuOpen]);
  // El botón atrás del celular cierra el menú lateral antes de salir.
  useEffect(() => (menuOpen ? pushOverlay(() => setMenuOpen(false)) : undefined), [menuOpen]);

  // Deep link de una notificación push (?tab=notas&n=<id>): lee la pestaña
  // pedida, limpia la URL y deja la nota pendiente para que Notes la abra.
  useEffect(() => {
    initDeepLink();
    const t = readDeepTab();
    if (t) replace((d) => { d.tab = t; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMenu(v: boolean) { setMenuOpen(v); }

  // Cualquier ventana (Nueva tienda, Unirme, Opciones...) cierra primero el
  // menu lateral: si no, en celulares el menu del cambio de tienda quedaba
  // abierto por encima de la ventana recien abierta.
  function openModal(m: ModalKind) { setMenuOpen(false); setModal(m); }

  function selectStore(id: string) {
    replace((d) => { d.activeStoreId = id; d.tab = 'inicio'; });
    setMenu(false);
  }

  const modals = (
    <>
      {modal === 'newStore' && <StoreModal onClose={() => setModal('none')} />}
      {modal === 'editStore' && <StoreModal editing onClose={() => setModal('none')} />}
      {modal === 'join' && <JoinModal onClose={() => setModal('none')} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal('none')} />}
      {modal === 'newProduct' && <ProductForm onClose={() => setModal('none')} />}
      {modal === 'editProduct' && <ProductForm editingId={modalArg} onClose={() => setModal('none')} />}
      {modal === 'sale' && <SaleRegistration onClose={() => setModal('none')} />}
      {devOpen && <DevThemesModal onClose={() => setDevOpen(false)} />}
    </>
  );

  if (!s) {
    return (
      <>
        <main className="content landing-wrap">
          <button className="gear-btn landing-gear" onClick={() => openModal('settings')} title="Opciones: nombre, notificaciones, sonido y descargas de registros. También sirve para restaurar una tienda borrada"><GearIcon size={18} /></button>
          <div className="landing">
            <button className="brand-logo-btn" onClick={tapLogo} title=""><Logo size={88} /></button>
            <h1 className="landing-title">mi<span>tiendita</span></h1>
            <p className="landing-tag">Organiza productos, promociones y ventas diarias en un solo lugar.</p>
            <div className="landing-feats">
              <span>Catálogo y existencias</span>
              <span>Ventas y ganancias</span>
              <span>Notas del equipo</span>
            </div>
            <div className="landing-actions">
              <button className="button primary" onClick={() => openModal('newStore')}>Crear mi primera tienda</button>
              <button className="button secondary" onClick={() => openModal('join')}>Unirme a una tienda</button>
            </div>
            <p className="landing-note">Tus datos se guardan en este dispositivo; si lo deseas, se sincronizan en tiempo real con tu equipo.</p>
          </div>
        </main>
        {modals}
        <Toast message={toastMsg} />
        <DialogHost />
        <ImageLightboxHost />
      </>
    );
  }

  return (
    <>
      <div className="sidebar">
        <div className="brand"><button className="brand-logo-btn" onClick={tapLogo} title=""><Logo size={36} /></button><span className="brand-text">mi<span className="brand-accent">tiendita</span></span></div>
        <div className="label">Mis tiendas</div>
        <div className="store-list">
          {state.stores.map((x) => (
            <button key={x.id} className={'store-pill ' + (x.id === state.activeStoreId ? 'active' : '')} onClick={() => selectStore(x.id)}>
              <StoreImage src={x.image} cls="store-thumb" alt={'Logo de ' + esc(x.name)} enlarge={false} />
              <span>{esc(x.name)}</span>
            </button>
          ))}
        </div>
        <button className="new-store" onClick={() => openModal('newStore')}>＋ Nueva tienda</button>
        <button className="sync-join" onClick={() => openModal('join')}>Unirme a una tienda</button>
        <button className="app-settings" onClick={() => openModal('settings')} title="Nombre, notificaciones, sonido y versión"><GearIcon size={15} /> Opciones</button>
        <div className="side-footer">Tus datos se guardan de forma local<br />en este dispositivo. v{version}</div>
      </div>
      <div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>
      <main className="content">
        <div className="mobile-head">
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú" title="Abrir menú"><MenuIcon /><span className="menu-clock"><MenuClock /></span></button>
        </div>
        <div className="topline">
          <div className="store-title">
            <StoreImage src={s.image} cls="store-logo" alt={'Logo de ' + esc(s.name)} />
            <div style={{ minWidth: 0 }}><div className="eyebrow">Tu tienda</div><h1>{esc(s.name)}</h1></div>
            <div className="store-actions">
              <button className="button secondary" onClick={() => setModal('editStore')}><GearIcon size={15} /> Editar tienda</button>
              {devTheme && <span className="store-quote"><img className="store-quote-logo" src={DEV_LOGO[t]} alt="" />Mereces lo que sueñas</span>}
            </div>
          </div>
        </div>
        <nav className="tabs">
          {([['inicio', 'Inicio'], ['ganancias', 'Ganancias'], ['eventos', 'Eventos'], ['productos', 'Catálogo'], ['inventario', 'Inventario'], ['empleados', 'Empleados'], ['notas', 'Notas']] as const)
            .filter(([id]) => id !== 'empleados' || owner)
            .filter(([id]) => id !== 'eventos' || owner)
            .map(([id, l]) => (
              <button key={id} className={'tab ' + (state.tab === id ? 'active' : '')} onClick={() => setTab(id)}>{l}</button>
            ))}
        </nav>
        {state.tab === 'inicio' && <Dashboard />}
        {state.tab === 'ganancias' && <Profit />}
        {state.tab === 'eventos' && <Events />}
        {state.tab === 'productos' && <Catalog />}
        {state.tab === 'inventario' && <Inventory />}
        {state.tab === 'notas' && <Notes />}
        {state.tab === 'empleados' && <Employees />}
      </main>
      {modals}
      <Toast message={toastMsg} />
      <DialogHost />
      <ImageLightboxHost />
    </>
  );
}