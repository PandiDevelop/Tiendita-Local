// Precarga de los recursos de los temas ocultos: los logos de Owen/Crisdeku/
// Pandi y el patron de fondo de Owen. Se piden apenas arranca la app (y el
// service worker los cachea tambien en install), asi la animacion del menu
// oculto y el fondo del tema salen siempre sin el cuadrado roto que se ve
// cuando la imagen aun no ha cargado.
const ASSETS = [
  './logo-owen.png',
  './logo-crisdeku.png',
  './logo-pandi.png',
  './pattern-owen.jpg',
  './pattern-crisdeku.svg',
];

export function preloadDevAssets(): void {
  ASSETS.forEach((src) => { const img = new Image(); img.src = src; });
}