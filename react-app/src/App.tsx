import { useEffect, useState } from 'react';
import { useStore, type ModalKind } from './store';
import { DEFAULT_STORE_IMAGE, canManageTeam, esc } from './lib/core';
import { useAppVersion } from './lib/appVersion';
import { initDeepLink, readDeepTab } from './lib/deepLink';
import { pushOverlay } from './lib/backStack';
import { DialogHost, GearIcon, Image, ImageLightboxHost, Logo, MenuIcon, Toast } from './ui';
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

export function App() {
  const { state, store, setTab, replace, modal, modalArg, setModal, toastMsg } = useStore();
  const s = store;
  const version = useAppVersion();
  const [menuOpen, setMenuOpen] = useState(false);
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
    </>
  );

  if (!s) {
    return (
      <>
        <main className="content landing-wrap">
          <div className="landing">
            <Logo size={88} />
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
        <div className="brand"><Logo size={36} /><span className="brand-text">mi<span className="brand-accent">tiendita</span></span></div>
        <div className="label">Mis tiendas</div>
        <div className="store-list">
          {state.stores.map((x) => (
            <button key={x.id} className={'store-pill ' + (x.id === state.activeStoreId ? 'active' : '')} onClick={() => selectStore(x.id)}>
              <Image src={x.image || DEFAULT_STORE_IMAGE} cls="store-thumb" enlarge={false} />
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
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><MenuIcon /></button>
          <button className="new-store" onClick={() => openModal('newStore')}>＋ Nueva tienda</button>
          <button className="sync-join" onClick={() => openModal('join')}>Unirme a una tienda</button>
        </div>
        <div className="topline">
          <div className="store-title">
            <Image src={s.image} cls="store-logo" />
            <div><div className="eyebrow">Tu tienda</div><h1>{esc(s.name)}</h1></div>
          </div>
          <button className="button secondary" onClick={() => setModal('editStore')}><GearIcon size={15} /> Editar tienda</button>
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