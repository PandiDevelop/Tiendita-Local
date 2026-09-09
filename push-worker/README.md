# Avisos push reales para Mi Tiendita (con la app cerrada del todo)

Esta carpeta es un pequeño servidor (un "Worker" de Cloudflare, gratis, sin
tarjeta) que le avisa a los demás dispositivos de tu equipo cuando alguien
publica una nota o responde un hilo — aunque tengan la app completamente
cerrada, no solo en otra pestaña.

No reemplaza nada de lo que ya tienes: Firestore sigue guardando tus datos
igual que siempre, y Firebase Cloud Messaging (FCM) sigue siendo quien de
verdad entrega el aviso al navegador (es gratis siempre, sin límite). Lo
único que hace este Worker es la piecita que en Firebase normalmente sería
una "Cloud Function" de pago (exige activar facturación con tarjeta) —
aquí corre gratis en Cloudflare en su lugar.

Son 4 pasos, se hacen UNA sola vez. Después de eso, todo funciona solo.

## Paso 1 — Generar la clave VAPID en Firebase

1. Entra a [Firebase Console](https://console.firebase.google.com/) → tu
   proyecto (`mi-tiendita-28827`).
2. Ícono de engranaje → **Configuración del proyecto** → pestaña
   **Cloud Messaging**.
3. Baja hasta **"Certificados push web"** → botón **"Generar par de
   claves"**.
4. Copia el valor que aparece (empieza con `B...`, es largo). Esa es tu
   `VAPID_PUBLIC_KEY`.
5. Pégala en `react-app/src/lib/push.ts`, en esta línea:
   ```ts
   export const VAPID_PUBLIC_KEY = '';
   ```
   quedando `export const VAPID_PUBLIC_KEY = 'B...tu-clave...';`.

## Paso 2 — Descargar la cuenta de servicio

1. En la misma página de **Configuración del proyecto**, pestaña
   **Cuentas de servicio**.
2. Botón **"Generar nueva clave privada"** → confirma → se descarga un
   archivo `.json` a tu computador (algo como
   `mi-tiendita-28827-firebase-adminsdk-xxxxx.json`).
3. Guárdalo en un lugar seguro fuera del repositorio (no lo subas a
   GitHub — trae una llave privada). Lo vas a necesitar en el paso 4.

## Paso 3 — Crear la cuenta de Cloudflare y desplegar el Worker

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com/sign-up) y
   crea una cuenta gratis (no pide tarjeta para el plan gratuito de
   Workers).
2. Desde tu computador, abre una terminal **en esta carpeta**
   (`push-worker/`) e instala las dependencias:
   ```
   npm install
   ```
3. Inicia sesión con Cloudflare desde la terminal (abre el navegador para
   que confirmes):
   ```
   npx wrangler login
   ```
4. Configura el secret con la cuenta de servicio que descargaste en el
   paso 2 — cuando lo pida, pega el **contenido completo** del archivo
   `.json` (ábrelo con el Bloc de notas, selecciona todo, copia, y pégalo
   cuando la terminal lo pida):
   ```
   npx wrangler secret put FIREBASE_SERVICE_ACCOUNT
   ```
5. Despliega el Worker:
   ```
   npx wrangler deploy
   ```
   Al terminar, la terminal muestra una URL como
   `https://mi-tiendita-push.tu-usuario.workers.dev`. Cópiala.

## Paso 4 — Conectar la URL del Worker con la app

1. En `react-app/src/lib/push.ts`, pega la URL que copiaste (sin barra `/`
   al final):
   ```ts
   export const PUSH_WORKER_URL = 'https://mi-tiendita-push.tu-usuario.workers.dev';
   ```
2. Reconstruye y vuelve a publicar la app (mismo proceso de siempre:
   `cd react-app && rm -rf dist && npx tsc && npx vite build`, copiar
   `dist/*` a la raíz del repo, hacer commit y subirlo).
3. Listo. Desde la pestaña de Notas, el botón "Activar aviso del sistema"
   ahora también registra el aviso push real para quien lo toque. No hace
   falta que todo el equipo lo haga a la vez: cada quien lo activa cuando
   quiera, desde su propio dispositivo.

## ¿Cómo sé si quedó bien?

Publica una nota desde un dispositivo, con OTRO dispositivo (que ya haya
tocado "Activar aviso del sistema") con la app totalmente cerrada. En unos
segundos debería aparecer la notificación del sistema operativo. Si no
llega, revisa en la terminal del Worker (`npx wrangler tail` desde esta
carpeta, con la app abierta en otro dispositivo mientras publicas una
nota) qué error está devolviendo.

## Costos

FCM: gratis siempre. Cloudflare Workers (plan gratis): 100.000 peticiones al
día — una tiendita normal ni de cerca se acerca a eso. No hace falta
tarjeta para nada de esto.
