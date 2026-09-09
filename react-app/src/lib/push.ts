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
import { getToken, getMessaging, isSupported, type Messaging } from 'firebase/messaging';
import { syncClientId } from './core';
import { firebaseApp, savePushToken, syncReady } from './sync';

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

// Le pide al Worker que avise (via FCM) a los demas dispositivos de la
// tienda - menos este - que hay algo nuevo. Se dispara "en el aire": no se
// espera la respuesta ni se avisa si falla (sin conexion, el Worker aun no
// esta desplegado, lo que sea). Un push que no llega no debe interrumpir a
// quien esta publicando la nota; el sonido/toast local de este mismo
// dispositivo y el resto de la sincronizacion ya funcionaron indepen-
// dientemente de esto.
export function notifyStorePush(storeKey: string, title: string, body: string): void {
  if (!pushConfigured() || !storeKey) return;
  try {
    fetch(PUSH_WORKER_URL + '/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeKey, title, body, excludeClientId: syncClientId(), link: location.href }),
      keepalive: true,
    }).catch(() => { /* sin conexion o Worker caido: se ignora, no es critico */ });
  } catch {
    // ignorar
  }
}
