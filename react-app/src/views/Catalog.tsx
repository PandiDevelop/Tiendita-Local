import { useStore } from '../store';
import { money, esc, inventorySold, DEFAULT_PRODUCT_IMAGE } from '../lib/core';
import { Image } from '../ui';

export function Catalog() {
  const { store, state, replace, setModal, setModalArg } = useStore();
  const s = store!;
  const sold = inventorySold(s);
  const inv = s.inventory || {};

  const storeCats = () => {
    const cats: string[] = [];
    (s.categories || []).forEach((c) => { const v = (c || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
    s.products.forEach((p) => { const v = (p.category || '').trim(); if (v && !cats.includes(v)) cats.push(v); });
    return cats;
  };

  const grouped: Record<string, typeof s.products> = {};
  s.products.forEach((p) => { const c = (p.category || '').trim() || 'Sin categoría'; (grouped[c] = grouped[c] || []).push(p); });
  const groups = storeCats().map((c) => ({ name: c, list: grouped[c] || [] }));
  if (grouped['Sin categoría']) groups.push({ name: 'Sin categoría', list: grouped['Sin categoría'] });

  function catOpen(cat: string) {
    return !state.openCats || !state.openCats[s.id] || state.openCats[s.id][cat] !== false;
  }
  function toggleCat(cat: string) {
    replace((d) => {
      d.openCats = d.openCats || {};
      d.openCats[s.id] = d.openCats[s.id] || {};
      d.openCats[s.id][cat] = !catOpen(cat);
    });
  }
  function addCategory() {
    const v = (prompt('Nombre de la nueva categoría') || '').trim();
    if (!v) return;
    if (storeCats().includes(v)) return;
    replace((d) => {
      const st = d.stores.find((x) => x.id === s.id);
      st!.categories = st!.categories || [];
      st!.categories.push(v);
    });
  }

  return (
    <div className="panel">
      <div className="panel-head"><div><h2>Catálogo de productos</h2><p className="muted">Precios, existencias y promociones de {esc(s.name)}, organizados por categoría.</p></div></div>
      <div className="cat-actions">
        <button className="button primary" onClick={addCategory}>＋ Añadir categoría</button>
        <div className="cat-divider"></div>
        <button className="button primary" onClick={() => setModal('newProduct')}>＋ Añadir producto</button>
      </div>
      {s.products.length ? groups.map((g) => {
        const open = catOpen(g.name);
        return (
          <div className="cat-group" key={g.name}>
            <button className="cat-head" onClick={() => toggleCat(g.name)}>
              <span className="cat-caret">{open ? '▾' : '▸'}</span><b>{esc(g.name)}</b>
              <span className="muted">· {g.list.length} producto{g.list.length === 1 ? '' : 's'}</span>
            </button>
            {open && (
              <div className="cat-body">
                {g.list.length ? (
                  <table><thead><tr><th>Producto</th><th>Precio</th><th>Disponible</th><th>Promociones</th><th></th></tr></thead><tbody>
                    {g.list.map((p) => {
                      const base = inv[p.id];
                      const avail = base == null ? '—' : Math.max(0, base - (sold[p.id] || 0));
                      return (
                        <tr key={p.id}>
                          <td className="cat-bar"><div className="product-cell"><div className="product-name">{esc(p.name)}</div><Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="product-image-cell" /></div></td>
                          <td>{money(p.price)}</td><td>{avail}</td>
                          <td>{p.promos.length ? <div className="promo-stack">{p.promos.map((x) => <span className="promotion" key={x.id}>{esc(x.label)} · {money(x.price)}</span>)}</div> : <span className="muted">—</span>}</td>
                          <td><div className="actions"><button className="icon-btn" onClick={() => { setModalArg(p.id); setModal('editProduct'); }}>✎</button></div></td>
                        </tr>
                      );
                    })}
                  </tbody></table>
                ) : <div className="notice">Sin productos en esta categoría todavía.</div>}
              </div>
            )}
          </div>
        );
      }) : <div className="empty"><div className="emoji">📦</div><b>Tu catálogo está vacío</b><p>Agrega el primer producto para empezar.</p></div>}
    </div>
  );
}
