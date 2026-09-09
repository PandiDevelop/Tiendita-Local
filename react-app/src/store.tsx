import { createContext, useCallback, useContext, useEffect, useRef, ReactNode, useState } from 'react';
import type { AppState, Store, Tab } from './types';
import { loadState, saveState, syncClientId, NOTE_TTL_MS } from './lib/core';
import { createSync, applyRemote, activateSync, joinStore, SyncHandle } from './lib/sync';
import { archiveUpsert, archiveMarkGone, noteToArchiveEntry, replyToArchiveEntry } from './lib/notesArchive';
import { playNoteChime, showSystemNotification } from './lib/sound';
import { soundEnabled } from './lib/settings';
import type { Note } from './types';

export type ModalKind = 'none' | 'sale' | 'newProduct' | 'editProduct' | 'newStore' | 'editStore' | 'join' | 'settings';

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
  detach: (id: string) => void;
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
    // Cada notificación de la app también llega al centro de notificaciones
    // del teléfono (solo cuando la app no está a la vista y hay permiso; ver
    // showSystemNotification en lib/sound.ts). Así, si un compañero deja una
    // nota, una tienda se cae de la nube o algo necesita atención, el aviso
    // aparece como en cualquier app de teléfono, no solo dentro de la app.
    const st = stateRef.current.stores.find((x) => x.id === stateRef.current.activeStoreId) || stateRef.current.stores[0];
    showSystemNotification(st ? st.name : 'Mi Tiendita', m);
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
  // OJO (bug arreglado): antes StoreModal.tsx le pasaba "attach" a
  // deactivateSyncFn/leaveStoreFn/deleteStoreFn en el lugar donde esas
  // funciones esperan un "detach" (no habia ningun detach expuesto por el
  // contexto). Eso hacia que "desactivar sincronizacion"/"salir de la
  // tienda"/"borrar tienda" en realidad VOLVIERAN A SUSCRIBIR el listener
  // de Firestore en vez de cerrarlo: la tienda seguia recibiendo cambios
  // remotos (incluidas notas) aunque la app ya no la mostrara como
  // sincronizada, hasta recargar la pagina a mano.
  const detach = useCallback((id: string) => { sync.current!.detach(id); }, []);
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

  // Notas del equipo: sonido + toast (y aviso del sistema si la app esta en
  // segundo plano) cuando llega una nota o respuesta nueva de alguien mas, y
  // de paso alimenta el log local descargable (ver lib/notesArchive.ts) con
  // todo lo que este dispositivo alcanza a ver pasar por la tienda activa,
  // incluido lo que ya se borro o expiro. Vive aca (no en Notes.tsx) para
  // que el aviso suene aunque la persona este en otra pestaña de la app.
  const prevNotesRef = useRef<Map<string, Note>>(new Map());
  const prevNotesStoreRef = useRef<string | null>(null);
  useEffect(() => {
    const s = active;
    if (!s) return;
    const storeId = s.id;
    // Primera vez que se ve esta tienda en esta sesion (o se cambio de
    // tienda activa): solo se toma una foto de referencia, sin avisar ni
    // archivar nada (para no disparar un sonido con todas las notas viejas
    // apenas se abre la app).
    const firstLook = prevNotesStoreRef.current !== storeId;
    const prevMap = firstLook ? new Map<string, Note>() : prevNotesRef.current;
    const nextMap = new Map<string, Note>();
    const me = syncClientId();
    let notify = 0;
    (s.noteBoard || []).forEach((n) => {
      const prev = prevMap.get(n.id);
      if (!prev) {
        if (!firstLook) {
          if (n.by !== me) notify++;
          archiveUpsert(storeId, noteToArchiveEntry(n));
        }
      } else if (prev.text !== n.text || prev.editedAt !== n.editedAt || !!prev.pinned !== !!n.pinned) {
        archiveUpsert(storeId, noteToArchiveEntry(n));
      }
      const prevReplies = new Map((prev?.replies || []).map((r) => [r.id, r]));
      (n.replies || []).forEach((r) => {
        const pr = prevReplies.get(r.id);
        if (!pr) {
          if (!firstLook) {
            if (r.by !== me) notify++;
            archiveUpsert(storeId, replyToArchiveEntry(n.id, r));
          }
        } else if (pr.text !== r.text || pr.editedAt !== r.editedAt) {
          archiveUpsert(storeId, replyToArchiveEntry(n.id, r));
        }
      });
      if (!firstLook) {
        prevReplies.forEach((_, rid) => {
          if (!(n.replies || []).some((x) => x.id === rid)) archiveMarkGone(storeId, rid, 'eliminada');
        });
      }
      nextMap.set(n.id, n);
    });
    if (!firstLook) {
      prevMap.forEach((n, id) => {
        if (nextMap.has(id)) return;
        const expired = !n.pinned && Date.now() - (n.createdAt || 0) > NOTE_TTL_MS;
        archiveMarkGone(storeId, id, expired ? 'expirada' : 'eliminada');
      });
    }
    prevNotesRef.current = nextMap;
    prevNotesStoreRef.current = storeId;
    if (notify > 0) {
      // El sonido es una preferencia de cada dispositivo (ver Opciones); el
      // aviso visual (toast) y el del sistema se muestran siempre.
      if (soundEnabled()) playNoteChime();
      const msg = notify === 1 ? 'Nueva nota del equipo' : notify + ' novedades en Notas';
      // El toast ya enruta el aviso al sistema (ver toast en este archivo),
      // así que aquí solo se suena y se muestra dentro de la app.
      toast(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const value: Ctx = { state, store: active, replace, setTab, modal, setModal, modalArg, setModalArg, toastMsg, toast, attach, detach, activate, join };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}