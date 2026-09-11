// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Catalog } from '../views/Catalog';
import { Inventory } from '../views/Inventory';
import { ProductForm } from '../views/ProductForm';
import { Employees } from '../views/Employees';
import { Profit } from '../views/Profit';
import { Notes } from '../views/Notes';
import { VirtualCatalog } from '../views/VirtualCatalog';
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

  function addTag(container: HTMLElement, value: string) {
    const input = fieldControl(/Etiqueta \/ tag/, container);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { key: 'Enter' });
  }

  it('muestra "General" como texto fantasma en un producto nuevo (sin pre-llenar)', () => {
    const { container } = setup(makeStore());
    const tagInput = fieldControl(/Etiqueta \/ tag/, container);
    expect(tagInput.value).toBe('');
    expect(tagInput.placeholder).toBe('General');
  });

  it('si se deja el tag vacío, se agrega automáticamente "General"', () => {
    const { container, stateRef } = setup(makeStore());
    fireEvent.change(fieldControl('Nombre del producto', container), { target: { value: 'Agua' } });
    fireEvent.change(fieldControl('Precio del producto', container), { target: { value: '1000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    const saved = stateRef.current.stores[0].products[0];
    expect(saved.name).toBe('Agua');
    expect(saved.tags).toEqual([DEFAULT_PRODUCT_TAG]);
    expect(saved.tag).toBe(DEFAULT_PRODUCT_TAG);
  });

  it('permite agregar hasta 3 etiquetas y guarda la lista completa', () => {
    const { container, stateRef } = setup(makeStore());
    fireEvent.change(fieldControl('Nombre del producto', container), { target: { value: 'Jugo' } });
    fireEvent.change(fieldControl('Precio del producto', container), { target: { value: '2000' } });
    addTag(container, 'oferta');
    addTag(container, 'vitrina');
    addTag(container, 'nuevo');
    // Con 3 tags el campo para agregar desaparece: el cuarto nunca entra.
    expect(document.querySelectorAll('.tag-editor input').length).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    const saved = stateRef.current.stores[0].products[0];
    // El cuarto tag no entra: quedan solo 3, y el campo que agregaba tags
    // desaparecio al llegar al maximo.
    expect(saved.tags).toEqual(['oferta', 'vitrina', 'nuevo']);
    expect(saved.tag).toBe('oferta');
  });

  it('al editar, muestra los tags propios del producto (no el default) y permite quitarlos', () => {
    const custom = makeProduct({ name: 'Con tag', tags: ['promo', 'verano'] });
    const store = makeStore({ products: [custom] });
    const { container, stateRef } = setup(store, custom.id);
    const chips = Array.from(document.querySelectorAll('.tag-chip'));
    expect(chips).toHaveLength(2);
    expect(chips[0].textContent).toContain('promo');
    // Quitar el primer tag y agregar uno nuevo.
    fireEvent.click(chips[0].querySelector('button')!);
    addTag(container, 'oferta');
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    const saved = stateRef.current.stores[0].products[0];
    expect(saved.tags).not.toContain('promo');
    expect(saved.tags).toEqual(['verano', 'oferta']);
  });

  it('al editar un producto sin tag, el campo queda vacío (no fuerza el default)', () => {
    const bare = makeProduct({ name: 'Sin tag' });
    const store = makeStore({ products: [bare] });
    const { container } = setup(store, bare.id);
    const tagInput = fieldControl(/Etiqueta \/ tag/, container);
    expect(tagInput.value).toBe('');
    expect(document.querySelectorAll('.tag-chip')).toHaveLength(0);
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

  it('las listas de objetivos muestran cuántas quedan pendientes y "Completado" al terminar', () => {
    const now = Date.now();
    const store = makeStore({
      noteBoard: [
        { id: 'n2', kind: 'checklist', text: 'Metas', items: [
          { id: 'i1', text: 'Abrir', done: false },
          { id: 'i2', text: 'Cobrar', done: false },
        ], by: 'owner-1', byName: 'Ana', createdAt: now, date: '09/09/2026', time: '11:00' },
      ],
    });
    const { container } = render(<TestProvider initialState={makeState(store)}><Notes /></TestProvider>);
    fireEvent.click(screen.getByRole('button', { name: /Objetivos/ }));
    expect(screen.getByText('2 objetivos pendientes')).toBeInTheDocument();

    const checks = Array.from(container.querySelectorAll('.note-check input')) as HTMLInputElement[];
    fireEvent.click(checks[0]);
    expect(screen.getByText('1 objetivo pendiente')).toBeInTheDocument();
    fireEvent.click(checks[1]);
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.queryByText('2 objetivos pendientes')).not.toBeInTheDocument();
  });

  it('al editar una lista se pueden cambiar sus objetivos (editar texto y agregar)', () => {
    localStorage.setItem(CLIENT_KEY, 'owner-1');
    const now = Date.now();
    const store = makeStore({
      noteBoard: [
        { id: 'n2', kind: 'checklist', text: 'Metas', items: [{ id: 'i1', text: 'Abrir', done: false }], by: 'owner-1', byName: 'Ana', createdAt: now, date: '09/09/2026', time: '11:00' },
      ],
    });
    const state = makeState(store);
    const stateRef = { current: state };
    const { container } = render(<TestProvider initialState={state} stateRef={stateRef}><Notes /></TestProvider>);
    fireEvent.click(screen.getByRole('button', { name: /Objetivos/ }));

    fireEvent.click(screen.getByTitle('Opciones'));
    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));

    const editBox = container.querySelector('.checklist-edit-box') as HTMLElement;
    expect(editBox).not.toBeNull();
    const itemInput = editBox.querySelector('.checklist-edit-item') as HTMLInputElement;
    expect(itemInput.value).toBe('Abrir');
    fireEvent.change(itemInput, { target: { value: 'Abrir la tienda' } });

    const addInput = editBox.querySelector('.checklist-add-row input') as HTMLInputElement;
    fireEvent.change(addInput, { target: { value: 'Cerrar bien' } });
    fireEvent.click(editBox.querySelector('.checklist-add-row .button') as HTMLElement);

    const saveBtn = Array.from(editBox.querySelectorAll('button')).find((b) => b.textContent === 'Guardar') as HTMLElement;
    fireEvent.click(saveBtn);

    const n = stateRef.current.stores[0].noteBoard[0] as { text: string; items: { id: string; text: string; done: boolean }[] };
    expect(n.text).toBe('Metas');
    expect(n.items).toHaveLength(2);
    expect(n.items[0].text).toBe('Abrir la tienda');
    expect(n.items[0].id).toBe('i1');
    expect(n.items[0].done).toBe(false);
    expect(n.items[1].text).toBe('Cerrar bien');
    expect(n.items[1].done).toBe(false);
  });
});

describe('Ganancias: íconos SVG en vez de emoji, ícono antes que texto', () => {
  it('cada tarjeta de estadística muestra un SVG antes del texto, sin emojis', () => {
    const store = makeStore();
    const { container } = render(<TestProvider initialState={makeState(store)}><Profit /></TestProvider>);

    const cards = container.querySelectorAll('.card.stat.stat-h');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      const first = card.firstElementChild;
      expect(first).toHaveClass('stat-icon');
      expect(first?.querySelector('svg')).toBeTruthy();
    });

    // eslint-disable-next-line no-misleading-character-class
    expect(container.textContent).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });
});

describe('Buscador de productos en Catálogo e Inventario', () => {
  it('Catálogo: al escribir, solo quedan las categorías con coincidencias (por nombre o tag)', () => {
    const store = makeStore({
      categories: ['Bebidas', 'Snacks'],
      products: [
        makeProduct({ id: 'p1', name: 'Agua', category: 'Bebidas' }),
        makeProduct({ id: 'p2', name: 'Jugo', category: 'Bebidas' }),
        makeProduct({ id: 'p3', name: 'Papas', category: 'Snacks', tag: 'executivo' }),
      ],
    });
    render(<TestProvider initialState={makeState(store)}><Catalog /></TestProvider>);
    expect(screen.getByText('Agua')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Buscar producto…') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'j' } });
    expect(screen.getByText('Jugo')).toBeInTheDocument();
    expect(screen.queryByText('Agua')).not.toBeInTheDocument();
    expect(screen.queryByText('Papas')).not.toBeInTheDocument();
    expect(screen.queryByText('Snacks')).not.toBeInTheDocument();
    expect(screen.getByText(/1 resultado/)).toBeInTheDocument();

    // El filtro también busca en el tag.
    fireEvent.change(input, { target: { value: 'executivo' } });
    expect(screen.getByText('Papas')).toBeInTheDocument();

    // Sin coincidencias: aviso, sin productos a la vista.
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText(/No se encontraron productos/)).toBeInTheDocument();
    expect(screen.queryByText('Jugo')).not.toBeInTheDocument();
  });

  it('Inventario: mismo filtro en vivo sobre las existencias (modo Existencias)', () => {
    const store = makeStore({
      categories: ['Bebidas', 'Snacks'],
      products: [
        makeProduct({ id: 'p1', name: 'Agua', category: 'Bebidas' }),
        makeProduct({ id: 'p2', name: 'Jugo', category: 'Bebidas' }),
        makeProduct({ id: 'p3', name: 'Papas', category: 'Snacks' }),
      ],
      inventory: { p1: 5, p2: 3, p3: 8 },
    });
    render(<TestProvider initialState={makeState(store)}><Inventory /></TestProvider>);
    expect(screen.getByText('Agua')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Buscar producto…') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'jugo' } });
    expect(screen.getByText('Jugo')).toBeInTheDocument();
    expect(screen.queryByText('Agua')).not.toBeInTheDocument();
    expect(screen.queryByText('Papas')).not.toBeInTheDocument();
    expect(screen.getByText(/1 resultado/)).toBeInTheDocument();
  });
});

describe('Libro de catálogo virtual', () => {
  it('muestra todos los productos separados por categoría con imagen, nombre y precio', () => {
    const store = makeStore({
      categories: ['Bebidas', 'Snacks'],
      products: [
        makeProduct({ id: 'p1', name: 'Agua', price: 1500, category: 'Bebidas', image: 'data:image/png;base64,AAA' }),
        makeProduct({ id: 'p2', name: 'Papas', price: 2000, category: 'Snacks' }),
      ],
    });
    render(<TestProvider initialState={makeState(store)}><VirtualCatalog onClose={() => {}} /></TestProvider>);
    // El catálogo se monta con un portal directo a <body> (para que el
    // impreso no quede dentro de .content, que se oculta al imprimir).
    const body = document.body.querySelector('.vc-body') as HTMLElement;
    expect(within(body).getByText('Bebidas')).toBeInTheDocument();
    expect(within(body).getByText('Snacks')).toBeInTheDocument();
    expect(within(body).getByText('Agua')).toBeInTheDocument();
    expect(within(body).getByText('Papas')).toBeInTheDocument();
    expect(within(body).getByText(/\$[\s\u00a0]*1\.500/)).toBeInTheDocument();
    expect(within(body).getByText(/\$[\s\u00a0]*2\.000/)).toBeInTheDocument();
    const card = within(body).getByText('Agua').closest('.vc-card') as HTMLElement;
    expect(card.querySelector('img.vc-img')).toBeTruthy();
  });

  it('se abre desde el botón "Ver catálogo" de Catálogo', () => {
    const store = makeStore({ products: [makeProduct({ id: 'p1', name: 'Agua', price: 1000, category: 'Bebidas' })] });
    render(<TestProvider initialState={makeState(store)}><Catalog /></TestProvider>);
    fireEvent.click(screen.getByRole('button', { name: /Ver catálogo/ }));
    expect(screen.getByText(/Catálogo virtual/)).toBeInTheDocument();
    expect(screen.getAllByText('Agua').length).toBeGreaterThan(0);
  });

  it('prepara el impreso: botón Imprimir, portada de categoría, nombre de la tienda y 4 productos por página', () => {
    const products = Array.from({ length: 5 }, (_, i) => makeProduct({ id: 'p' + i, name: 'Producto ' + i, price: 1000, category: 'Bebidas' }));
    const store = makeStore({ categories: ['Bebidas'], products });
    render(<TestProvider initialState={makeState(store)}><VirtualCatalog onClose={() => {}} /></TestProvider>);
    expect(screen.getByRole('button', { name: /Imprimir/ })).toBeInTheDocument();
    // 5 productos → 1 portada de la categoría + 2 hojas (4 y 1).
    expect(document.body.querySelectorAll('.print-catalog .pc-page').length).toBe(3);
    expect(document.body.querySelectorAll('.print-catalog .pc-cover').length).toBe(1);
    expect(document.body.querySelectorAll('.print-catalog .pc-grid').length).toBe(2);
    expect(document.body.querySelectorAll('.print-catalog .pc-card').length).toBe(5);
    const cover = document.body.querySelector('.print-catalog .pc-cover h2') as HTMLElement;
    expect(cover.textContent).toBe('Bebidas');
    // El impreso se llama "Catálogo" y muestra el nombre de la tienda.
    expect((document.body.querySelector('.print-catalog .pc-brand') as HTMLElement).textContent).toContain('Catálogo');
    expect((document.body.querySelector('.print-catalog .pc-brand') as HTMLElement).textContent).toContain('Tienda de prueba');
    expect((document.body.querySelector('.print-catalog') as HTMLElement).getAttribute('data-store')).toBe('Tienda de prueba');
  });

  it('el botón atrás del celular cierra el catálogo virtual en vez de salir', () => {
    const onClose = vi.fn();
    const store = makeStore({ products: [makeProduct({ id: 'p1', name: 'Agua', price: 1000, category: 'Bebidas' })] });
    render(<TestProvider initialState={makeState(store)}><VirtualCatalog onClose={onClose} /></TestProvider>);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('omite del impreso las categorías sin productos y deshabilita Imprimir sin productos', () => {
    const store = makeStore({
      categories: ['Bebidas', 'Vacía'],
      products: [makeProduct({ id: 'p1', name: 'Agua', price: 1000, category: 'Bebidas' })],
    });
    render(<TestProvider initialState={makeState(store)}><VirtualCatalog onClose={() => {}} /></TestProvider>);
    const covers = document.body.querySelectorAll('.print-catalog .pc-cover h2');
    expect(covers.length).toBe(1);
    expect(covers[0].textContent).toBe('Bebidas');
    expect(document.body.querySelector('.print-catalog')).toBeTruthy();

    cleanup();
    const empty = makeStore({ products: [] });
    render(<TestProvider initialState={makeState(empty)}><VirtualCatalog onClose={() => {}} /></TestProvider>);
    expect(screen.getByRole('button', { name: /Imprimir/ })).toBeDisabled();
    expect(document.body.querySelector('.print-catalog')).toBeNull();
  });
});
