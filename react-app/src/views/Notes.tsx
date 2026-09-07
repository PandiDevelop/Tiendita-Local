import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

export function Notes() {
  const { store, replace } = useStore();
  const s = store!;
  const [text, setText] = useState(s.notes || '');
  const [status, setStatus] = useState<'saved' | 'typing'>('saved');
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const t = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    setText(s.notes || '');
  }, [s.id]);

  // El texto remoto nuevo (otro dispositivo) se muestra cuando no estás
  // escribiendo en el momento; si estás escribiendo, se toma al soltar el foco.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const focused = document.activeElement === taRef.current;
    if (!focused) setText((cur) => (cur === s.notes ? cur : s.notes || ''));
  }, [s.notes]);

  function onChange(v: string) {
    setText(v);
    setStatus('typing');
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => {
      replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.notes = v; });
      const onBlur = () => { if (taRef.current) taRef.current.removeEventListener('blur', onBlur); };
      if (taRef.current) taRef.current.addEventListener('blur', onBlur);
      setStatus('saved');
    }, 700);
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Notas del equipo</h2><p className="muted">Tablero compartido: se sincroniza en tiempo real con las personas vinculadas a la tienda.</p></div>
        <span className={'notes-ws' + (status === 'typing' ? ' typing' : '')}>{status === 'typing' ? 'Guardando…' : 'Sincronizado'}</span>
      </div>
      <textarea
        ref={taRef}
        className="notes-box"
        rows={12}
        placeholder="Escribe aquí lo que quieras compartir con tu equipo… (recetas, pendientes, avisos)"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (text !== (s.notes || '')) replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.notes = text; });
        }}
      />
    </div>
  );
}