// Notificaciones push REALES: llegan aunque la app este completamente
// cerrada (no solo en otra pestaña, que es lo que ya hacia
// showSystemNotification() en sound.ts). La entrega la sigue haciendo
// Firebase Cloud Messaging (FCM), que es gratis siempre sin importar
// cuantos avisos se manden - lo que se evita es la Cloud Function de pago
// de Firebase: quien dispara el envio es un Worker propio en Cloudflare
// (gratis, sin tarjeta), ver la carpeta push-worker/ en la raiz del repo.
//
// Este archivo queda "apagado" hasta que se llenen las dos constantes de
// abajo (VAPID_PUBLIC_KEY y PUSH_WORKER_URL), porque esos dos valores
// dependen de una cuenta de Firebase/Cloudflare que solo el dueño del
// proyecto puede crear - ver push-worker/README.md para los pasos, uno
// por uno. Mientras esten vacios, enablePushForStore()/notifyStorePush()
// no hacen nada (ni truenan ni molestan): el aviso local dentro de la app
// (sonido + toast + notificacion del sistema con la pestaña en segundo
// plano) sigue funcionando exactamente igual que antes, sin depender de
// esto.
import { getToken, deleteToken, getMessaging, isSupported, type Messaging } from 'firebase/messaging';
import { writerId } from './core';
import { firebaseApp, savePushToken, removePushToken, syncReady } from './sync';
import type { NotifCat } from '../types';

// Clave publica VAPID de este proyecto de Firebase. Se genera UNA sola vez
// en Firebase Console > Configuracion del proyecto > Cloud Messaging >
// "Certificados push web" > "Generar par de claves". No es secreta (viaja
// al navegador de todas formas), pero sin ella getToken() no funciona.
export const VAPID_PUBLIC_KEY = 'BFNUyldTq43ZFSoK6V-persj79KsBs3r_And6ZZRq5lFT6fu4ufrdHUoWzaqMJ1qdtiL6Rlab_vXiBPFxHM7AP4';

// URL del Worker ya desplegado en Cloudflare (ver push-worker/), algo como
// 'https://mi-tiendita-push.<tu-usuario>.workers.dev'. Sin barra al final.
export const PUSH_WORKER_URL = 'https://mi-tiendita-push.pandi.workers.dev';

export function pushConfigured(): boolean {
  return !!VAPID_PUBLIC_KEY && !!PUSH_WORKER_URL;
}

let messaging: Messaging | null | undefined;

// Push NATIVO (app de Android, Capacitor): el WebView no dispara eventos
// 'push' de service workers, asi que los avisos reales con la app cerrada
// van por el plugin @capacitor/push-notifications (que registra un token de
// Firebase y deja que FCM lo muestre como notificacion del sistema). En
// navegador esto devuelve null y sigue el camino de siempre (firebase/
// messaging + sw.js).
interface NativePush {
  requestPermissions?: () => Promise<{ receive?: string }>;
  register?: () => Promise<void>;
  unregister?: () => Promise<void>;
  addListener?: (event: string, cb: (d: unknown) => void) => Promise<unknown>;
}
function nativePushPlugin(): NativePush | null {
  const cap = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, NativePush> } }).Capacitor;
  if (!cap || !cap.isNativePlatform || cap.isNativePlatform() !== true) return null;
  return (cap.Plugins && cap.Plugins.PushNotifications) || null;
}

// Espera el token que el plugin nativo emite en el evento 'registration'
// despues de register(). Resuelve '' si no llega (permiso negado, red, etc.).
function nextNativeToken(p: NativePush, timeoutMs = 20000): Promise<string> {
  return new Promise((resolve) => {
    let handled = false;
    const timer = setTimeout(() => {
      if (handled) return;
      handled = true;
      resolve('');
    }, timeoutMs);
    p.addListener?.('registration', (d) => {
      if (handled) return;
      handled = true;
      clearTimeout(timer);
      resolve(((d as { value?: string }) || {}).value || '');
    });
  });
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging !== undefined) return messaging;
  try {
    // isSupported() da false en navegadores/contextos sin Push API real
    // (algunos WebViews, Safari viejo, etc.): evita que getToken() truene
    // feo en esos casos.
    if (!(await isSupported())) { messaging = null; return null; }
    const app = firebaseApp();
    if (!app) { messaging = null; return null; }
    messaging = getMessaging(app);
    return messaging;
  } catch (e) {
    console.warn('FCM no disponible en este navegador:', e);
    messaging = null;
    return null;
  }
}

// Pide permiso de notificaciones si hace falta y registra el token de FCM
// de este dispositivo para la tienda dada (se guarda en Firestore via
// savePushToken, ver sync.ts). Se puede llamar de nuevo sin costo: si ya
// esta todo activado no hace nada distinto (getToken devuelve el mismo
// token si sigue siendo valido).
export async function enablePushForStore(storeKey: string): Promise<'ok' | 'unsupported' | 'denied' | 'error'> {
  if (!pushConfigured() || !storeKey || !syncReady()) return 'unsupported';
  const np = nativePushPlugin();
  if (np) {
    try {
      if (np.requestPermissions) {
        try {
          const r = await np.requestPermissions();
          if (r && r.receive === 'denied') return 'denied';
        } catch (e) {
          console.warn('No se pudo pedir permiso de push nativo:', e);
          return 'error';
        }
      }
      await np.register?.();
      const token = await nextNativeToken(np);
      if (!token) return 'error';
      await savePushToken(storeKey, token);
      return 'ok';
    } catch (e) {
      console.warn('No se pudo activar el aviso push nativo:', e);
      return 'error';
    }
  }
  const m = await getMessagingInstance();
  if (!m) return 'unsupported';
  try {
    let perm = Notification.permission;
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') return 'denied';
    // El mismo service worker que ya registra la app (sw.js) es el que
    // recibe el evento 'push' (ver el manejador agregado ahi): no hace
    // falta un firebase-messaging-sw.js aparte.
    const reg = await navigator.serviceWorker.ready;
    const token = await getToken(m, { vapidKey: VAPID_PUBLIC_KEY, serviceWorkerRegistration: reg });
    if (!token) return 'error';
    await savePushToken(storeKey, token);
    return 'ok';
  } catch (e) {
    console.warn('No se pudo activar el aviso push:', e);
    return 'error';
  }
}

// Re-registra el token de FCM de ESTE dispositivo SIN pedir permiso de nuevo
// (solo si ya lo tiene concedido): se llama al abrir la app y al volver a
// primer plano para que el token no quede perdido si el primer registro
// fallo (o si el navegador lo rotó). Antes el token solo se registraba al
// tocar el interruptor de Notificaciones en Opciones; si en ese momento la
// red o el navegador fallaban, el dispositivo quedaba "sin push" para
// siempre aunque tuviera el interruptor encendido.
export async function ensurePushToken(storeKey: string): Promise<'ok' | 'unsupported' | 'denied' | 'error'> {
  if (!pushConfigured() || !storeKey || !syncReady()) return 'unsupported';
  const np = nativePushPlugin();
  if (np) {
    try {
      await np.register?.();
      const token = await nextNativeToken(np);
      if (!token) return 'error';
      await savePushToken(storeKey, token);
      return 'ok';
    } catch (e) {
      console.warn('No se pudo re-registrar el aviso push nativo:', e);
      return 'error';
    }
  }
  if (typeof Notification === 'undefined' || !('serviceWorker' in navigator) || Notification.permission !== 'granted') return 'denied';
  const m = await getMessagingInstance();
  if (!m) return 'unsupported';
  try {
    const reg = await navigator.serviceWorker.ready;
    const token = await getToken(m, { vapidKey: VAPID_PUBLIC_KEY, serviceWorkerRegistration: reg });
    if (!token) return 'error';
    await savePushToken(storeKey, token);
    return 'ok';
  } catch (e) {
    console.warn('No se pudo re-registrar el aviso push:', e);
    return 'error';
  }
}

// Apaga el aviso push de ESTE dispositivo (interruptor "Notificaciones" en
// Opciones): se borra el token de FCM local y se quita del mapa del documento
// de la tienda, asi el Worker deja de rutearle avisos. Best-effort: si no hay
// conexion o Firebase no esta inicializado, simplemente no pasa nada.
export async function disablePushForStore(storeKey: string): Promise<void> {
  if (!storeKey) return;
  try {
    const np = nativePushPlugin();
    if (np && np.unregister) { try { await np.unregister(); } catch { /* token local irrelevante */ } }
    const m = await getMessagingInstance();
    if (m) { try { await deleteToken(m); } catch { /* token local irrelevante */ } }
  } catch { /* no se pudo ni mirar messaging */ }
  try { await removePushToken(storeKey); } catch { /* si la red falla, el peor caso es un push de mas */ }
}

// En la app nativa (Capacitor) el push llega por el plugin, no por el service
// worker, asi que tocar el aviso lo maneja esto y no sw.js: se registra UNA
// vez al arrancar (lo llama App.tsx) para que, al tocar una notificacion, la
// app navegue al destino que trae en su data (p.ej. ?tab=notas&n=<id>, el
// mismo deep link que arman pushLinkFor y el Worker). En navegador no hace
// nada: ahi el click ya lo maneja sw.js.
let nativeTapHooked = false;
export function initNativePush(): void {
  const np = nativePushPlugin();
  if (!np || !np.addListener || nativeTapHooked) return;
  nativeTapHooked = true;
  np.addListener('notificationActionPerformed', (d: unknown) => {
    const nd = (d as { notification?: { data?: { link?: string } } })?.notification;
    const link = nd?.data?.link;
    if (!link || link === location.href) return;
    try { window.location.href = link; } catch { /* sin navegacion, la app abre igual */ }
  }).catch(() => { /* el listener no debe romper el arranque */ });
}

// URL a la que la notificación debe llevar a quien la toca (ver notificationclick
// en sw.js). Para las notas/objetivos se manda un deep link a la pestaña Notas
// y, si se conoce, al hilo exacto: al tocar el aviso la app abre esa pestaña y
// ese hilo (ver lib/deepLink.ts).
export function pushLinkFor(tab: string, noteId?: string): string {
  const base = location.href.split('?')[0] || location.href;
  const q = new URLSearchParams();
  q.set('tab', tab);
  if (noteId) q.set('n', noteId);
  return base + '?' + q.toString();
}

// Le pide al Worker que avise (via FCM) a los demas dispositivos de la
// tienda - menos este - que hay algo nuevo. Se dispara "en el aire": no se
// espera la respuesta ni se avisa si falla (sin conexion, el Worker aun no
// esta desplegado, lo que sea). Un push que no llega no debe interrumpir a
// quien esta publicando la nota; el sonido/toast local de este mismo
// dispositivo y el resto de la sincronizacion ya funcionaron indepen-
// dientemente de esto. "cat" (categoria) viaja en el payload para que el
// Worker respete las preferencias de cada destinatario (que tipos de aviso
// quiere, ver NotifCat en types.ts y pushPrefs en sync.ts): si el otro
// dispositivo apago esa categoria en Opciones, el Worker le saltea el aviso.
// "link" (opcional) es el destino que se abre al tocar el aviso (ver
// pushLinkFor); si no se pasa, se abre la app tal como está.
export function notifyStorePush(storeKey: string, title: string, body: string, cat: NotifCat = 'nota', link?: string): void {
  if (!pushConfigured() || !storeKey) return;
  try {
    fetch(PUSH_WORKER_URL + '/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeKey, title, body, cat, excludeClientId: writerId(), link: link || location.href }),
      keepalive: true,
    }).catch(() => { /* sin conexion o Worker caido: se ignora, no es critico */ });
  } catch {
    // ignorar
  }
}
