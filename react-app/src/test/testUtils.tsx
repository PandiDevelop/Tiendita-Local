import { ReactNode, useCallback, useRef, useState } from 'react';
import { AppCtx, ModalKind } from '../store';
import { makeDraft, normalizeStore, uid } from '../lib/core';
import type { AppState, Product, Store } from '../types';

// Arnes de pruebas: reproduce el mismo contrato que AppProvider (store.tsx)
// pero sin localStorage ni Firebase, para poder montar cada vista (Catalog,
// Inventory, ProductForm, Employees, Profit) con un estado controlado y
// verificar que replace() muto lo que se espera. Al no desmontarse entre
// renders (mismo tipo de componente, misma posicion), su estado interno
// sobrevive a un rerender() de Testing Library: asi se puede simular el
// cambio de pestana (Catalogo <-> Inventario) sobre el MISMO AppState, igual
// que hace App.tsx, para probar que las categorias abiertas son independientes
// por pestana.
export function TestProvider({ initialState, stateRef, children }: { initialState: AppState; stateRef?: { current: AppState }; children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const ref = useRef(state);
  ref.current = state;
  if (stateRef) stateRef.current = state;
  const [modal, setModal] = useState<ModalKind>('none');
  const [modalArg, setModalArg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const replace = useCallback((updater: (draft: AppState) => void) => {
    const next = JSON.parse(JSON.stringify(ref.current)) as AppState;
    updater(next);
    ref.current = next;
    if (stateRef) stateRef.current = next;
    setState(next);
  }, [stateRef]);

  const toast = useCallback((m: string) => setToastMsg(m), []);
  const setTab = useCallback((tab: AppState['tab']) => replace((d) => { d.tab = tab; }), [replace]);
  const active = state.stores.find((s) => s.id === state.activeStoreId) ?? state.stores[0];

  const value = {
    state,
    store: active,
    replace,
    setTab,
    modal,
    setModal,
    modalArg,
    setModalArg,
    toastMsg,
    toast,
    attach: () => {},
    activate: async () => {},
    join: async () => {},
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function makeStore(overrides: Partial<Store> = {}): Store {
  return normalizeStore({
    id: overrides.id || uid(),
    name: overrides.name || 'Tienda de prueba',
    image: '',
    products: overrides.products || [],
    sales: overrides.sales || [],
    categories: overrides.categories || [],
    categoryPricing: overrides.categoryPricing || {},
    inventory: overrides.inventory || {},
    notes: '',
    noteLog: [],
    invLog: [],
    createdBy: overrides.createdBy ?? 'owner-1',
    members: overrides.members,
  } as Store);
}

export function makeState(store: Store, overrides: Partial<AppState> = {}): AppState {
  const d = makeDraft();
  return { ...d, ...overrides, stores: [store], activeStoreId: store.id };
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: overrides.id || uid(),
    name: overrides.name || 'Producto',
    price: overrides.price ?? 1000,
    cost: overrides.cost ?? 0,
    image: '',
    promos: overrides.promos || [],
    category: overrides.category ?? '',
    tag: overrides.tag,
    order: overrides.order,
  };
}

// Un <label> y su <input>/<select> viven como hermanos dentro del mismo
// .field (no hay htmlFor/id que los enlace), asi que getByLabelText no los
// encuentra: se toma el siguiente hermano del texto de la etiqueta.
export function fieldControl(labelText: string | RegExp, container: HTMLElement): HTMLInputElement {
  const labels = Array.from(container.querySelectorAll('label'));
  const label = labels.find((l) => (typeof labelText === 'string' ? l.textContent?.trim().startsWith(labelText) : labelText.test(l.textContent || '')));
  if (!label) throw new Error('No se encontro la etiqueta: ' + labelText);
  return label.nextElementSibling as HTMLInputElement;
}
