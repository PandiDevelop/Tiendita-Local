import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DialogRequest, customConfirm, resolveDialog, subscribeDialog } from './lib/dialog';
import { closeLightbox, openLightbox, subscribeLightbox } from './lib/lightbox';
import { pushOverlay } from './lib/backStack';
import { DEFAULT_STORE_IMAGE } from './lib/core';

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

// Logo de tienda con el color del tema: cuando la tienda aun no tiene foto,
// en vez del icono gris fijo (DEFAULT_STORE_IMAGE) se dibuja el mismo local
// pero en los colores del tema activo, para que cambie al cambiar el tema.
export function StoreImage({ src, cls, alt = '', enlarge = true }: { src?: string; cls?: string; alt?: string; enlarge?: boolean }) {
  if (src && src !== DEFAULT_STORE_IMAGE) return <Image src={src} cls={cls} alt={alt} enlarge={enlarge} />;
  return (
    <span className={cls + ' themed-store'} role="img" aria-label={alt || 'Tienda sin logo'}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <path d="M22 66 36 38h88l14 28z" fill="var(--brand-2)" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        <path d="M40 39h15v28H40zm32 0h16v28H72zm33 0h15v28h-15z" fill="var(--cream)" />
        <path d="M29 67h102v61H29z" fill="var(--surface)" stroke="currentColor" strokeWidth="5" />
        <path d="M45 83h30v45H45z" fill="var(--mint)" stroke="currentColor" strokeWidth="4" />
        <path d="M91 83h24v20H91z" fill="var(--peach)" stroke="currentColor" strokeWidth="4" />
        <path d="M62 93c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5z" fill="var(--cream)" opacity="0.85" />
      </svg>
    </span>
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
  useEffect(() => (src ? pushOverlay(closeLightbox) : undefined), [src]);
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
        <StoreImage src={src} cls={cls} alt="Logo de la tienda" />
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

export function Modal({ onClose, children, backdropClose = true, modalClassName }: { onClose: () => void; children: ReactNode; backdropClose?: boolean; modalClassName?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  // El botón atrás del celular cierra este modal antes de salir de la app.
  useEffect(() => pushOverlay(onClose), [onClose]);
  return (
    <div className="modal-backdrop" onClick={(e) => { if (backdropClose && e.target === e.currentTarget) onClose(); }}>
      <div className={'modal' + (modalClassName ? ' ' + modalClassName : '')}>{children}</div>
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
  useEffect(() => (req ? pushOverlay(() => resolveDialog(false)) : undefined), [req]);
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

// Logotipo de la app: libreta de notas con su espiral y una lista con casilla
// marcada (misma pieza de arte que public/logo.svg, usado como favicon e
// icono de la PWA). Se usa en la portada de inicio y en la barra lateral,
// para que en pantalla, en la pestana del navegador y en la app instalada se
// vea siempre el mismo logo.
export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" width={size} height={size} role="img" aria-label="Logo de Mi Tiendita" aria-hidden="true">
      <defs>
        <linearGradient id="mt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-line)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="36" fill="url(#mt-bg)" />
      <rect x="30" y="29" width="100" height="102" rx="14" fill="var(--cream)" />
      <circle cx="52" cy="29" r="7.5" fill="var(--brand)" stroke="var(--cream)" strokeWidth="3" />
      <circle cx="80" cy="29" r="7.5" fill="var(--brand)" stroke="var(--cream)" strokeWidth="3" />
      <circle cx="108" cy="29" r="7.5" fill="var(--brand)" stroke="var(--cream)" strokeWidth="3" />
      <rect x="44" y="47" width="72" height="18" rx="9" fill="var(--peach)" />
      <rect x="46" y="79" width="16" height="16" rx="4" fill="var(--surface)" stroke="var(--lilac)" strokeWidth="4" />
      <path d="M48.5 88.5l4.2 4.2 8-8" fill="none" stroke="var(--brand)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="80" width="44" height="9" rx="4.5" fill="var(--lav)" />
      <rect x="46" y="105" width="68" height="9" rx="4.5" fill="var(--lav)" />
      <rect x="46" y="119" width="52" height="9" rx="4.5" fill="var(--lav)" />
    </svg>
  );
}

// Impresora: boton "Imprimir" del libro de catalogo virtual.
export function PrintIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7.5" y="3.5" width="9" height="4.5" rx="1.2" />
      <path d="M7 6.5A4.2 4.2 0 0 0 2.8 10.7v4.3a1 1 0 0 0 1 1h3.2v5H17v-5h3.2a1 1 0 0 0 1-1v-4.3A4.2 4.2 0 0 0 17 6.5z" />
      <rect x="9.5" y="15" width="5" height="3.5" rx="1" />
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

// Iconos de la seccion de Notas, mismo trazo que los demas (antes eran
// emojis: se veian distinto en cada dispositivo/sistema operativo).

// Hoja con lineas: pestaña "Nota" del compositor.
export function NoteTextIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <path d="M8 12.5h8M8 16.5h5" />
    </svg>
  );
}

// Portapapeles con chulos: pestaña "Lista de objetivos" y notas tipo checklist.
export function ChecklistIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="4.2" width="15" height="16.8" rx="2.2" />
      <rect x="9" y="2.4" width="6" height="3" rx="1" />
      <path d="M8 11.3l1.3 1.3L11.8 10" />
      <path d="M8 16.3l1.3 1.3L11.8 15" />
      <path d="M14.3 11.3h2.2M14.3 16.3h2.2" />
    </svg>
  );
}

// Casilla vacia: renglon de un objetivo mientras se arma la lista antes de publicar.
export function CheckboxOutlineIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
    </svg>
  );
}

// Chinche: insignia de nota fijada.
export function PinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.2c2.9 0 5.2 2.3 5.2 5.2 0 3.4-3.6 6.3-4.4 9.1a.85.85 0 0 1-1.6 0c-.8-2.8-4.4-5.7-4.4-9.1 0-2.9 2.3-5.2 5.2-5.2z" />
      <circle cx="12" cy="7.4" r="1.7" />
      <path d="M12 16.3V21.8" />
    </svg>
  );
}

// Campana: boton para activar el aviso del sistema operativo.
export function BellIcon({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 11a6 6 0 0 1 12 0v3.3l1.6 2.4a1 1 0 0 1-.83 1.56H5.23A1 1 0 0 1 4.4 16.7L6 14.3z" />
      <path d="M10.1 20a1.9 1.9 0 0 0 3.8 0" />
    </svg>
  );
}

// Globo de dialogo: boton "Responder" / contador de respuestas del hilo.
export function ReplyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.3A2.3 2.3 0 0 1 6.3 4h11.4A2.3 2.3 0 0 1 20 6.3v6.9a2.3 2.3 0 0 1-2.3 2.3H10l-4.3 3.4v-3.4H6.3A2.3 2.3 0 0 1 4 13.2z" />
    </svg>
  );
}

// Flecha hacia una bandeja: boton "Descargar log".
export function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v11.5" />
      <path d="M7.3 10.8 12 15.5l4.7-4.7" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

// Iconos generales del resto de la app (antes emojis/glifos sueltos: se
// veian distinto segun el dispositivo/fuente). Mismo trazo que los demas.

// X: cerrar/quitar. Reemplaza el caracter "✕" suelto que se usaba en varios
// botones (cerrar modal, quitar promo/miembro/linea de venta, etc.).
export function CloseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

// Flecha (chevron) izquierda/derecha: navegacion de mes/dia.
export function ChevronIcon({ size = 14, dir = 'left' }: { size?: number; dir?: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={dir === 'right' ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

// Tres lineas: abrir el menu lateral en movil.
export function MenuIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}

// Fachada de tienda: pantalla vacia antes de crear la primera tienda.
export function StorefrontIcon({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8.3 5.2 3.4h13.6L20 8.3" />
      <path d="M4 8.3v10.3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8.3" />
      <path d="M4 8.3h16" />
      <path d="M9.3 19.6v-6h5.4v6" />
    </svg>
  );
}

// Camion: registrar un nuevo cargamento/entrada de inventario.
export function TruckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10h4l3.5 3v3.5h-7.5z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </svg>
  );
}

// Factura/recibo: pantalla vacia al registrar una venta sin productos.
export function ReceiptIcon({ size = 40 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2.5h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" />
      <path d="M8.5 7h7M8.5 10.5h7M8.5 14h4.5" />
    </svg>
  );
}

// Flecha circular: volver al valor automatico (deshacer un precio manual).
export function UndoIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2" />
      <path d="M3.3 4.5v5.3h5.3" />
    </svg>
  );
}

// Menú desplegable de la tuerca: Editar y Eliminar (productos y categorías).
// Se renderiza en un portal pegado al body y con posición fija, así que se
// SUPERPONE a las demás cajas (nunca lo corta una tabla o tarjeta con
// overflow). Siempre cae hacia abajo del botón; si quedaría debajo del borde
// de la pantalla, la página se desplaza suave y el menú se pega al botón
// mientras el scroll lo acomoda. Se cierra al tocar fuera o elegir una opción.
// Cual de todos los menus de tuerca de la pantalla esta abierto ahora mismo
// (cada fila/categoria tiene su propio GearMenu, componente independiente).
// Se guarda aca el "setOpen" de ese, para poder cerrarlo de una al abrir
// otro: asi solo hay uno abierto a la vez siempre, sin depender de que el
// listener de "clic afuera" del anterior alcance a llegar a tiempo.
let closeOpenGearMenu: ((open: boolean) => void) | null = null;

export function GearMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [w, setW] = useState(170);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const syncPos = (width: number = w) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ left: Math.min(Math.max(6, r.right - width), window.innerWidth - width - 6), top: r.bottom + 5 });
  };

  const closeMenu = () => {
    setOpen(false);
    if (closeOpenGearMenu === setOpen) closeOpenGearMenu = null;
  };

  // Al abrir: si habia otro menu de tuerca abierto en la pantalla, se cierra
  // primero (garantiza que nunca queden dos a la vez, pase lo que pase con
  // el orden de eventos). Luego se calcula la posicion de una vez (con el
  // ancho aproximado de la ultima vez) para que el menu no aparezca en 0,0
  // ni parpadee: antes esto se dejaba para el requestAnimationFrame de
  // abajo, pero ese efecto solo mide el menu real (menuRef) despues de que
  // el menu ya este en el DOM, y el menu solo aparece en el DOM cuando
  // "pos" deja de ser null - un candado que a veces nunca se abria solo.
  function openMenu() {
    if (closeOpenGearMenu && closeOpenGearMenu !== setOpen) closeOpenGearMenu(false);
    closeOpenGearMenu = setOpen;
    syncPos();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    // pointerdown (no mousedown) cubre igual el mouse, el touch y el lapiz,
    // asi que el "clic afuera" cierra el menu de forma pareja en celular y
    // en escritorio.
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (wrapRef.current && menuRef.current && !wrapRef.current.contains(t) && !menuRef.current.contains(t)) closeMenu();
    };
    document.addEventListener('pointerdown', onDown);
    const onScroll = () => syncPos();
    window.addEventListener('scroll', onScroll, { passive: true });
    const raf = requestAnimationFrame(() => {
      const m = menuRef.current;
      if (!m) return;
      setW(m.offsetWidth);
      syncPos(m.offsetWidth);
      const r = wrapRef.current!.getBoundingClientRect();
      if (r.bottom + 5 + m.offsetHeight > window.innerHeight - 4) {
        window.scrollBy({ top: r.bottom + 5 + m.offsetHeight - window.innerHeight + 12, behavior: 'smooth' });
      }
    });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      if (closeOpenGearMenu === setOpen) closeOpenGearMenu = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <>
      <div className="actions" ref={wrapRef}>
        <button type="button" className="icon-btn" title="Opciones"
          onClick={() => (open ? closeMenu() : openMenu())}>
          <GearIcon />
        </button>
      </div>
      {open && pos && createPortal(
        <div className="action-menu gear-menu-portal" ref={menuRef} style={{ left: pos.left, top: pos.top }}>
          {items.map((it) => (
            <button key={it.label} type="button" className={it.danger ? 'danger' : ''}
              onClick={() => { closeMenu(); it.onClick(); }}>{it.label}</button>
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