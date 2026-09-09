// El precio final se define como precio fijo ("price") o descuento porcentual
// ("pct"). La condicion es de CANTIDAD de la misma categoria en la venta:
//  - "Cantidad fija" (qtyeq): se aplica cuando hay EXACTAMENTE N unidades de
//    esa categoria. Varias promos fijas del mismo producto forman un precio
//    por BLOQUE que se reinicia (ver promoPrice en core.ts).
//  - "Cantidad mayor a" (qtygt): se aplica cuando hay MAS de N unidades.
// La prioridad entre varias promos del mismo producto es el orden del arreglo
// (la primera que cumpla su condicion gana); en el editor se reordenan para
// cambiar esa prioridad.
export interface Promo {
  id: string;
  label: string;
  type: 'price' | 'pct';
  price: number;
  pct: number;
  cond: 'qtyeq' | 'qtygt';
  min: number;
  start?: string;
  end?: string;
}

// Precio, costo y promociones por defecto de una categoria. Al crearla o
// editarla se copian a todos los productos que tengan esa categoria; despues
// cada producto se puede editar individualmente para tener un precio o
// costo distinto sin afectar a los demas.
export interface CategoryPricing {
  price: number;
  cost?: number;
  promos: Promo[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  // Costo de producirlo/comprarlo (opcional). Es individual por producto,
  // a diferencia del precio que puede venir de la categoria: sirve para
  // calcular la ganancia (precio - costo) en la seccion de Ganancias.
  cost?: number;
  image: string;
  promos: Promo[];
  category: string;
  // Etiqueta opcional (tag). Se sugiere un valor por defecto global ('general')
  // al crear el producto, pero se puede cambiar o dejar vacio. No es obligatorio.
  tag?: string;
  // Posicion dentro de su categoria (menor = mas arriba). Se asigna al
  // arrastrar en el Catalogo; viaja como un campo mas del producto para que
  // el orden SI se sincronice entre dispositivos (a diferencia de la
  // posicion dentro del arreglo, que Firestore no garantiza conservar).
  order?: number;
}

export interface SaleItem {
  productId: string;
  promotionId: string | null;
  qty: number;
  price?: number;
  // Costo del producto al momento de la venta (se copia igual que price):
  // asi si despues cambias el costo del producto, las ventas viejas
  // conservan su ganancia real de ese momento.
  cost?: number;
  who?: Record<string, number>;
}

export interface Sale {
  id: string;
  date: string;
  time: string;
  employee: string;
  by?: string;
  closed: boolean;
  items: SaleItem[];
  // Si se registro durante un evento activo (pestana Eventos), se guarda el
  // nombre del evento para mostrarlo en el historial junto a fecha y hora.
  event?: string;
}

export type Role = 'owner' | 'admin' | 'worker';

// Evento especial (pestana Eventos): mientras este activo (y dentro del rango
// de fechas si se definio), sus ventas registradas aplican su descuento a todo
// y quedan marcadas con el nombre del evento en el historial.
export interface StoreEvent {
  id: string;
  name: string;
  pct: number;
  active: boolean;
  start?: string;
  end?: string;
}

export interface Member {
  name: string;
  role: Role;
  joinedAt: number;
  // UUID unico del empleado, generado al registrarse la primera vez en la
  // tienda. No puede repetirse ni entre ID's ni entre nombres de empleados
  // cuando se sincronizan entre dispositivos (ver validarNombreEmpleado).
  eid?: string;
}

export interface InventoryLogEntry {
  id: string;
  productId: string;
  date: string;
  time: string;
  qty: number;
  supplier: string;
  by?: string;
  byName?: string;
}

export interface NoteEntry {
  id: string;
  text: string;
  date: string;
  time: string;
  by?: string;
  byName?: string;
}

// --- Notas del equipo (tablero de mensajes con hilos, tipo Slack) ---
// Reemplaza en la UI a NoteEntry/noteLog de arriba (que se conserva solo
// para migrar datos viejos, ver migrateNoteLog en core.ts). Un Note vive en
// s.noteBoard; se sincroniza como mapa por id en el campo "noteBoard" del
// documento principal (igual que noteLog antes), asi que dos dispositivos
// nunca pisan las notas AJENAS entre si al guardar (ver lib/sync.ts). Una
// edicion o respuesta concurrente sobre la MISMA nota desde dos
// dispositivos offline al mismo tiempo si puede pisarse (gana el ultimo que
// sincronice) - mismo trato que ya recibe el catalogo en esta app.
export interface NoteEditRecord {
  text: string;
  at: number;
}

export interface NoteChecklistItem {
  id: string;
  text: string;
  done: boolean;
  doneBy?: string;
  doneByName?: string;
}

export interface NoteReply {
  id: string;
  text: string;
  by?: string;
  byName?: string;
  createdAt: number;
  date: string;
  time: string;
  editedAt?: number;
  history?: NoteEditRecord[];
}

export interface Note {
  id: string;
  kind: 'text' | 'checklist';
  // Para 'checklist' es el titulo de la lista; el contenido va en items.
  text: string;
  items?: NoteChecklistItem[];
  by?: string;
  byName?: string;
  createdAt: number;
  date: string;
  time: string;
  editedAt?: number;
  history?: NoteEditRecord[];
  pinned?: boolean;
  replies?: NoteReply[];
}

// Entrada del log descargable (ver lib/notesArchive.ts): se guarda SOLO en
// este dispositivo (localStorage, no viaja por Firestore) para no inflar el
// documento de la tienda con un historial que crece sin limite. Cada
// dispositivo que tuvo la pestana Notas abierta en algun momento acumula lo
// que vio pasar; el boton de descarga (solo para administradores) exporta
// lo que ESE dispositivo alcanzo a registrar.
export interface NoteArchiveEntry {
  id: string;
  parentId?: string;
  kind: 'nota' | 'respuesta' | 'checklist';
  text: string;
  by?: string;
  byName?: string;
  date: string;
  time: string;
  createdAt: number;
  editedAt?: number;
  status: 'activa' | 'editada' | 'fijada' | 'eliminada' | 'expirada';
}

export interface Store {
  id: string;
  name: string;
  image: string;
  products: Product[];
  sales: Sale[];
  categories: string[];
  categoryPricing?: Record<string, CategoryPricing>;
  inventory: Record<string, number>;
  notes: string;
  noteLog: NoteEntry[];
  noteBoard: Note[];
  invLog: InventoryLogEntry[];
  syncKey?: string;
  syncPin?: string;
  createdBy?: string | null;
  localRole?: Role;
  members?: Record<string, Member>;
  events?: StoreEvent[];
}

export type Tab = 'inicio' | 'productos' | 'inventario' | 'ganancias' | 'notas' | 'empleados' | 'eventos';

export interface SaleDraft {
  storeId: string;
  employee: string;
  categories: string[];
  lines: { pid: string; price: number; qty: number }[];
}

export interface AppState {
  stores: Store[];
  activeStoreId: string | null;
  tab: Tab;
  editingSaleId: string | null;
  summaryPage: number;
  summaryDate: string | null;
  summaryMonth: string | null;
  saleDraft: SaleDraft | null;
  openCats: Record<string, Record<string, boolean>>;
}
