import { useEffect } from 'react';
import { useStore } from '../store';
import { DEFAULT_PRODUCT_IMAGE, esc, groupedByCategory, money, shortTag, productTags } from '../lib/core';
import { Image, PrintIcon } from '../ui';
import type { Product } from '../types';

function chunks<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Libro de catálogo virtual: todos los productos de la tienda separados por
// categoría, con su foto como referencia (foto, nombre y precio). Se abre a
// pantalla completa desde Catálogo para enseñárselo a un cliente sin
// distracciones; tocar una foto la abre en grande (Image agranda sola).
//
// También se puede imprimir: el botón "Imprimir" llama a window.print() y la
// versión impresa sale como un mini catálogo en papel, con una portada por
// categoría y 4 productos por página (las categorías vacías se omiten). El
// bloque .print-catalog está oculto en pantalla y solo aparece en @media
// print (ver styles.css).
export function VirtualCatalog({ onClose }: { onClose: () => void }) {
  const { store } = useStore();
  const s = store!;
  const groups = groupedByCategory(s);
  const printedGroups = groups.filter((g) => g.list.length > 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="modal-backdrop vc-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal">
          <div className="vc-head">
            <div className="vc-title">{esc(s.name)}<div className="vc-sub">Catálogo virtual · {s.products.length} producto{s.products.length === 1 ? '' : 's'}</div></div>
            <div className="vc-actions">
              <button className="button" disabled={!printedGroups.length} onClick={() => { if (typeof window !== 'undefined' && typeof window.print === 'function') window.print(); }}><PrintIcon size={15} /> Imprimir</button>
              <button className="button secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
          <div className="vc-body">
            {groups.length ? groups.map((g) => (
              <section className="vc-cat" key={g.name}>
                <h3 className="vc-cat-title">{esc(g.name)} <span className="muted">{g.list.length === 1 ? '1 producto' : g.list.length + ' productos'}</span></h3>
                <div className="vc-grid">
                  {g.list.map((p) => (
                    <div className="vc-card" key={p.id}>
                      <Image src={p.image || DEFAULT_PRODUCT_IMAGE} cls="vc-img" alt={p.name} />
                      <div className="vc-name">{esc(p.name)}{productTags(p).map((t) => <span className="prod-tag" key={t} title={esc(t)}>{esc(shortTag(t))}</span>)}</div>
                      <div className="vc-price">{money(p.price)}</div>
                    </div>
                  ))}
                </div>
              </section>
            )) : <div className="notice">Tu catálogo está vacío: agrega productos primero.</div>}
          </div>
        </div>
      </div>
      {printedGroups.length > 0 && (
        <div className="print-catalog" aria-hidden="true">
          <header className="pc-brand">Mi Tiendita<span> · Catálogo</span></header>
          {printedGroups.map((g) => (
            <section className="pc-section" key={g.name}>
              <div className="pc-page pc-cover">
                <div className="pc-cover-tile">
                  <p className="pc-kicker">Mi Tiendita · catálogo virtual</p>
                  <h2>{esc(g.name)}</h2>
                  <p>{g.list.length === 1 ? '1 producto' : g.list.length + ' productos'}</p>
                </div>
              </div>
              {chunks<Product>(g.list, 4).map((chunk, ci) => (
                <div className="pc-page" key={ci}>
                  <div className="pc-page-head"><b>{esc(s.name)}</b><span>{esc(g.name)}</span></div>
                  <div className="pc-grid">
                    {chunk.map((p) => (
                      <div className="pc-card" key={p.id}>
                        <img className="pc-img" src={p.image || DEFAULT_PRODUCT_IMAGE} alt={p.name} />
                        <div className="pc-card-name">{esc(p.name)}</div>
                        <div className="pc-card-price">{money(p.price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      )}
    </>
  );
}