// Post-build: inyecta la version real en el sw.js ya copiado a dist/.
// El problema: Vite termina la copia de public/ (que trae el marcador) de
// forma asincrona, justo despues de que su CLI devolvio el control al npm.
// Por eso se sondea: cuando el placeholder aparece (copia ya aterrizo), se
// reemplaza y se confirma que se quede estable. La version sale de
// src/lib/version.ts (unica fuente de verdad).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const versionSrc = readFileSync(resolve(root, 'src', 'lib', 'version.ts'), 'utf8');
const APP_VERSION = (versionSrc.match(/APP_VERSION\s*=\s*'([^']+)'/) || [])[1] || '0.0.0';
const p = resolve(root, 'dist', 'sw.js');

let attempts = 0;
let stableChecks = 0;

function inject() {
  attempts += 1;
  if (attempts > 60) {
    console.log('inject-sw-version: no se pudo pisar la version en dist/sw.js');
    return;
  }
  let src;
  try {
    src = readFileSync(p, 'utf8');
  } catch {
    setTimeout(inject, 200);
    return;
  }
  const next = src.replace('__APP_VERSION__', APP_VERSION);
  if (next !== src) {
    try {
      writeFileSync(p, next, 'utf8');
    } catch {
      setTimeout(inject, 200);
      return;
    }
  }
  // Confirma que la correccion quede estable (que no la pise una copia tardia).
  setTimeout(() => {
    try {
      const now = readFileSync(p, 'utf8');
      if (now.includes('__APP_VERSION__')) {
        stableChecks = 0;
        setTimeout(inject, 200);
      } else if (now.includes(APP_VERSION)) {
        stableChecks += 1;
        if (stableChecks >= 3) console.log('inject-sw-version: listo (' + APP_VERSION + ')');
        else setTimeout(inject, 200);
      } else {
        setTimeout(inject, 200);
      }
    } catch {
      setTimeout(inject, 200);
    }
  }, 250);
}

setTimeout(inject, 50);