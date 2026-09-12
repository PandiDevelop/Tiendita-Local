// Version unica de la aplicacion (X.Y.Z). Cambiar ESTE numero es lo unico que
// hace falta para subir de version: el resto se genera solo en el build.
//   - src/lib/core.ts la re-exporta; la app la usa para mostrar su numero.
//   - scripts/inject-sw-version.mjs reemplaza el placeholder __APP_VERSION__
//     del public/sw.js copiado a dist/ en el post-build, asi el service
//     worker siempre lleva la MISMA version que el index.html.
//   - src/lib/appVersion.ts muestra esta version como minimo y la actualiza
//     con la real del service worker activo.
export const APP_VERSION = '1.11.2';