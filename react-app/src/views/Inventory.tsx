import { useState } from 'react';
import { useStore } from '../store';
import { esc, inventorySold, adoptInvLog } from '../lib/core';
import { Modal } from '../ui';
import type { Product } from '../types';

export function Inventory() {
  const { store, replace, toast } = useStore();
  const s = store!;
  const [mode, setMode] = useState<'stock' | 'log'>('stock');
  const [editing, setEditing] = useState<Product | null>(null);
  const [delta, setDelta] = useState(1);
  const [supplier, setSupplier] = useState('');
  const [adj, setAdj] = useState<'add' | 'sub'>('add');

  const sold = inventorySold(s);
  const base = s.inventory || {};
  const log = (s.invLog || []).slice();
  const byId = new Map(s.products.map((p) => [p.id, p]));

  function open(p: Product) {
    setEditing(p);
    setDelta(1);
    setSupplier('');
    setAdj('add');
  }

  function save() {
    if (!editing) return;
    const q = Math.floor(delta);
    if (!Number.isFinite(q) || q <= 0) return toast('Escribe una cantidad mayor a cero.');
    const d = adj === 'add' ? q : -q;
    replace((x) => {
      const st = x.stores.find((y) => y.id === s.id)!;
      adoptInvLog(st, editing.id, d, supplier.trim());
    });
    toast(adj === 'add' ? 'Existencias registradas.' : 'Existencias descontadas.');
    setEditing(null);
  }

  const nameOf = (pid: string) => byId.get(pid)?.name || 'Producto eliminado';

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h2>Inventario</h2><p className="muted">Repón existencias aquí. Las ventas las descuentan solas.</p></div>
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
                  <button className="button primary inv-restock" onClick={() => open(p)}>＋ Reponer</button>
                </td>
              </tr>
            );
          })}
        </tbody></table>
      ) : <div className="notice">Aún no hay productos en el catálogo.</div>}

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h2>Reponer · {esc(editing.name)}</h2>
          <div className="field"><label>Cantidad</label>
            <div className="sale-builder-qty">
              <button type="button" className="qty-btn" onClick={() => setDelta(Math.max(1, delta - 1))}>−</button>
              <input className="qty-input" type="number" min={1} inputMode="numeric" value={delta} onChange={(e) => setDelta(Math.max(1, Number(e.target.value) || 0))} />
              <button type="button" className="qty-btn" onClick={() => setDelta(delta + 1)}>+</button>
            </div>
          </div>
          <div className="field"><label>Ajuste</label>
            <div className="inv-modes">
              <button type="button" className={'inv-mode' + (adj === 'add' ? ' on' : '')} onClick={() => setAdj('add')}>Sumar</button>
              <button type="button" className={'inv-mode' + (adj === 'sub' ? ' on' : '')} onClick={() => setAdj('sub')}>Restar</button>
            </div>
          </div>
          <div className="field"><label>Proveedor</label>
            <input maxLength={60} placeholder="Ej. Distribuidora del Sur" value={supplier} onChange={(e) => setSupplier(e.target.value)} autoFocus />
          </div>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => setEditing(null)}>Cancelar</button>
            <button className="button primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}