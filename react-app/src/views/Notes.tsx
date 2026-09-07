import { useEffect, useState } from 'react';
import { useStore } from '../store';

export function Notes() {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [text, setText] = useState(s.notes || '');

  useEffect(() => {
    setText((cur) => (cur === s.notes || cur === '' ? s.notes || '' : cur));
  }, [s.notes]);

  function save() {
    replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.notes = text; });
    toast('Notas guardadas.');
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Notas del equipo</h2><p className="muted">Tablero compartido con las personas sincronizadas con la tienda.</p></div>
        <button className="button primary" onClick={save}>Guardar notas</button>
      </div>
      <textarea
        className="notes-box"
        rows={12}
        placeholder="Escribe aquí lo que quieras compartir con tu equipo… (recetas, pendientes, avisos)"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}