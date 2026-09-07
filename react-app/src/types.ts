export interface Promo {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  promos: Promo[];
  category: string;
}

export interface SaleItem {
  productId: string;
  promotionId: string | null;
  qty: number;
  price?: number;
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

export type Role = 'owner' | 'worker';

export interface Member {
  name: string;
  role: Role;
  joinedAt: number;
}

export interface Store {
  id: string;
  name: string;
  image: string;
  products: Product[];
  sales: Sale[];
  categories: string[];
  inventory: Record<string, number>;
  syncKey?: string;
  syncPin?: string;
  createdBy?: string | null;
  localRole?: Role;
  members?: Record<string, Member>;
}

export type Tab = 'inicio' | 'productos' | 'inventario' | 'historial' | 'empleados';

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
