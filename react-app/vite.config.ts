import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // La app se abre con doble clic sobre index.html (sin servidor: ver
  // README, "No requiere instalación ni conexión"). Un <script type="module"
  // src="..."> externo NUNCA carga asi: los modulos ES siempre piden sus
  // recursos con fetch en modo CORS, y cada pagina file:// tiene un origen
  // opaco ('null') que no puede pasar esa validacion, sin importar si el tag
  // trae o no el atributo crossorigin (se probo quitandolo: sigue bloqueado).
  // El resultado es una pantalla en blanco con "blocked by CORS policy" en
  // consola, solo al abrir el archivo directamente (por servidor http/https
  // sí funciona, por eso el bug pasaba desapercibido). vite-plugin-singlefile
  // incrusta el JS y el CSS dentro del propio index.html (nada que volver a
  // pedir por red), asi que abrir el archivo suelto vuelve a funcionar igual
  // en file://, http o donde sea. Verificado con Playwright.
  plugins: [react(), viteSingleFile()],
  base: './',
  test: {
    setupFiles: ['./src/test/setup.ts'],
  },
});
