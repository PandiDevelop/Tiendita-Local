import { useState } from 'react';
import { CaretIcon } from './ui';

export interface DropdownItem {
  v: string;
  label: string;
  count?: number;
}

export function Dropdown({ value, ph, items, onPick }: { value: string; ph?: string; items: DropdownItem[]; onPick: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const cur = items.find((x) => String(x.v) === String(value));
  return (
    <div className={'dd' + (open ? ' open' : '')} data-v={cur ? String(cur.v) : ''}>
      <button type="button" className="dd-btn" onClick={() => setOpen((o) => !o)}>
        <span className="dd-value">{cur ? cur.label : (ph || 'Seleccionar…')}</span>
        <span className="dd-caret"><CaretIcon size={13} deg={open ? 180 : 0} /></span>
      </button>
      <div className="dd-options">
        <div className="dd-pop">
          {items.map((it) => (
            <button
              type="button"
              key={it.v}
              className={'dd-opt' + (String(it.v) === String(value) ? ' on' : '')}
              data-v={String(it.v)}
              onClick={() => { setOpen(false); onPick(String(it.v)); }}
            >
              <span className="dd-opt-label">{it.label}</span>
              {it.count != null && <span className="dd-count">{it.count}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}