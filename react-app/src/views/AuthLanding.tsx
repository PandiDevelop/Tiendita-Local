import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { currentIdentity, linkStoresToAccount, registerAccount, sendPasswordReset, signInAccount } from '../lib/account';
import { setAccountEmail, setAccountId } from '../lib/accountStore';
import { resetClientId } from '../lib/core';
import { pullJoinedStores } from '../lib/sync';
import { pushOverlay } from '../lib/backStack';
import { EyeIcon, EyeOffIcon } from '../ui';

// Primer pantallazo cuando el dispositivo todavía no tiene ninguna tienda:
// ahora ofrece cuenta primero (Inicia sesión / Crear cuenta) y deja seguir sin
// registrarse para usar la app solo en este teléfono. Cada opción se desvanece
// y da paso a su formulario (o a elegir crear/unirse) sin perder el hilo.
type Step = 'choice' | 'signin' | 'signup' | 'signup-done' | 'local';

export function AuthLanding({ onCreate, onJoin }: { onCreate: () => void; onJoin: () => void }) {
  const { getState, replace, attach, toast, pickStore, openPicker } = useStore();
  const [step, setStep] = useState<Step>('choice');
  const [visible, setVisible] = useState(true);
  const fadeTimer = useRef<number | null>(null);

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState('');

  // Transición suave entre pasos: primero se desvanece lo actual y, al
  // terminar, entra el siguiente. Así "se desvanecen las opciones" al tocar
  // Inicia sesión, Crear cuenta o Continuar sin registrarse.
  function go(next: Step, keepNote = false) {
    if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    setVisible(false);
    fadeTimer.current = window.setTimeout(() => {
      if (!keepNote) setNote(null);
      setStep(next);
      setVisible(true);
    }, 190);
  }

  useEffect(() => () => { if (fadeTimer.current) window.clearTimeout(fadeTimer.current); }, []);

  // El botón atrás del celular vuelve a las opciones en vez de salir de la app.
  useEffect(() => (step !== 'choice' ? pushOverlay(() => go('choice')) : undefined), [step]); // eslint-disable-line react-hooks/exhaustive-deps

  async function doSignIn() {
    if (busy) return;
    if (!email.trim() || !pass) { setNote('Escribe tu correo y tu contraseña.'); return; }
    setBusy(true);
    try {
      const from = currentIdentity();
      const r = await signInAccount(email, pass);
      if (!r.ok || !r.uid) { setNote(r.message); return; }
      setAccountEmail(r.email || null);
      await linkStoresToAccount(r.uid, from, getState, replace);
      setAccountId(r.uid);
      resetClientId();
      // Trae las tiendas de la cuenta (si el equipo compartió alguna con este
      // correo) y decide: una sola tienda entra directo, varias abren la
      // ventana de selección, ninguna ofrece crear/unirse.
      await pullJoinedStores(r.uid, getState, replace, attach);
      const stores = getState().stores;
      if (stores.length === 1) { pickStore(stores[0].id); return; }
      if (stores.length > 1) { openPicker(); return; }
      setNote('Sesión iniciada, pero tu cuenta todavía no tiene tiendas: crea una o únete con un código.');
      toast('Sesión iniciada.');
      go('local', true);
    } catch {
      setNote('No se pudo iniciar sesión. Revisa tu conexión.');
    } finally {
      setBusy(false);
    }
  }

  async function doRegister() {
    if (busy) return;
    if (!user.trim()) { setNote('Escribe tu nombre de usuario.'); return; }
    if (!email.trim()) { setNote('Escribe tu correo.'); return; }
    if (pass.length < 6) { setNote('La contraseña debe tener al menos 6 caracteres.'); return; }
    setBusy(true);
    try {
      const r = await registerAccount(email, pass, user);
      if (!r.uid) { setNote(r.message); return; }
      setDoneMsg(r.ok
        ? `Te enviamos un correo a ${email.trim()} para activar tu cuenta. Ábrelo (revisa también el spam) y luego vuelve a iniciar sesión.`
        : r.message);
      go('signup-done');
    } finally {
      setBusy(false);
    }
  }

  async function doReset() {
    if (busy) return;
    if (!email.trim()) { setNote('Escribe tu correo primero.'); return; }
    setBusy(true);
    try {
      const r = await sendPasswordReset(email);
      setNote(r.message);
    } finally {
      setBusy(false);
    }
  }

  const body = () => {
    if (step === 'signin') {
      return (
        <div className="auth-panel">
          <h2>Inicia sesión</h2>
          <div className="field">
            <label htmlFor="auth-email">Correo</label>
            <input id="auth-email" type="email" maxLength={120} autoComplete="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="auth-pass">Contraseña</label>
            <div className="password-wrap">
              <input id="auth-pass" type={showPass ? 'text' : 'password'} maxLength={120} autoComplete="current-password" placeholder="Tu contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)} title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'} aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}>
                {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>
          {note && <p className="account-note" role="status">{note}</p>}
          <div className="auth-actions">
            <button className="button secondary" disabled={busy} onClick={() => go('choice')}>Cancelar</button>
            <button className="button primary" disabled={busy} onClick={doSignIn}>Conectarse</button>
          </div>
          <button className="link-btn auth-forgot" disabled={busy} onClick={doReset}>¿Olvidaste tu contraseña?</button>
        </div>
      );
    }
    if (step === 'signup') {
      return (
        <div className="auth-panel">
          <h2>Crear cuenta</h2>
          <div className="field">
            <label htmlFor="reg-user">Nombre de usuario</label>
            <input id="reg-user" type="text" maxLength={30} autoComplete="nickname" placeholder="Cómo te llamarán tus compañeros" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="reg-email">Correo</label>
            <input id="reg-email" type="email" maxLength={120} autoComplete="email" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="reg-pass">Contraseña</label>
            <div className="password-wrap">
              <input id="reg-pass" type={showPass ? 'text' : 'password'} maxLength={120} autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={pass} onChange={(e) => setPass(e.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)} title={showPass ? 'Ocultar contraseña' : 'Ver contraseña'} aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}>
                {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            <p className="pw-req">La contraseña debe tener al menos 6 caracteres.</p>
          </div>
          {note && <p className="account-note" role="status">{note}</p>}
          <div className="auth-actions">
            <button className="button secondary" disabled={busy} onClick={() => go('choice')}>Cancelar</button>
            <button className="button primary" disabled={busy} onClick={doRegister}>Crear cuenta</button>
          </div>
        </div>
      );
    }
    if (step === 'signup-done') {
      return (
        <div className="auth-panel auth-done">
          <h2>Activa tu cuenta</h2>
          <p className="auth-done-msg">{doneMsg}</p>
          <div className="auth-actions">
            <button className="button primary" onClick={() => go('choice')}>Atrás</button>
          </div>
        </div>
      );
    }
    if (step === 'local') {
      return (
        <>
          {note && <p className="account-note" role="status">{note}</p>}
          <div className="landing-actions">
            <button className="button primary" onClick={onCreate}>Crear mi primera tienda</button>
            <button className="button secondary" onClick={onJoin}>Unirme a una tienda</button>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="landing-actions">
          <button className="button primary" onClick={() => go('signin')}>Inicia sesión</button>
          <button className="button secondary" onClick={() => go('signup')}>Crear cuenta</button>
        </div>
        <button className="link-btn landing-skip" onClick={() => go('local')}>Continuar sin registrarme</button>
      </>
    );
  };

  return <div className={'auth-step' + (visible ? ' in' : ' out')}>{body()}</div>;
}
