import { useState } from 'react';
import { Modal } from '../ui';
import { themePref, setThemePref } from '../lib/theme';
import type { ThemePref } from '../lib/theme';

// Menú oculto de desarrollo: solo se abre con 10 toques en el logo. Pide una
// contraseña fija y, al desbloquear, permite poner los temas ocultos
// (Owen-chan, Crisdeku y Pandi) que no aparecen en Opciones.
const DEV_PASS = '0208';
const DEV_KEY = 'mt_dev_unlocked';

export function devUnlocked(): boolean {
  try { return localStorage.getItem(DEV_KEY) === '1'; } catch { return false; }
}

function unlockDev(): void {
  try { localStorage.setItem(DEV_KEY, '1'); } catch { /* ignorar */ }
}

const DEV_THEMES: { value: ThemePref; label: string; desc: string }[] = [
  { value: 'owen', label: 'Owen-chan', desc: 'Rojo, negro y naranja pastel, con un fondo de amapolas.' },
  { value: 'crisdeku', label: 'Crisdeku', desc: 'Todo en morado, con dinosaurios de caricatura en el fondo.' },
  { value: 'pandi', label: 'Pandi', desc: 'Cyan sobre azul, con un cielo estrellado de fondo.' },
];

export function DevThemesModal({ onClose }: { onClose: () => void }) {
  const [unlocked, setUnlocked] = useState(devUnlocked());
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [active, setActive] = useState<ThemePref>(themePref());

  function tryPass() {
    if (pass === DEV_PASS) { unlockDev(); setUnlocked(true); setErr(false); setPass(''); }
    else setErr(true);
  }

  return (
    <Modal onClose={onClose}>
      <h2>DevThemes</h2>
      {!unlocked ? (
        <>
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
        <>
          <p className="muted">Temas ocultos para desarrollo. Se aplican solo en este dispositivo.</p>
          <div className="team-list" style={{ margin: '0 0 16px' }}>
            {DEV_THEMES.map((t) => (
              <button key={t.value} type="button" className={'button outline dev-theme-btn' + (active === t.value ? ' armed' : '')} onClick={() => { setActive(t.value); setThemePref(t.value); }}>
                <span style={{ display: 'grid', gap: 2 }}>
                  <b>{t.label}</b>
                  <span className="muted" style={{ fontSize: 12, fontWeight: 500 }}>{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => { setActive('light'); setThemePref('light'); }}>Tema clásico</button>
            <button className="button primary" onClick={onClose}>Cerrar</button>
          </div>
        </>
      )}
    </Modal>
  );
}