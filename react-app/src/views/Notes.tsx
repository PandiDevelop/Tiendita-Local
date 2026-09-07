import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

export function Notes() {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [text, setText] = useState(s.notes || '');
  const [status, setStatus] = useState<'saved' | 'typing'>('saved');
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const t = useRef(0);

  function commit(v: string) {
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.notes = v; });
  }

  function saveNow() {
    commit(text);
    setStatus('saved');
    toast('Notas guardadas y sincronizadas.');
  }

  function onChange(v: string) {
    setText(v);
    setStatus('typing');
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => { commit(v); setStatus('saved'); }, 700);
  }

  // Refleja en vivo lo que llega de otro dispositivo, salvo que estés escribiendo.
  useEffect(() => {
    const focused = document.activeElement === taRef.current;
    if (!focused) {
      setText((cur) => (cur === s.notes ? cur : s.notes || ''));
      setStatus('saved');
    }
  }, [s.notes, s.id]);

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Notas del equipo</h2><p className="muted">Se guardan solas al escribir; el botón las manda al instante. Se sincronizan con las personas vinculadas a la tienda.</p></div>
        <div className="notes-head-actions">
          <span className={'notes-ws' + (status === 'typing' ? ' typing' : '')}>{status === 'typing' ? 'Guardando…' : 'Sincronizado'}</span>
          <button className="button primary" onClick={saveNow}>Guardar nota</button>
        </div>
      </div>
      <textarea
        ref={taRef}
        className="notes-box"
        rows={12}
        placeholder="Escribe aquí lo que quieras compartir con tu equipo… (se guarda solo y se ve en todos los dispositivos)"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => { if (text !== (s.notes || '')) commit(text); }}
      />
    </div>
  );
}