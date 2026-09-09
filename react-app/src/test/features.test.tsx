// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Catalog } from '../views/Catalog';
import { Inventory } from '../views/Inventory';
import { ProductForm } from '../views/ProductForm';
import { Employees } from '../views/Employees';
import { Profit } from '../views/Profit';
import { Notes } from '../views/Notes';
import { CLIENT_KEY, DEFAULT_PRODUCT_TAG } from '../lib/core';
import { TestProvider, fieldControl, makeProduct, makeState, makeStore } from './testUtils';
import type { AppState, Store } from '../types';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

// Va primero a propósito: este test depende de que nadie haya cacheado el id
// de cliente todavía. syncClientId() (lib/core.ts) cachea en una variable de
// módulo la primera vez que se llama, y los tests de abajo (p.ej. guardar un
// producto nuevo en ProductForm, que ahora firma el producto con "by") ya lo
// cachean; si este test corriera después, "tú" no se marcaría.
describe('Empleados: lista del equipo con su rol', () => {
  it('muestra cada miembro con su rol correspondiente y marca "tú"', () => {
    localStorage.setItem(CLIENT_KEY, 'owner-1');
    const store = makeStore({
      createdBy: 'owner-1',
      members: {
        'owner-1': { name: 'Ana', role: 'owner', joinedAt: Date.now() },
        'admin-1': { name: 'Luis', role: 'admin', joinedAt: Date.now() },
        'worker-1': { name: 'Sofía', role: 'worker', joinedAt: Date.now() },
      },
    });
    const { container } = render(<TestProvider initialState={makeState(store)}><Employees /></TestProvider>);

    function roleOf(name: string): string | null | undefined {
      const row = Array.from(container.querySelectorAll('.team-row')).find((r) => r.querySelector('.team-name')?.textContent?.startsWith(name));
      expect(row).toBeTruthy();
      return row?.querySelector('.role-pill')?.textContent;
    }

    expect(roleOf('Ana')).toBe('Dueño');
    expect(roleOf('Luis')).toBe('Administrador');
    expect(roleOf('Sofía')).toBe('Trabajador');

    const anaRow = Array.from(container.querySelectorAll('.team-row')).find((r) => r.querySelector('.team-name')?.textContent?.startsWith('Ana'));
    expect(anaRow?.querySelector('.team-me')?.textContent).toBe('tú');
  });
});

describe('Icono de configuración de categoría (tuerca, no moneda)', () => {
  const headerGear = (container: HTMLElement) =>
    container.querySelector('.cat-head .actions button[title="Opciones"]') as HTMLButtonElement | null;

  it('Catálogo muestra una tuerca (SVG) en el encabezado de la categoría', () => {
    const store = makeStore({ categories: ['Bebidas'], products: [makeProduct({ category: 'Bebidas' })] });
    const { container } = render(<TestProvider initialState={makeState(store)}><Catalog /></TestProvider>);
    const gear = headerGear(container);
    expect(gear).not.toBeNull();
    expect(gear!.querySelector('svg')).not.toBeNull();
    expect(gear!.textContent).not.toMatch(/[$₱฿€£¥]/);
  });

  it('Inventario usa la misma tuerca (no un ícono de peso/moneda distinto)', () => {
    const store = makeStore({ categories: ['Bebidas'], products: [makeProduct({ category: 'Bebidas' })] });
    const { container } = render(<TestProvider initialState={makeState(store)}><Inventory /></TestProvider>);
    const gear = headerGear(container);
    expect(gear).not.toBeNull();
    expect(gear!.querySelector('svg')).not.toBeNull();
    expect(gear!.textContent).not.toMatch(/[$₱฿€£¥]/);
  });
});

function Switcher({ tab }: { tab: 'cat' | 'inv' }) {
  return tab === 'cat' ? <Catalog /> : <Inventory />;
}

describe('Apertura de categorías independiente por pestaña', () => {
  it('colapsar una categoría en Catálogo no la colapsa en Inventario, y viceversa', () => {
    const store = makeStore({ categories: ['Bebidas'], products: [makeProduct({ name: 'Agua', category: 'Bebidas' })] });
    const state = makeState(store);
    const stateRef = { current: state };

    const { rerender } = render(
      <TestProvider initialState={state} stateRef={stateRef}><Switcher tab="cat" /></TestProvider>,
    );
    expect(screen.getByText('Agua')).toBeInTheDocument();

    // Colapsa la categoría en Catálogo.
    fireEvent.click(screen.getByRole('button', { name: /Bebidas/ }));
    expect(screen.queryByText('Agua')).not.toBeInTheDocument();

    // Mismo AppState, pero en Inventario: sigue abierta (vistas independientes).
    rerender(<TestProvider initialState={state} stateRef={stateRef}><Switcher tab="inv" /></TestProvider>);
    expect(screen.getByText('Agua')).toBeInTheDocument();

    // Colapsa también en Inventario.
    fireEvent.click(screen.getByRole('button', { name: /Bebidas/ }));
    expect(screen.queryByText('Agua')).not.toBeInTheDocument();

    // Vuelve a Catálogo: sigue colapsada ahí, sin que Inventario la haya reabierto ni al revés.
    rerender(<TestProvider initialState={state} stateRef={stateRef}><Switcher tab="cat" /></TestProvider>);
    expect(screen.queryByText('Agua')).not.toBeInTheDocument();

    expect(stateRef.current.openCats?.[store.id]).toMatchObject({ 'c:Bebidas': false, 'i:Bebidas': false });
  });
});

describe('Categorías vacías visibles en la lista', () => {
  it('una categoría recién creada (sin productos todavía) aparece en Catálogo e Inventario', () => {
    const store = makeStore({ categories: ['Postres', 'Snacks'], products: [] });
    const state = makeState(store);

    const catRender = render(<TestProvider initialState={state}><Catalog /></TestProvider>);
    expect(screen.getByText('Postres')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
    expect(screen.getAllByText('Sin productos en esta categoría todavía.')).toHaveLength(2);
    catRender.unmount();

    render(<TestProvider initialState={state}><Inventory /></TestProvider>);
    expect(screen.getByText('Postres')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
  });
});

describe('Tag opcional del producto', () => {
  function setup(store: Store, editingId?: string) {
    const state: AppState = makeState(store);
    const stateRef = { current: state };
    const utils = render(
      <TestProvider initialState={state} stateRef={stateRef}>
        <ProductForm editingId={editingId} onClose={() => {}} />
      </TestProvider>,
    );
    return { ...utils, stateRef };
  }

  it('sugiere el tag por defecto al crear un producto nuevo', () => {
    const { container } = setup(makeStore());
    const tagInput = fieldControl(/Etiqueta \/ tag/, container);
    expect(tagInput.value).toBe(DEFAULT_PRODUCT_TAG);
  });

  it('el tag no es obligatorio: se puede dejar en blanco al guardar', () => {
    const { container, stateRef } = setup(makeStore());
    fireEvent.change(fieldControl('Nombre del producto', container), { target: { value: 'Agua' } });
    fireEvent.change(fieldControl('Precio del producto', container), { target: { value: '1000' } });
    fireEvent.change(fieldControl(/Etiqueta \/ tag/, container), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    const saved = stateRef.current.stores[0].products[0];
    expect(saved.name).toBe('Agua');
    expect(saved.tag).toBeUndefined();
  });

  it('si no se toca el campo, guarda el tag sugerido por defecto', () => {
    const { container, stateRef } = setup(makeStore());
    fireEvent.change(fieldControl('Nombre del producto', container), { target: { value: 'Jugo' } });
    fireEvent.change(fieldControl('Precio del producto', container), { target: { value: '2000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(stateRef.current.stores[0].products[0].tag).toBe(DEFAULT_PRODUCT_TAG);
  });

  it('al editar, muestra el tag propio del producto (no el default) y permite cambiarlo', () => {
    const custom = makeProduct({ name: 'Con tag', tag: 'promo' });
    const store = makeStore({ products: [custom] });
    const { container, stateRef } = setup(store, custom.id);
    const tagInput = fieldControl(/Etiqueta \/ tag/, container);
    expect(tagInput.value).toBe('promo');
    fireEvent.change(tagInput, { target: { value: 'oferta' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(stateRef.current.stores[0].products[0].tag).toBe('oferta');
  });

  it('al editar un producto sin tag, el campo queda vacío (no fuerza el default)', () => {
    const bare = makeProduct({ name: 'Sin tag' });
    const store = makeStore({ products: [bare] });
    const { container } = setup(store, bare.id);
    const tagInput = fieldControl(/Etiqueta \/ tag/, container);
    expect(tagInput.value).toBe('');
  });
});

describe('Notas: historiales separados por pestaña', () => {
  it('las notas solo se ven en la pestaña Notas y los objetivos en Objetivos', () => {
    const now = Date.now();
    const store = makeStore({
      noteBoard: [
        { id: 'n1', kind: 'text', text: 'Comprar pan', by: 'owner-1', byName: 'Ana', createdAt: now, date: '09/09/2026', time: '10:00' },
        { id: 'n2', kind: 'checklist', text: 'Metas', items: [{ id: 'i1', text: 'Abrir', done: false }], by: 'owner-1', byName: 'Ana', createdAt: now + 1, date: '09/09/2026', time: '11:00' },
      ],
    });
    render(<TestProvider initialState={makeState(store)}><Notes /></TestProvider>);
    expect(screen.getByText('Comprar pan')).toBeInTheDocument();
    expect(screen.queryByText('Metas')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Objetivos/ }));
    expect(screen.getByText('Metas')).toBeInTheDocument();
    expect(screen.queryByText('Comprar pan')).not.toBeInTheDocument();
  });
});

describe('Ganancias: íconos SVG en vez de emoji, ícono antes que texto', () => {
  it('cada tarjeta de estadística muestra un SVG antes del texto, sin emojis', () => {
    const store = makeStore();
    const { container } = render(<TestProvider initialState={makeState(store)}><Profit /></TestProvider>);

    const cards = container.querySelectorAll('.card.stat');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      const first = card.firstElementChild;
      expect(first).toHaveClass('stat-icon');
      expect(first?.querySelector('svg')).toBeTruthy();
      expect(first?.nextElementSibling).toHaveClass('captioned-stat');
    });

    // eslint-disable-next-line no-misleading-character-class
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });
});
