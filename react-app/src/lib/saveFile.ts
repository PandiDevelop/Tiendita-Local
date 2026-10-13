import { isNativeApp } from './nativeBack';

// Guarda un archivo de texto (JSON, CSV, etc.) generado por la app. En el
// navegador usa la descarga clásica (blob + <a download>). Dentro de la app
// nativa (Capacitor) esa descarga no funciona, así que se escribe con
// @capacitor/filesystem en la carpeta pública Documentos (igual que el
// respaldo de la tienda) y se devuelve la ruta para que la UI avise dónde
// quedó.
export interface SavedFile {
  ok: boolean;
  path?: string;
}

export async function saveTextFile(data: string, name: string, contentType: string): Promise<SavedFile> {
  if (isNativeApp()) {
    try {
      const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
      await Filesystem.writeFile({
        path: name,
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      const { uri } = await Filesystem.getUri({ path: name, directory: Directory.Documents });
      return { ok: true, path: uri.replace(/^file:\/\//, '') || name };
    } catch (e) {
      console.error('No se pudo guardar el archivo en Documentos:', e);
      return { ok: false };
    }
  }
  try {
    const blob = new Blob([data], { type: contentType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    return { ok: true };
  } catch (e) {
    console.error('No se pudo descargar el archivo:', e);
    return { ok: false };
  }
}