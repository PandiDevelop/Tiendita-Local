export interface Promo {
  id: string;
  label: string;
  price: number;
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
}

export type Role = 'owner' | 'admin' | 'worker';

export interface Member {
  name: string;
  role: Role;
  joinedAt: number;
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
  invLog: InventoryLogEntry[];
  syncKey?: string;
  syncPin?: string;
  createdBy?: string | null;
  localRole?: Role;
  members?: Record<string, Member>;
}

export type Tab = 'inicio' | 'productos' | 'inventario' | 'ganancias' | 'notas' | 'empleados';

export interface SaleDraft {
  storeId: string;
  employee: string;
  category: string;
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
