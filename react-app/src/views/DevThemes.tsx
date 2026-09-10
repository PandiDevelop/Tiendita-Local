import { useEffect, useState } from 'react';
import { Modal } from '../ui';
import { themePref, setThemePref } from '../lib/theme';
import type { ThemePref } from '../lib/theme';

// Menú oculto de desarrollo: solo se abre con 10 toques en el logo. Pide una
// contraseña fija y, al desbloquear, muestra una pequeña animación con los 3
// iconos de los temas ocultos (el de Owen, el de Crisdeku y el de Pandi)
// saliendo uno sobre otro, y después sí el menú. El tap por fuera no lo
// cierra: solo Escape o los botones.
const DEV_PASS = '0208';
const DEV_KEY = 'mt_dev_unlocked';

export function devUnlocked(): boolean {
  try { return localStorage.getItem(DEV_KEY) === '1'; } catch { return false; }
}

function unlockDev(): void {
  try { localStorage.setItem(DEV_KEY, '1'); } catch { /* ignorar */ }
}

const DEV_THEMES: { value: ThemePref; label: string; icon: string; quote: string }[] = [
  { value: 'owen', label: 'Owen-chan', icon: '/logo-owen.png', quote: 'La fuerza en su representación más pura: La voluntad.' },
  { value: 'crisdeku', label: 'Crisdeku', icon: '/logo-crisdeku.png', quote: 'La creatividad que no para, la valentía que te acompaña.' },
  { value: 'pandi', label: 'Pandi', icon: '/logo-pandi.png', quote: 'Puedes con todo, pero no estás solo.' },
];

export function DevThemesModal({ onClose }: { onClose: () => void }) {
  const [unlocked, setUnlocked] = useState(devUnlocked());
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [active, setActive] = useState<ThemePref>(themePref());
  const [phase, setPhase] = useState<'icons' | 'menu'>('icons');

  // Al desbloquear: primero los iconos en animación, después el menú.
  useEffect(() => {
    if (!unlocked) return;
    const t = window.setTimeout(() => setPhase('menu'), 1000);
    return () => window.clearTimeout(t);
  }, [unlocked]);

  function tryPass() {
    if (pass === DEV_PASS) { unlockDev(); setUnlocked(true); setErr(false); setPass(''); }
    else setErr(true);
  }

  const themeQuote = DEV_THEMES.find((t) => t.value === active);

  return (
    <Modal onClose={onClose} backdropClose={false}>
      {!unlocked ? (
        <>
          <h2>DevThemes</h2>
          <p className="muted">Área de desarrollo. Ingresa la contraseña para ver los temas ocultos.</p>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" inputMode="numeric" autoComplete="off" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') tryPass(); }} placeholder="••••••" style={{ width: '100%' }} />
            {err && <p className="muted">Contraseña incorrecta.</p>}
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={onClose}>Cancelar</button>
            <button className="button primary" onClick={tryPass}>Desbloquear</button>
          </div>
        </>
      ) : phase === 'icons' ? (
        <>
          <p className="dev-muted-tag">Desbloqueado</p>
          <div className="dev-stack">
            {DEV_THEMES.map((t) => (
              <img key={t.value} src={t.icon} alt={t.label} />
            ))}
          </div>
        </>
      ) : (
        <div className="dev-menu-in">
          <h2>DevThemes</h2>
          <p className="muted">Temas ocultos que se guardan solo en este dispositivo.</p>
          <div className="team-list" style={{ margin: '0 0 16px' }}>
            {DEV_THEMES.map((t) => (
              <button key={t.value} type="button" className={'button outline dev-theme-btn' + (active === t.value ? ' armed' : '')} onClick={() => { setActive(t.value); setThemePref(t.value); }}>
                <img src={t.icon} alt="" className="dev-theme-icon" />
                <span style={{ display: 'grid', gap: 2 }}>
                  <b>{t.label}</b>
                  <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>{t.quote}</span>
                </span>
              </button>
            ))}
          </div>
          {themeQuote && <p className="muted" style={{ marginTop: '-6px' }}>{themeQuote.label} activo: la frase del local también cambia.</p>}
          <div className="modal-actions">
            <button className="button secondary" onClick={() => { setActive('light'); setThemePref('light'); }}>Tema clásico</button>
            <button className="button primary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      )}
    </Modal>
  );
}