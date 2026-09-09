import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DialogRequest, customConfirm, resolveDialog, subscribeDialog } from './lib/dialog';
import { closeLightbox, openLightbox, subscribeLightbox } from './lib/lightbox';

// Antes no habia forma de ver una foto (de producto, tienda, etc.) mas
// grande que la miniatura de la lista: tocarla no hacia nada, o en algunos
// casos disparaba sin querer la accion de la fila (editar, seleccionar
// tienda...). Ahora, si la imagen tiene una foto real, tocarla la abre en
// grande (ImageLightboxHost) sin disparar el click de lo que la rodea;
// enlarge={false} se usa en los pocos lugares donde tocar la miniatura ya
// tiene su propia accion clara (p.ej. la lista de tiendas del menu).
export function Image({ src, cls, alt = '', enlarge = true }: { src?: string; cls?: string; alt?: string; enlarge?: boolean }) {
  const canEnlarge = enlarge && !!src;
  return (
    <img
      className={cls}
      src={src}
      alt={alt}
      onClick={canEnlarge ? (e) => { e.stopPropagation(); openLightbox(src!); } : undefined}
      style={canEnlarge ? { cursor: 'zoom-in' } : undefined}
    />
  );
}

// Muestra la foto abierta con openLightbox() por encima de todo, a tamaño
// grande. Se monta una sola vez junto a DialogHost.
export function ImageLightboxHost() {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => subscribeLightbox(setSrc), []);
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [src]);
  if (!src) return null;
  return (
    <div className="modal-backdrop lightbox-backdrop" onClick={closeLightbox}>
      <img className="lightbox-img" src={src} alt="" />
    </div>
  );
}

// Selector de imagen con dos opciones: elegir un archivo (galeria) o tomar la
// foto en el momento con la camara del dispositivo (input oculto con
// capture="environment"). En escritorio el boton de camara simplemente abre
// el mismo selector de archivos, asi que no rompe nada ahi.
export function ImagePicker({ id, src, cls, hint, onFile, disabled }: { id: string; src?: string; cls?: string; hint?: string; onFile: (f: File | undefined) => void; disabled?: boolean }) {
  const cameraId = id + '-camera';
  // Los dos inputs de archivo van ocultos y cada uno se dispara desde un
  // boton propio con el MISMO estilo (antes uno era el selector nativo del
  // navegador, gris y distinto en cada sistema, y el otro un boton de la
  // app: se veian como dos cosas distintas). Asi 'Elegir archivo' y 'Tomar
  // foto' se ven como una sola pareja de acciones coherente. El hint va
  // FUERA de la fila de centrado para que la foto quede alineada con el
  // centro de los dos botones, no con botones + texto.
  return (
    <div className="image-picker-wrap">
      <div className="image-picker">
        <Image src={src} cls={cls} />
        <div className="image-picker-actions">
          <input id={id} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} disabled={disabled} style={{ display: 'none' }} />
          <button type="button" className="button secondary" disabled={disabled} onClick={() => document.getElementById(id)?.click()}>Elegir archivo</button>
          <input id={cameraId} type="file" accept="image/*" capture="environment" onChange={(e) => onFile(e.target.files?.[0])} disabled={disabled} style={{ display: 'none' }} />
          <button type="button" className="button secondary" disabled={disabled} onClick={() => document.getElementById(cameraId)?.click()}>Tomar foto</button>
        </div>
      </div>
      {hint && <p className="muted image-picker-hint">{hint}</p>}
    </div>
  );
}

export function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">{children}</div>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return <div id="toast" className={message ? 'show' : ''} role="status" aria-live="polite">{message}</div>;
}

// Host del dialogo personalizado (ver lib/dialog.ts). Se monta una sola vez
// en la raiz de la app; escucha las peticiones de customAlert/customConfirm
// y muestra un Modal en vez del alert()/confirm() nativo del navegador.
export function DialogHost() {
  const [req, setReq] = useState<DialogRequest | null>(null);
  useEffect(() => subscribeDialog(setReq), []);
  if (!req) return null;
  return (
    <div className="modal-backdrop dialog-backdrop">
      <div className="modal dialog-modal">
        <p className="dialog-msg">{req.message}</p>
        <div className="modal-actions">
          {req.kind === 'confirm' && <button className="button secondary" onClick={() => resolveDialog(false)}>Cancelar</button>}
          <button className="button primary" onClick={() => resolveDialog(true)}>{req.kind === 'confirm' ? 'Sí, continuar' : 'Aceptar'}</button>
        </div>
      </div>
    </div>
  );
}

// Reemplazo de window.confirm() pensado para manejadores de eventos de React
// (no async): dispara el dialogo personalizado y ejecuta onYes si confirman.
export function confirmDialog(message: string, onYes: () => void): void {
  customConfirm(message).then((ok) => { if (ok) onYes(); });
}

// Icono de tuerca (configuracion) en SVG, con el mismo trazo que los demas
// iconos de la app. Se usa en los botones de "configurar categoria" y
// "editar producto" del Catalogo/Inventario: antes eran el emoji ⚙, que se
// veia distinto en cada dispositivo. El tamano por defecto es un poco mayor
// que el de un boton de texto para que se lea bien.
export function GearIcon({ size = 19 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01a1.7 1.7 0 0 0 1.03-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.55 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1.03z" />
    </svg>
  );
}

// Icono de lapiz, con el mismo trazo de los demas iconos. Se usa en la opcion
// "Nueva categoria / Nuevo tag" que aparece cuando el valor que se escribe no
// coincide con ninguno ya registrado.
export function PencilIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.5 3.5a2.6 2.6 0 1 1 3.7 3.6L7.7 20.6 2 22l1.4-5.6z" />
    </svg>
  );
}

// Menú desplegable de la tuerca: Editar y Eliminar (productos y categorías).
// Se renderiza en un portal pegado al body y con posición fija, así que se
// SUPERPONE a las demás cajas (nunca lo corta una tabla o tarjeta con
// overflow). Siempre cae hacia abajo del botón; si quedaría debajo del borde
// de la pantalla, la página se desplaza suave y el menú se pega al botón
// mientras el scroll lo acomoda. Se cierra al tocar fuera o elegir una opción.
export function GearMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [w, setW] = useState(170);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const syncPos = () => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ left: Math.min(Math.max(6, r.right - w), window.innerWidth - w - 6), top: r.bottom + 5 });
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && menuRef.current && !wrapRef.current.contains(t) && !menuRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    const onScroll = () => syncPos();
    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = requestAnimationFrame(() => {
      const m = menuRef.current;
      if (!m) return;
      setW(m.offsetWidth);
      syncPos();
      const r = wrapRef.current!.getBoundingClientRect();
      if (r.bottom + 5 + m.offsetHeight > window.innerHeight - 4) {
        window.scrollBy({ top: r.bottom + 5 + m.offsetHeight - window.innerHeight + 12, behavior: 'smooth' });
      }
    });
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <>
      <div className="actions" ref={wrapRef}>
        <button type="button" className="icon-btn" title="Opciones"
          onClick={() => setOpen((o) => !o)}>
          <GearIcon />
        </button>
      </div>
      {open && pos && createPortal(
        <div className="action-menu gear-menu-portal" ref={menuRef} style={{ left: pos.left, top: pos.top }}>
          {items.map((it) => (
            <button key={it.label} type="button" className={it.danger ? 'danger' : ''}
              onClick={() => { setOpen(false); it.onClick(); }}>{it.label}</button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

// Campo de texto con sugerencias de valores ya registrados (categorías, tags…):
// se tocan para elegirlos con un clic, o se puede escribir un valor nuevo.
// Cuando lo escrito no coincide con nada existente, aparece la opción
// "Nueva categoría / Nuevo tag" (con un lápiz) para crearlo.
export function SuggestInput({ options, value, onChange, onPick, placeholder, maxLength = 30, newLabel, onNewPick }: {
  options: string[]; value: string; onChange: (v: string) => void; onPick: (v: string) => void; placeholder?: string; maxLength?: number; newLabel?: string; onNewPick?: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const q = ((value || '').trim()).toLowerCase();
  const shown = options.filter((c) => c.trim().toLowerCase() !== q && c.trim().toLowerCase().includes(q)).slice(0, 6);
  // Si lo que se escribe ya está registrado exactamente, no hace falta
  // sugerir "Nueva…": lo normal es que quiera elegir el que ya existe.
  const isExisting = !!q && options.some((c) => c.trim().toLowerCase() === q);
  const showNew = !!newLabel && !!q && !isExisting;
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  return (
    <div className="cat-suggest" ref={wrapRef}>
      <input maxLength={maxLength} placeholder={placeholder} value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)} />
      {open && (shown.length > 0 || showNew) && (
        <div className="cat-suggest-list">
          {shown.map((c) => (
            <button type="button" key={c} onMouseDown={(e) => { e.preventDefault(); setOpen(false); onPick(c); }}>{c}</button>
          ))}
          {showNew && (
            <button type="button" className="cat-suggest-new" onMouseDown={(e) => { e.preventDefault(); setOpen(false); if (onNewPick) onNewPick(value); }}>
              <PencilIcon size={13} /> {newLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function CategorySuggest({ cats, value, onChange, onPick, placeholder, maxLength = 30, newLabel, onNewPick }: {
  cats: string[]; value: string; onChange: (v: string) => void; onPick: (v: string) => void; placeholder?: string; maxLength?: number; newLabel?: string; onNewPick?: (v: string) => void;
}) {
  return <SuggestInput options={cats} value={value} onChange={onChange} onPick={onPick} placeholder={placeholder} maxLength={maxLength} newLabel={newLabel} onNewPick={onNewPick} />;
}