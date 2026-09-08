import { useEffect, useState } from 'react';
import { useStore } from './store';
import { APP_VERSION, DEFAULT_STORE_IMAGE, canManageTeam, esc } from './lib/core';
import { DialogHost, Image, Toast } from './ui';
import { Dashboard } from './views/Dashboard';
import { Catalog } from './views/Catalog';
import { Inventory } from './views/Inventory';
import { Profit } from './views/Profit';
import { Notes } from './views/Notes';
import { Employees } from './views/Employees';
import { StoreModal } from './views/StoreModal';
import { JoinModal } from './views/Join';
import { ProductForm } from './views/ProductForm';
import { SaleRegistration } from './views/SaleRegistration';

export function App() {
  const { state, store, setTab, replace, modal, modalArg, setModal, toastMsg } = useStore();
  const s = store;
  const [menuOpen, setMenuOpen] = useState(false);
  // Dueño real o admin (permiso que el dueño le dio a un trabajador): ambos
  // ven la pestaña de Empleados.
  const owner = !s || canManageTeam(s);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => { document.body.classList.remove('menu-open'); };
  }, [menuOpen]);

  function setMenu(v: boolean) { setMenuOpen(v); }

  function selectStore(id: string) {
    replace((d) => { d.activeStoreId = id; d.tab = 'inicio'; });
    setMenu(false);
  }

  const modals = (
    <>
      {modal === 'newStore' && <StoreModal onClose={() => setModal('none')} />}
      {modal === 'editStore' && <StoreModal editing onClose={() => setModal('none')} />}
      {modal === 'join' && <JoinModal onClose={() => setModal('none')} />}
      {modal === 'newProduct' && <ProductForm onClose={() => setModal('none')} />}
      {modal === 'editProduct' && <ProductForm editingId={modalArg} onClose={() => setModal('none')} />}
      {modal === 'sale' && <SaleRegistration onClose={() => setModal('none')} />}
    </>
  );

  if (!s) {
    return (
      <>
        <main className="content">
          <div className="empty">
            <div className="shop-hero">📦</div>
            <h1>Crea tu primera tienda</h1>
            <p>Organiza productos, promociones y ventas diarias en un solo lugar.</p>
            <button className="button primary" onClick={() => setModal('newStore')}>Crear mi primera tienda</button>
            <button className="button secondary" style={{ marginTop: 12 }} onClick={() => setModal('join')}>Unirme a una tienda</button>
          </div>
        </main>
        {modals}
        <Toast message={toastMsg} />
        <DialogHost />
      </>
    );
  }

  return (
    <>
      <div className="sidebar">
        <div className="brand">mi<span>tiendita</span></div>
        <div className="label">Mis tiendas</div>
        <div className="store-list">
          {state.stores.map((x) => (
            <button key={x.id} className={'store-pill ' + (x.id === state.activeStoreId ? 'active' : '')} onClick={() => selectStore(x.id)}>
              <Image src={x.image || DEFAULT_STORE_IMAGE} cls="store-thumb" />
              <span>{esc(x.name)}</span>
            </button>
          ))}
        </div>
        <button className="new-store" onClick={() => setModal('newStore')}>＋ Nueva tienda</button>
        <button className="sync-join" onClick={() => setModal('join')}>Unirme a una tienda</button>
        <div className="side-footer">Tus datos se guardan de forma local<br />en este dispositivo. v{APP_VERSION}</div>
      </div>
      <div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>
      <main className="content">
        <div className="mobile-head">
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button>
          <button className="new-store" onClick={() => setModal('newStore')}>＋ Nueva tienda</button>
          <button className="sync-join" onClick={() => setModal('join')}>Unirme a una tienda</button>
        </div>
        <div className="topline">
          <div className="store-title">
            <Image src={s.image} cls="store-logo" />
            <div><div className="eyebrow">Tu tienda</div><h1>{esc(s.name)}</h1></div>
          </div>
          <button className="button secondary" onClick={() => setModal('editStore')}>⚙ Editar tienda</button>
        </div>
        <nav className="tabs">
          {([['inicio', 'Inicio'], ['productos', 'Catálogo'], ['inventario', 'Inventario'], ['ganancias', 'Ganancias'], ['notas', 'Notas'], ['empleados', 'Empleados']] as const)
            .filter(([id]) => id !== 'empleados' || owner)
            .map(([id, l]) => (
              <button key={id} className={'tab ' + (state.tab === id ? 'active' : '')} onClick={() => setTab(id)}>{l}</button>
            ))}
        </nav>
        {state.tab === 'inicio' && <Dashboard />}
        {state.tab === 'productos' && <Catalog />}
        {state.tab === 'inventario' && <Inventory />}
        {state.tab === 'ganancias' && <Profit />}
        {state.tab === 'notas' && <Notes />}
        {state.tab === 'empleados' && <Employees />}
      </main>
      {modals}
      <Toast message={toastMsg} />
      <DialogHost />
    </>
  );
}