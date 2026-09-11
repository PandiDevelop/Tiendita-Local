// Precarga de los recursos de los temas ocultos: los logos de Owen/Crisdeku/
// Pandi y los patrones de fondo. Se piden apenas arranca la app (y el
// service worker los cachea tambien en install), asi la animacion del menu
// oculto y el fondo del tema salen siempre sin el cuadrado roto que se ve
// cuando la imagen aun no ha cargado.
const ASSETS = [
  './logo-owen.png',
  './logo-crisdeku.png',
  './logo-pandi.png',
  './pattern-owen.jpg',
  './pattern-cris.jpg',
  './pattern-pandi.jpg',
];

export function preloadDevAssets(): void {
  ASSETS.forEach((src) => { const img = new Image(); img.src = src; });
}