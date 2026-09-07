import { useState } from 'react';
import { useStore } from '../store';
import { esc, inventorySold, adoptInvLog } from '../lib/core';
import { Modal } from '../ui';
import type { Product } from '../types';

interface QtyPopup { p: Product; qty: number; }

export function Inventory() {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [mode, setMode] = useState<'stock' | 'log'>('stock');
  const [edit, setEdit] = useState<QtyPopup | null>(null);
  const [cargo, setCargo] = useState<QtyPopup | null>(null);

  const sold = inventorySold(s);
  const base = s.inventory || {};
  const log = (s.invLog || []).slice();
  const byId = new Map(s.products.map((p) => [p.id, p]));

  function cur(p: Product): number {
    return Math.round(base[p.id] || 0);
  }

  function bump(p: Product, delta: number) {
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      adoptInvLog(st, p.id, delta, '');
    });
  }

  // Lápiz: fijar la cantidad exacta (sin proveedor).
  function openEdit(p: Product) {
    setEdit({ p, qty: cur(p) });
  }

  // Cargamento: añadir un lote nuevo con distribuidor.
  function openCargo(p: Product) {
    setCargo({ p, qty: 0 });
  }

  function saveEdit() {
    if (!edit) return;
    const q = Math.round(edit.qty);
    if (!Number.isFinite(q) || q < 0) return toast('Escribe una cantidad válida.');
    const delta = q - cur(edit.p);
    if (delta !== 0) {
      replace((x) => {
        const st = x.stores.find((y) => y.id === s.id)!;
        adoptInvLog(st, edit.p.id, delta, '');
      });
    }
    toast('Cantidad actualizada.');
    setEdit(null);
  }

  function saveCargo() {
    if (!cargo) return;
    const q = Math.round(cargo.qty);
    if (!Number.isFinite(q) || q <= 0) return toast('Escribe una cantidad mayor a 0.');
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      adoptInvLog(st, cargo.p.id, q, cargoSupplier);
    });
    toast('Cargamento registrado.');
    setCargo(null);
    setCargoSupplier('');
  }

  const [cargoSupplier, setCargoSupplier] = useState('');

  const nameOf = (pid: string) => byId.get(pid)?.name || 'Producto eliminado';

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Inventario</h2><p className="muted">Repón y ajusta existencias aquí. Las ventas las descuentan solas.</p></div>
        <div className="inv-modes">
          <button type="button" className={'inv-mode' + (mode === 'stock' ? ' on' : '')} onClick={() => setMode('stock')}>Existencias</button>
          <button type="button" className={'inv-mode' + (mode === 'log' ? ' on' : '')} onClick={() => setMode('log')}>Historial de cambios</button>
        </div>
      </div>

      {mode === 'log' ? (
        log.length ? (
          <table><thead><tr><th>Fecha</th><th>Hora</th><th>Producto</th><th>Cantidad</th><th>Proveedor</th></tr></thead><tbody>
            {log.map((e) => (
              <tr key={e.id}>
                <td className="muted">{esc(e.date || '—')}</td>
                <td className="muted">{esc(e.time || '—')}</td>
                <td className="product-name">{esc(nameOf(e.productId))}</td>
                <td className={'inv-qty ' + (e.qty >= 0 ? 'add' : 'sub')}>{e.qty >= 0 ? '+' + e.qty : e.qty}</td>
                <td className="muted">{e.supplier ? esc(e.supplier) : '—'}</td>
              </tr>
            ))}
          </tbody></table>
        ) : <div className="notice">Aún no hay cambios registrados en el inventario.</div>
      ) : s.products.length ? (
        <table><thead><tr><th>Producto</th><th>Comprado</th><th>Disponible</th><th>Ajustar</th></tr></thead><tbody>
          {s.products.map((p) => {
            const has = base[p.id] != null;
            const buy = has ? Math.round(base[p.id]) : null;
            const avail = has ? Math.max(0, buy! - (sold[p.id] || 0)) : null;
            return (
              <tr key={p.id}>
                <td className="product-name">{esc(p.name)}</td>
                <td>{buy == null ? '—' : buy}</td>
                <td>{avail == null ? '—' : avail}</td>
                <td className="inv-actions">
                  <div className="inv-stepper">
                    <button className="qty-btn" title="Restar 1" onClick={() => bump(p, -1)}>−</button>
                    <button className="icon-btn" title="Editar cantidad exacta" onClick={() => openEdit(p)}>✎</button>
                    <button className="qty-btn" title="Sumar 1" onClick={() => bump(p, 1)}>+</button>
                    <button className="inv-cargo" title="Nuevo cargamento" onClick={() => openCargo(p)}>🚚</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody></table>
      ) : <div className="notice">Aún no hay productos en el catálogo.</div>}

      {edit && (
        <Modal onClose={() => setEdit(null)}>
          <h2>Editar existencias</h2>
          <div className="field"><label>Producto</label>
            <div className="product-name" style={{ fontWeight: 700 }}>{esc(edit.p.name)}</div>
          </div>
          <div className="field"><label>Cantidad que tiene el producto</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: Math.max(0, edit.qty - 1) })}>−</button>
              <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={edit.qty} onChange={(e) => setEdit({ ...edit, qty: Math.max(0, Number(e.target.value) || 0) })} />
              <button type="button" className="qty-btn" onClick={() => setEdit({ ...edit, qty: edit.qty + 1 })}>+</button>
            </div>
            <p className="muted">Escribe el total de unidades compradas (no lo que queda tras las ventas).</p>
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setEdit(null)}>Cancelar</button>
            <button className="button primary" onClick={saveEdit}>Guardar</button>
          </div>
        </Modal>
      )}

      {cargo && (
        <Modal onClose={() => setCargo(null)}>
          <h2>Nuevo cargamento</h2>
          <div className="field"><label>Producto</label>
            <div className="product-name" style={{ fontWeight: 700 }}>{esc(cargo.p.name)}</div>
          </div>
          <div className="field"><label>Unidades del lote</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setCargo({ ...cargo, qty: Math.max(0, cargo.qty - 1) })}>−</button>
              <input className="qty-input" type="number" min={0} step={1} inputMode="numeric" value={cargo.qty} onChange={(e) => setCargo({ ...cargo, qty: Math.max(0, Number(e.target.value) || 0) })} />
              <button type="button" className="qty-btn" onClick={() => setCargo({ ...cargo, qty: cargo.qty + 1 })}>+</button>
            </div>
            <p className="muted">Cantidad que llega ahora; se suma a las existencias.</p>
          </div>
          <div className="field"><label>Distribuidor / proveedor</label>
            <input maxLength={60} placeholder="Ej. Distribuidora del Sur" value={cargoSupplier} onChange={(e) => setCargoSupplier(e.target.value)} autoFocus />
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setCargo(null)}>Cancelar</button>
            <button className="button primary" onClick={saveCargo}>Registrar cargamento</button>
          </div>
        </Modal>
      )}
    </div>
  );
}