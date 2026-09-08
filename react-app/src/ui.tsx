import { ReactNode, useEffect } from 'react';

export function Image({ src, cls, alt = '' }: { src?: string; cls?: string; alt?: string }) {
  return <img className={cls} src={src} alt={alt} />;
}

// Selector de imagen con dos opciones: elegir un archivo (galeria) o tomar la
// foto en el momento con la camara del dispositivo (input oculto con
// capture="environment"). En escritorio el boton de camara simplemente abre
// el mismo selector de archivos, asi que no rompe nada ahi.
export function ImagePicker({ id, src, cls, hint, onFile, disabled }: { id: string; src?: string; cls?: string; hint?: string; onFile: (f: File | undefined) => void; disabled?: boolean }) {
  const cameraId = id + '-camera';
  return (
    <div className="image-picker">
      <Image src={src} cls={cls} />
      <div>
        <input id={id} type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} disabled={disabled} />
        <input id={cameraId} type="file" accept="image/*" capture="environment" onChange={(e) => onFile(e.target.files?.[0])} disabled={disabled} style={{ display: 'none' }} />
        <button type="button" className="button secondary camera-btn" disabled={disabled} onClick={() => document.getElementById(cameraId)?.click()}>Tomar foto</button>
        {hint && <p className="muted">{hint}</p>}
      </div>
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