// Worker de Cloudflare que dispara los avisos push de Mi Tiendita cuando
// alguien publica una nota o responde un hilo, sin necesitar el plan de
// pago (Blaze) de Firebase - ver el README.md de esta misma carpeta para
// la explicacion completa y los pasos de despliegue, uno por uno.
//
// Que hace, en resumen: el navegador de quien publica la nota (ver
// react-app/src/lib/push.ts, notifyStorePush) le manda un POST a este
// Worker con la tienda y el texto. Este Worker lee de Firestore (via su
// API REST, sin necesitar credenciales para LEER porque las reglas de este
// proyecto ya son abiertas - igual que el resto de la app) los tokens de
// FCM que cada dispositivo de esa tienda dejo registrados, y le manda un
// mensaje de FCM a cada uno (menos al que lo disparo). FCM en si es
// gratis siempre; lo unico que hacia falta pagar era el lugar donde correr
// este disparador, y por eso vive aca en vez de en una Cloud Function.
//
// SECRETS que hacen falta (una sola vez, con "wrangler secret put <nombre>"
// desde esta carpeta - ver README.md):
//   FIREBASE_SERVICE_ACCOUNT  -> el contenido COMPLETO (todo el archivo
//                                 .json, tal cual) de la cuenta de servicio
//                                 descargada en Firebase Console >
//                                 Configuracion del proyecto > Cuentas de
//                                 servicio > "Generar nueva clave privada".
//
// Variable normal (no secreta, va en wrangler.toml, no hace falta tocarla):
//   FIREBASE_PROJECT_ID

// Si quieres restringir desde que sitio se puede llamar a este Worker,
// reemplaza '*' por el dominio exacto donde vive tu index.html (por
// ejemplo 'https://tu-usuario.github.io'). Con '*' cualquiera que sepa la
// URL del Worker podria llamarlo, pero para avisar necesita ademas el
// codigo (syncKey) de una tienda real - el mismo nivel de "seguridad por
// no adivinar el codigo" que ya usa el resto de la app con Firestore.
const ALLOWED_ORIGIN = '*';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders()),
  });
}

function base64UrlFromBytes(buf) {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlFromString(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// El token de acceso de Google dura 1h; se guarda en memoria del Worker
// (module scope) para no volver a firmar un JWT y pedir uno nuevo en cada
// aviso - Cloudflare puede reciclar el "isolate" en cualquier momento, en
// cuyo caso simplemente se vuelve a pedir, no es un problema de
// correctitud, solo una optimizacion de cuando se puede.
let cachedToken = null;

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;

  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = base64UrlFromString(JSON.stringify(header)) + '.' + base64UrlFromString(JSON.stringify(claims));

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + '.' + base64UrlFromBytes(sigBuf);

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt),
  });
  if (!resp.ok) throw new Error('No se pudo obtener el token de Google: ' + resp.status + ' ' + (await resp.text()));
  const data = await resp.json();
  cachedToken = { token: data.access_token, exp: now + (data.expires_in || 3600) };
  return cachedToken.token;
}

// Lee stores/{storeKey} por la API REST de Firestore (GET simple, sin
// autenticacion - las reglas de este proyecto ya dejan leer sin login,
// igual que hace el resto de la app) y devuelve {clientId: token, ...}.
async function readPushTokens(projectId, storeKey) {
  const url = 'https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents/stores/' + encodeURIComponent(storeKey);
  const resp = await fetch(url);
  if (!resp.ok) return {};
  const doc = await resp.json();
  const fields = doc.fields || {};
  const pt = fields.pushTokens && fields.pushTokens.mapValue && fields.pushTokens.mapValue.fields;
  if (!pt) return {};
  const out = {};
  for (const clientId of Object.keys(pt)) {
    const entryFields = pt[clientId] && pt[clientId].mapValue && pt[clientId].mapValue.fields;
    const token = entryFields && entryFields.token && entryFields.token.stringValue;
    if (token) out[clientId] = token;
  }
  return out;
}

async function sendToToken(accessToken, projectId, token, title, body, link) {
  const message = {
    token,
    notification: { title, body },
    webpush: {
      // requireInteraction/renotify van en el payload de sw.js (quien de
      // verdad muestra el aviso); aca solo hace falta el link a abrir.
      fcmOptions: link ? { link } : undefined,
    },
  };
  const resp = await fetch('https://fcm.googleapis.com/v1/projects/' + projectId + '/messages:send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  return resp;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders() });

    const url = new URL(request.url);
    if (url.pathname !== '/notify') return jsonResponse({ ok: false, error: 'not found' }, 404);
    if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'method not allowed' }, 405);

    let body;
    try { body = await request.json(); } catch (e) { return jsonResponse({ ok: false, error: 'bad json' }, 400); }
    const storeKey = body && body.storeKey;
    const title = body && body.title;
    const msgBody = (body && body.body) || '';
    const excludeClientId = body && body.excludeClientId;
    const link = body && body.link;
    if (!storeKey || !title) return jsonResponse({ ok: false, error: 'falta storeKey o title' }, 400);

    if (!env.FIREBASE_SERVICE_ACCOUNT) {
      return jsonResponse({ ok: false, error: 'El Worker no tiene configurado el secret FIREBASE_SERVICE_ACCOUNT todavia (ver README.md).' }, 500);
    }

    try {
      const tokensByClient = await readPushTokens(env.FIREBASE_PROJECT_ID, storeKey);
      const targets = Object.entries(tokensByClient).filter(function (e) { return e[0] !== excludeClientId; });
      if (!targets.length) return jsonResponse({ ok: true, sent: 0, failed: 0, total: 0 });

      const accessToken = await getAccessToken(env);
      let sent = 0;
      let failed = 0;
      // Se guarda el motivo de cada fallo (y a que clientId correspondia)
      // para poder ver en la respuesta - o en "npx wrangler tail" - POR QUE
      // no llego un aviso (token vencido/invalido, proyecto mal
      // configurado, lo que sea) en vez de solo un numero sin explicacion.
      const errors = [];
      await Promise.all(targets.map(async function (entry) {
        const clientId = entry[0];
        const token = entry[1];
        try {
          const r = await sendToToken(accessToken, env.FIREBASE_PROJECT_ID, token, title, msgBody, link);
          if (r.ok) {
            sent++;
          } else {
            failed++;
            const errText = await r.text().catch(function () { return ''; });
            errors.push({ clientId: clientId, status: r.status, error: errText.slice(0, 500) });
          }
        } catch (e) {
          failed++;
          errors.push({ clientId: clientId, error: String((e && e.message) || e) });
        }
      }));
      return jsonResponse({ ok: true, sent: sent, failed: failed, total: targets.length, errors: errors });
    } catch (e) {
      return jsonResponse({ ok: false, error: String((e && e.message) || e) }, 500);
    }
  },
};
