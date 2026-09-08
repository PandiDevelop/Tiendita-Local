import { createContext, useCallback, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import type { AppState, Store, Tab } from './types';
import { loadState, saveState } from './lib/core';
import { createSync, applyRemote, activateSync, joinStore, SyncHandle } from './lib/sync';

export type ModalKind = 'none' | 'sale' | 'newProduct' | 'editProduct' | 'newStore' | 'editStore' | 'join';

export interface Ctx {
  state: AppState;
  store: Store | undefined;
  replace: (updater: (draft: AppState) => void) => void;
  setTab: (tab: Tab) => void;
  modal: ModalKind;
  setModal: (m: ModalKind) => void;
  modalArg: string;
  setModalArg: (a: string) => void;
  toastMsg: string;
  toast: (m: string) => void;
  attach: (id: string) => void;
  activate: (storeId: string, pin: string) => Promise<void>;
  join: (pin: string) => Promise<void>;
}

export const AppCtx = createContext<Ctx | null>(null);

export function useStore(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useStore must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const stateRef = useRef(state);
  stateRef.current = state;
  const [modal, setModal] = useState<ModalKind>('none');
  const [modalArg, setModalArg] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(0);

  const replace = useCallback((updater: (draft: AppState) => void) => {
    const next = JSON.parse(JSON.stringify(stateRef.current)) as AppState;
    updater(next);
    stateRef.current = next;
    saveState(next);
    setState(next);
  }, []);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 2200);
  }, []);

  const sync = useRef<SyncHandle | null>(null);
  if (!sync.current) {
    sync.current = createSync(
      () => stateRef.current,
      (storeId, remote) => applyRemote(() => stateRef.current, replace, storeId, remote),
      (storeId, msg) => {
        replace((d) => {
          d.stores = d.stores.filter((x) => x.id !== storeId);
          if (d.activeStoreId === storeId) {
            d.activeStoreId = d.stores.length ? d.stores[0].id : null;
            d.tab = 'inicio';
          }
        });
        toast(msg);
      },
      (_storeId, code) => {
        toast(
          code === 'invalid-argument'
            ? 'Uno de los productos (con su foto) supera el límite de tamaño que permite la nube: ese cambio no se guardó en este intento. Usa una foto más liviana para ese producto.'
            : code === 'permission-denied'
            ? 'La nube rechazó el guardado (permisos de Firestore). Avisa a quien administra la app.'
            : 'No se pudo sincronizar con la nube. Revisa tu conexión.'
        );
      },
    );
  }

  useEffect(() => {
    state.stores.forEach((s) => { if (s.syncKey) sync.current!.attach(s.id); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Los celulares suspenden la pestaña/app en segundo plano (y a veces
  // cortan la conexion en ese rato): el listener de Firestore deberia
  // reconectar solo, pero en la practica eso a veces tarda o se queda a
  // medias, y se siente como que "no llegan" los cambios de otros
  // dispositivos hasta que uno toca algo. Al volver a primer plano se
  // vuelve a suscribir cada tienda sincronizada: fuerza una lectura fresca
  // y garantiza que el oido en tiempo real siga vivo.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== 'visible') return;
      stateRef.current.stores.forEach((s) => { if (s.syncKey) sync.current!.attach(s.id); });
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    state.stores.forEach((s) => { if (s.syncKey) sync.current!.schedule(s.id); });
  }, [state]);

  const attach = useCallback((id: string) => { sync.current!.attach(id); }, []);
  const activate = useCallback((storeId: string, pin: string) => activateSync(storeId, pin, () => stateRef.current, replace, attach), [replace, attach]);
  const join = useCallback((pin: string) => joinStore(pin, () => stateRef.current, replace, attach), [replace, attach]);

  const active = state.stores.find((s) => s.id === state.activeStoreId) ?? state.stores[0];

  const setTab = useCallback((tab: Tab) => {
    replace((d) => {
      if (tab === 'inicio') { d.summaryPage = 0; d.summaryDate = null; d.summaryMonth = null; }
      d.tab = tab;
      if (tab !== 'inicio') d.editingSaleId = null;
    });
  }, [replace]);

  const value: Ctx = { state, store: active, replace, setTab, modal, setModal, modalArg, setModalArg, toastMsg, toast, attach, activate, join };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}