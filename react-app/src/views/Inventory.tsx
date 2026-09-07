import { useStore } from '../store';
import { esc, inventorySold } from '../lib/core';

export function Inventory() {
  const { store, replace } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const base = s.inventory || {};
  return (
    <div className="panel">
      <div className="panel-head"><div><h2>Inventario</h2><p className="muted">Repón existencias aquí. Las ventas las descuentan solas.</p></div></div>
      {s.products.length ? (
        <table><thead><tr><th>Producto</th><th>Comprado</th><th>Disponible</th><th>Reponer</th></tr></thead><tbody>
          {s.products.map((p) => {
            const has = base[p.id] != null;
            const buy = has ? base[p.id] : null;
            const avail = has ? Math.max(0, base[p.id] - (sold[p.id] || 0)) : null;
            return (
              <tr key={p.id}>
                <td className="product-name">{esc(p.name)}</td>
                <td>{buy == null ? '—' : buy}</td>
                <td>{avail == null ? '—' : avail}</td>
                <td className="inv-actions">
                  <button className="icon-btn" onClick={() => replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.inventory = st.inventory || {}; st.inventory[p.id] = (st.inventory[p.id] || 0) + 1; })}>+1</button>
                  <button className="icon-btn" onClick={() => replace((d) => { const st = d.stores.find((x) => x.id === s.id)!; st.inventory = st.inventory || {}; st.inventory[p.id] = (st.inventory[p.id] || 0) + 10; })}>+10</button>
                </td>
              </tr>
            );
          })}
        </tbody></table>
      ) : <div className="notice">Aún no hay productos en el catálogo.</div>}
    </div>
  );
}
