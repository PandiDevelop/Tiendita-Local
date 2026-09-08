import { ReactNode, useEffect, useState } from 'react';
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