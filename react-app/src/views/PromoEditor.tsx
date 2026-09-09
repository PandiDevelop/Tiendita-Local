import type { EditablePromo } from '../lib/core';
import { uid } from '../lib/core';
import { CloseIcon } from '../ui';

interface Props {
  promos: EditablePromo[];
  onChange: (list: EditablePromo[]) => void;
  // Precio que se sugiere al crear una promoción de precio fijo nueva.
  priceHint?: string;
}

const blank = (priceHint?: string): EditablePromo => ({ id: uid(), label: '', type: 'price', price: priceHint || '0', pct: '', cond: 'qtyeq', min: '1', start: '', end: '' });

const ChevUp = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 14l6 -6 6 6" /></svg>
);
const ChevDown = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10l6 6 6 -6" /></svg>
);

// Editor reutilizable de promociones (lo usan el formulario de producto y el
// de categoría). La recompensa es un precio fijo o un % de descuento. La
// condición es de CANTIDAD de unidades de la misma categoría en la venta:
//  - "Cantidad fija": se aplica con EXACTAMENTE N unidades y su precio es el
//    TOTAL del paquete (lo que cuestan las N unidades juntas). Varias promos
//    fijas crean un precio por BLOQUE que se reinicia (el bloque es la
//    cantidad más grande; el sobrante usa la promo fija exacta o el precio
//    base). Ej: fija 2 = 8.000 y fija 3 = 10.000 hace que la cuarta unidad
//    vuelva a costar el precio base.
//  - "Cantidad mayor a": se aplica cuando hay MÁS de N unidades.
// El ORDEN de la lista es la prioridad: cuando una promo se cumple en la
// venta, la PRIMERA de la lista que aplique es la que gana.
export function PromoEditor({ promos, onChange, priceHint }: Props) {
  const setAt = (n: number, p: Partial<EditablePromo>) => onChange(promos.map((y, i) => i === n ? { ...y, ...p } : y));
  const move = (n: number, dir: -1 | 1) => {
    const j = n + dir;
    if (j < 0 || j >= promos.length) return;
    const next = promos.slice();
    [next[n], next[j]] = [next[j], next[n]];
    onChange(next);
  };
  return (
    <div className="promo-editor">
      {promos.length === 0 && <p className="muted">Sin promociones. La primera que cumpla su condición se aplica sola (el orden = prioridad). "Cantidad fija" = precio del paquete completo.</p>}
      {promos.map((x, n) => (
        <div className="promo-input" key={x.id}>
          <div className="promo-row-top">
            <input className="promo-label" maxLength={70} placeholder="Nombre de la promoción" value={x.label} onChange={(e) => setAt(n, { label: e.target.value })} />
            <button type="button" className="icon-btn inv-stepper" title="Subir prioridad" onClick={() => move(n, -1)}><ChevUp /></button>
            <button type="button" className="icon-btn inv-stepper" title="Bajar prioridad" onClick={() => move(n, 1)}><ChevDown /></button>
            <button type="button" className="icon-remove" title="Quitar promoción" onClick={() => onChange(promos.filter((_, i) => i !== n))}><CloseIcon size={13} /></button>
          </div>
          <div className="promo-row-conds">
            <select className="promo-select" value={x.type} onChange={(e) => setAt(n, { type: e.target.value as EditablePromo['type'] })}>
              <option value="price">Precio fijo</option>
              <option value="pct">% de descuento</option>
            </select>
            {x.type === 'price'
              ? <input className="promo-price" min={0} type="number" placeholder={x.cond === 'qtyeq' ? 'Precio total del paquete' : 'Precio por unidad'} value={x.price} onChange={(e) => setAt(n, { price: e.target.value })} />
              : <input className="promo-pct" min={0} max={100} type="number" placeholder="% de descuento" value={x.pct} onChange={(e) => setAt(n, { pct: e.target.value })} />}
            <select className="promo-select" value={x.cond} onChange={(e) => setAt(n, { cond: e.target.value as EditablePromo['cond'] })}>
              <option value="qtyeq">Cantidad fija</option>
              <option value="qtygt">Cantidad mayor a</option>
            </select>
            {x.cond === 'qtyeq'
              ? <input className="promo-min" min={1} type="number" placeholder="Unidades exactas" value={x.min} onChange={(e) => setAt(n, { min: e.target.value })} />
              : <input className="promo-min" min={0} type="number" placeholder="Unidades mínimas" value={x.min} onChange={(e) => setAt(n, { min: e.target.value })} />}
          </div>
        </div>
      ))}
      <button className="add-promo" onClick={() => onChange([...promos, blank(priceHint)])}>＋ Agregar promoción</button>
    </div>
  );
}