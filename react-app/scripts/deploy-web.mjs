// Despliega la version web (PWA) a GitHub Pages: copia el build de
// react-app/dist a la RAIZ del repo Web (es lo que sirve GitHub Pages, no la
// carpeta bundles). Preserva push-worker/ y el resto del repo; solo actualiza
// index.html, sw.js, manifest.webmanifest y design/. Correr tras npm run build.
import { cp, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '..', 'dist');
const root = resolve(here, '..', '..');

const entries = ['index.html', 'sw.js', 'manifest.webmanifest', 'design'];
for (const e of entries) {
  const src = join(dist, e);
  const dst = join(root, e);
  const isDir = (await stat(src)).isDirectory();
  if (isDir) await mkdir(dst, { recursive: true });
  await cp(src, dst, { recursive: true, force: true });
}
console.log(`deploy-web: ${dist} -> raiz del repo Web (sirve GitHub Pages). Falta commit + push.`);