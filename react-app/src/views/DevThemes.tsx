import { useEffect, useState } from 'react';
import { Modal } from '../ui';
import { themePref, setThemePref } from '../lib/theme';
import type { ThemePref } from '../lib/theme';

// Menú oculto de desarrollo: solo se abre con 10 toques en el logo y pide una
// contraseña fija (0208). Al desbloquear se ve una pequeña cabecera con los 3
// iconos de los temas ocultos apareciendo uno sobre otro y, después, la caja
// se expande y muestra el menú con cada tema y su logo. El tap por fuera no lo
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
  { value: 'owen', label: 'Owen-chan', icon: './logo-owen.png', quote: 'La fuerza en su representación más pura: La voluntad.' },
  { value: 'crisdeku', label: 'Crisdeku', icon: './logo-crisdeku.png', quote: 'La creatividad que no para, la valentía que te acompaña.' },
  { value: 'pandi', label: 'Pandi', icon: './logo-pandi.png', quote: 'Puedes con todo, pero no estás solo.' },
];

type Stage = 'password' | 'icons' | 'menu';

// Cada logo del totem con su animacion de fade-in. Si por lo que sea una
// imagen falla (sin red, cache rara...), se muestra la inicial del tema en su
// lugar en vez del icono roto del navegador.
function TotemIcon({ t, delay }: { t: { value: ThemePref; label: string; icon: string; quote: string }; delay: string }) {
  const [bad, setBad] = useState(false);
  if (bad) return <span className="dev-icon-fallback" style={{ animationDelay: delay }}>{t.label[0]}</span>;
  return <img src={t.icon} alt={t.label} onError={() => setBad(true)} style={{ animationDelay: delay }} />;
}

export function DevThemesModal({ onClose }: { onClose: () => void }) {
  const [unlocked, setUnlocked] = useState(devUnlocked());
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [active, setActive] = useState<ThemePref>(themePref());
  const [stage, setStage] = useState<Stage>(unlocked ? 'icons' : 'password');

  // Secuencia: primero el totem con los logos uno a uno (Owen arriba,
  // Crisdeku al medio, Pandi abajo) y luego la caja se expande con el menu.
  useEffect(() => {
    if (!unlocked) return;
    const t = window.setTimeout(() => setStage('menu'), 2000);
    return () => window.clearTimeout(t);
  }, [unlocked]);

  function tryPass() {
    if (pass === DEV_PASS) { unlockDev(); setUnlocked(true); setErr(false); setPass(''); }
    else setErr(true);
  }

  return (
    <Modal onClose={onClose} backdropClose={false}>
      {stage === 'password' ? (
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
      ) : (
        <div className={'dev-stage ' + (stage === 'menu' ? 'menu' : 'icons')} role="status">
          {stage === 'icons' && (
            <div className="dev-icons">
              {DEV_THEMES.map((t, i) => (
                <TotemIcon key={t.value} t={t} delay={(0.1 + i * 0.5).toFixed(2) + 's'} />
              ))}
            </div>
          )}
          {stage === 'menu' && (
            <div className="dev-menu-in">
              <h2 style={{ marginTop: 0 }}>DevThemes</h2>
              <p className="muted">Temas ocultos que se guardan solo en este dispositivo.</p>
              <div className="team-list" style={{ margin: '0 0 14px' }}>
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
              <div className="modal-actions">
                <button className="button secondary" style={{ flex: 1 }} onClick={() => { setActive('light'); setThemePref('light'); }}>Clásico</button>
                <button className="button primary" style={{ flex: 1 }} onClick={onClose}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}