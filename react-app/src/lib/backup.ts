import type { Store, Product, Sale, CostEntry } from '../types';
import { isProductDeleted, isSaleDeleted, normalizeStore } from './core';
import { isNativeApp } from './nativeBack';

// Respaldo de una tienda en un archivo JSON, para tener SIEMPRE una copia fuera
// de la nube. Restaurar es aditivo: solo agrega lo que falta (por id) y nunca
// pisa ni borra nada de lo que ya hay; tampoco revive lo que el usuario elimino
// a proposito con el boton Eliminar/Borrar.
export const BACKUP_FORMAT = 'mi-tiendita-respaldo';

// Campos que NO van al archivo: el codigo de sincronizacion da acceso a la
// tienda en la nube, asi que un respaldo compartido por error no debe llevarlo.
const PRIVATE_FIELDS: (keyof Store)[] = ['syncKey', 'syncPin', 'members', 'createdBy', 'localRole'];

export interface ParsedBackup {
  exportedAt: string;
  store: Partial<Store>;
}

export function buildBackup(s: Store, now: Date = new Date()): string {
  const copy = JSON.parse(JSON.stringify(s)) as Partial<Store>;
  PRIVATE_FIELDS.forEach((k) => { delete copy[k]; });
  return JSON.stringify({ format: BACKUP_FORMAT, version: 1, exportedAt: now.toISOString(), store: copy }, null, 2);
}

export function backupFileName(s: Store, now: Date = new Date()): string {
  const day = now.toISOString().slice(0, 10);
  return 'respaldo-' + (s.name || 'tienda').toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') + '-' + day + '.json';
}

interface SaveFileHandle {
  createWritable(): Promise<{ write(data: string): Promise<void>; close(): Promise<void> }>;
}

// ¿Estamos dentro de la app nativa (Android, Capacitor)? Ahí el WebView no
// soporta la descarga clásica (<a download>) ni showSaveFilePicker: lo único
// que funciona es escribir el archivo con el plugin nativo de archivos.

// En la app nativa escribe el respaldo en la carpeta pública Documentos del
// teléfono (visible en cualquier explorador de archivos) y devuelve la ruta.
async function saveNativeBackup(data: string, name: string): Promise<{ ok: boolean; path?: string }> {
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
    console.error('No se pudo guardar el respaldo en Documentos:', e);
    return { ok: false };
  }
}

// Guarda el respaldo como archivo. En escritorio abre el diálogo "Guardar
// como" del sistema para que el usuario ELIJA la carpeta y el nombre (antes
// caía directo en Descargas y era fácil no encontrarlo). Si el navegador no
// trae esa API (móvil, por ejemplo), usa la descarga clásica. En la app
// nativa lo escribe en la carpeta pública Documentos. Devuelve { ok: false }
// solo si el usuario cancela el diálogo o falla el guardado; { ok: true }
// (con path en la app nativa) si el archivo se guardó.
export async function downloadBackup(s: Store): Promise<{ ok: boolean; path?: string }> {
  const data = buildBackup(s);
  const name = backupFileName(s);
  if (isNativeApp()) return saveNativeBackup(data, name);
  const picker = (window as unknown as {
    showSaveFilePicker?: (opts: {
      suggestedName?: string;
      types?: { description?: string; accept: Record<string, string[]> }[];
    }) => Promise<SaveFileHandle>;
  }).showSaveFilePicker;
  if (typeof picker === 'function') {
    try {
      const handle = await picker({
        suggestedName: name,
        types: [{ description: 'Respaldo de la tienda', accept: { 'application/json': ['.json'] } }],
      });
      const w = await handle.createWritable();
      await w.write(data);
      await w.close();
      return { ok: true };
    } catch (e) {
      if ((e as { name?: string })?.name === 'AbortError') return { ok: false };
      // Otro fallo del diálogo: se intenta la descarga clásica como respaldo.
    }
  }
  const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
  return { ok: true };
}

export function parseBackup(text: string): ParsedBackup | null {
  try {
    const o = JSON.parse(text.replace(/^﻿/, ''));
    if (!o || o.format !== BACKUP_FORMAT || !o.store || !Array.isArray(o.store.products)) return null;
    return { exportedAt: String(o.exportedAt || ''), store: o.store as Partial<Store> };
  } catch { return null; }
}

// Agrega a "target" lo que el respaldo tiene y a la tienda le falta. Debe
// llamarse dentro de replace(). Devuelve cuanto se recupero.
export function mergeBackupInto(target: Store, b: ParsedBackup): { products: number; sales: number } {
  const src = b.store;
  const have = new Set(target.products.map((p) => p.id));
  const restoredProducts: Product[] = [];
  (src.products || []).forEach((p) => {
    if (!p || !p.id || have.has(p.id) || isProductDeleted(target, p.id)) return;
    restoredProducts.push(JSON.parse(JSON.stringify(p)));
  });
  target.products = target.products.concat(restoredProducts);

  const haveSales = new Set(target.sales.map((x) => x.id));
  const restoredSales: Sale[] = [];
  (src.sales || []).forEach((x) => {
    if (!x || !x.id || haveSales.has(x.id) || isSaleDeleted(target, x.id)) return;
    restoredSales.push(JSON.parse(JSON.stringify(x)));
  });
  target.sales = target.sales.concat(restoredSales);

  // Existencias: solo de los productos que se recuperaron (no se pisan las actuales).
  target.inventory = target.inventory || {};
  const inv = (src.inventory || {}) as Record<string, number>;
  restoredProducts.forEach((p) => { if (typeof inv[p.id] === 'number' && target.inventory[p.id] === undefined) target.inventory[p.id] = inv[p.id]; });

  (src.categories || []).forEach((c) => { if (!target.categories.includes(c)) target.categories.push(c); });
  const tags = new Set(target.tags || []);
  (src.tags || []).forEach((t) => tags.add(t));
  if (tags.size) target.tags = Array.from(tags);
  if (src.categoryPricing) {
    target.categoryPricing = target.categoryPricing || {};
    Object.keys(src.categoryPricing).forEach((k) => { if (!target.categoryPricing![k]) target.categoryPricing![k] = src.categoryPricing![k]; });
  }
  if (Array.isArray(src.costs)) {
    const haveCost = new Set((target.costs || []).map((c) => c.id));
    const add = (src.costs as CostEntry[]).filter((c) => c && c.id && !haveCost.has(c.id));
    if (add.length) target.costs = (target.costs || []).concat(JSON.parse(JSON.stringify(add)));
  }
  normalizeStore(target);
  return { products: restoredProducts.length, sales: restoredSales.length };
}
