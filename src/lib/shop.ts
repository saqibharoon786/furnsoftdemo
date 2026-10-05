export type ShopProduct = {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  stock: number;
  description: string;
  image: string;
  published: boolean;
  createdAt: string;
};

export type FinanceKind = "income" | "expense";

export type FinanceEntry = {
  id: string;
  kind: FinanceKind;
  category: string;
  amount: number;
  note: string;
  createdAt: string;
  source: "manual" | "sale";
  saleId?: string;
};

export type DiscountType = "percent" | "amount";

export type SaleLine = {
  productId: string;
  name: string;
  category: string;
  qty: number;
  price: number;
};

export type ShopSale = {
  id: string;
  items: SaleLine[];
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  total: number;
  payment: "Cash" | "Card" | "Bank";
  createdAt: string;
};

export type ShopCustomer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  createdAt: string;
};

export type ShopSupplier = {
  id: string;
  name: string;
  phone: string;
  supplies: string;
  createdAt: string;
};

export type ShopPurchase = {
  id: string;
  supplierName: string;
  productId: string;
  productName: string;
  qty: number;
  cost: number;
  createdAt: string;
};

export type ShopReturn = {
  id: string;
  productId: string;
  productName: string;
  qty: number;
  reason: string;
  createdAt: string;
};

export const SHOP_STORAGE_KEY = "relay-shop-v1";

export const DEFAULT_CATEGORIES = ["Chairs", "Tables", "Sofas", "Beds", "Storage"];

export const SEED_PRODUCTS: ShopProduct[] = [
  { id: "p-chair-oak", name: "Oak Dining Chair", category: "Chairs", sellingPrice: 8500, stock: 12, description: "Solid oak frame with a linen seat.", image: "", published: true, createdAt: "2026-09-12T10:00:00.000Z" },
  { id: "p-chair-velvet", name: "Velvet Lounge Chair", category: "Chairs", sellingPrice: 14500, stock: 6, description: "Deep seat lounge chair in charcoal velvet.", image: "", published: true, createdAt: "2026-09-14T10:00:00.000Z" },
  { id: "p-table-walnut", name: "Walnut Dining Table", category: "Tables", sellingPrice: 42000, stock: 4, description: "Seats six. Walnut top, black steel legs.", image: "", published: true, createdAt: "2026-09-16T10:00:00.000Z" },
  { id: "p-table-coffee", name: "Marble Coffee Table", category: "Tables", sellingPrice: 18000, stock: 8, description: "White marble top on an oak base.", image: "", published: true, createdAt: "2026-09-18T10:00:00.000Z" },
  { id: "p-sofa-linen", name: "Linen 3-Seater Sofa", category: "Sofas", sellingPrice: 78000, stock: 2, description: "Loose linen cover, three seat cushions.", image: "", published: true, createdAt: "2026-09-20T10:00:00.000Z" },
  { id: "p-bed-queen", name: "Queen Bed Frame", category: "Beds", sellingPrice: 55000, stock: 3, description: "Low oak queen frame with a slatted base.", image: "", published: true, createdAt: "2026-09-22T10:00:00.000Z" },
  { id: "p-storage-side", name: "Sideboard Cabinet", category: "Storage", sellingPrice: 26500, stock: 5, description: "Two doors, oak veneer, soft-close hinges.", image: "", published: true, createdAt: "2026-09-24T10:00:00.000Z" },
];

export const FINANCE_CATEGORIES = ["Sales", "Supplier", "Rent", "Salary", "Delivery", "Other"] as const;

export const SEED_CUSTOMERS: ShopCustomer[] = [
  { id: "c-ayesha", name: "Ayesha Khan", phone: "0300 1112233", city: "Karachi", createdAt: "2026-09-04T08:00:00.000Z" },
  { id: "c-bilal", name: "Bilal Ahmed", phone: "0321 4455667", city: "Lahore", createdAt: "2026-09-11T08:00:00.000Z" },
];

export const SEED_SUPPLIERS: ShopSupplier[] = [
  { id: "su-oak", name: "Oak Mill", phone: "021 34567890", supplies: "Chairs, Tables", createdAt: "2026-08-20T08:00:00.000Z" },
  { id: "su-velvet", name: "Velvet House", phone: "042 37890123", supplies: "Sofas, Beds", createdAt: "2026-08-22T08:00:00.000Z" },
];

export const SEED_FINANCE: FinanceEntry[] = [
  { id: "f-rent", kind: "expense", category: "Rent", amount: 45000, note: "Showroom rent", createdAt: "2026-09-01T08:00:00.000Z", source: "manual" },
  { id: "f-supplier", kind: "expense", category: "Supplier", amount: 82000, note: "Chair and table delivery", createdAt: "2026-09-08T08:00:00.000Z", source: "manual" },
  { id: "f-salary", kind: "expense", category: "Salary", amount: 35000, note: "Floor staff", createdAt: "2026-09-28T08:00:00.000Z", source: "manual" },
];

export function saleToFinance(sale: ShopSale): FinanceEntry {
  return {
    id: `f-${sale.id}`,
    kind: "income",
    category: "Sales",
    amount: sale.total,
    note: sale.items.map((item) => `${item.qty}× ${item.name}`).join(", "),
    createdAt: sale.createdAt,
    source: "sale",
    saleId: sale.id,
  };
}

export function formatMoney(amount: number) {
  const rounded = Math.round(amount);
  return `Rs ${rounded.toLocaleString("en-PK")}`;
}

export function stockTone(stock: number): "success" | "warning" | "danger" {
  if (stock <= 0) return "danger";
  if (stock <= 3) return "warning";
  return "success";
}

export function stockLabel(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 3) return "Low stock";
  return "In stock";
}
