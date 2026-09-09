import { useEffect } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, esc, groupedByCategory, money, shortTag } from '../lib/core';
import { Image } from '../ui';

// Libro de catálogo virtual: todos los productos de la tienda separados por
// categoría, con su foto como referencia (foto, nombre y precio). Se abre a
// pantalla completa desde Catálogo para enseñárselo a un cliente sin
// distracciones; tocar una foto la abre en grande (Image agranda sola).
export function VirtualCatalog({ onClose }: { onClose: () => void }) {
  const { store } = useStore();
  const s = store!;
  const groups = groupedByCategory(s);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop vc-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="vc-head">
          <div className="vc-title">{esc(s.name)}<div className="vc-sub">Catálogo virtual · {s.products.length} producto{s.products.length === 1 ? '' : 's'}</div></div>
          <button className="button secondary" onClick={onClose}>Cerrar</button>
        </div>
        <div className="vc-body">
          {groups.length ? groups.map((g) => (
            <section className="vc-cat" key={g.name}>
              <h3 className="vc-cat-title">{esc(g.name)} <span className="muted">{g.list.length === 1 ? '1 producto' : g.list.length + ' productos'}</span></h3>
              <div className="vc-grid">
                {g.list.map((p) => (
                  <div className="vc-card" key={p.id}>
                    <Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="vc-img" alt={p.name} />
                    <div className="vc-name">{esc(p.name)}{p.tag && p.tag.trim() ? <span className="prod-tag" title={esc(p.tag)}>{esc(shortTag(p.tag))}</span> : null}</div>
                    <div className="vc-price">{money(p.price)}</div>
                  </div>
                ))}
              </div>
            </section>
          )) : <div className="notice">Tu catálogo está vacío: agrega productos primero.</div>}
        </div>
      </div>
    </div>
  );
}