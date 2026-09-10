// Tema de la app, guardado por dispositivo (localStorage) igual que el resto
// de los ajustes (ver lib/settings.ts): no viaja por Firestore. "Automático"
// (por defecto) sigue el modo claro/oscuro del teléfono (prefers-color-scheme)
// en vivo: si el teléfono cambia de claro a oscuro, la app cambia sola.
// Los temas "owen", "crisdeku" y "pandi" son ocultos: no aparecen en Opciones;
// solo se pueden poner desde la ventana oculta DevThemes (10 toques en el logo).
export type ThemePref = 'light' | 'dark' | 'rosa' | 'menta' | 'auto' | 'owen' | 'crisdeku' | 'pandi';

const THEME_KEY = 'mt_theme';

const THEMES: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Clásico' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'rosa', label: 'Rosa pastel' },
  { value: 'menta', label: 'Menta pastel' },
  { value: 'auto', label: 'Automático (sigue al teléfono)' },
];

export function themeOptions(): { value: ThemePref; label: string }[] {
  return THEMES;
}

export function themePref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    // 'azul' ya no se ofrece; quien lo tenía pasa al clásico.
    if (v === 'azul') return 'light';
    if (v === 'light' || v === 'dark' || v === 'rosa' || v === 'menta' || v === 'auto' || v === 'owen' || v === 'crisdeku' || v === 'pandi') return v;
  } catch { /* ignorar */ }
  return 'auto';
}

export function setThemePref(p: ThemePref): void {
  try { localStorage.setItem(THEME_KEY, p); } catch { /* ignorar */ }
  applyTheme();
}

function systemDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// El tema que de verdad se aplica al <html data-theme="..."> (los bloques
// CSS: claro clásico, rosa, menta, oscuro y los ocultos). "Automático" se
// resuelve a claro u oscuro según el teléfono.
export function resolvedTheme(): 'light' | 'dark' | 'rosa' | 'menta' | 'owen' | 'crisdeku' | 'pandi' {
  const p = themePref();
  if (p === 'auto') return systemDark() ? 'dark' : 'light';
  return p;
}

let systemListenerReady = false;
function ensureSystemListener(): void {
  if (systemListenerReady || typeof window === 'undefined' || !window.matchMedia) return;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => { if (themePref() === 'auto') applyTheme(); };
  if (mql.addEventListener) mql.addEventListener('change', onChange);
  systemListenerReady = true;
}

export function applyTheme(): void {
  document.documentElement.dataset.theme = resolvedTheme();
  ensureSystemListener();
}