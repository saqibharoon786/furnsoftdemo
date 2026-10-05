import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_CATEGORIES,
  SEED_CUSTOMERS,
  SEED_FINANCE,
  SEED_PRODUCTS,
  SEED_SUPPLIERS,
  SHOP_STORAGE_KEY,
  saleToFinance,
  type DiscountType,
  type FinanceEntry,
  type FinanceKind,
  type ShopCustomer,
  type ShopProduct,
  type ShopPurchase,
  type ShopReturn,
  type ShopSale,
  type ShopSupplier,
  type SaleLine,
} from "@/lib/shop";

type Payment = ShopSale["payment"];

type CartLine = { productId: string; qty: number };

type ProductInput = {
  name: string;
  category: string;
  sellingPrice: number;
  stock: number;
  description: string;
  image: string;
  published: boolean;
};

interface ShopState {
  ready: boolean;
  categories: string[];
  products: ShopProduct[];
  sales: ShopSale[];
  finance: FinanceEntry[];
  customers: ShopCustomer[];
  suppliers: ShopSupplier[];
  purchases: ShopPurchase[];
  returns: ShopReturn[];
  addProduct: (input: ProductInput) => ShopProduct;
  updateProduct: (id: string, patch: Partial<ProductInput>) => void;
  deleteProduct: (id: string) => void;
  setStock: (id: string, stock: number) => void;
  addFinance: (input: { kind: FinanceKind; category: string; amount: number; note: string }) => void;
  deleteFinance: (id: string) => void;
  addCustomer: (input: { name: string; phone: string; city: string }) => void;
  deleteCustomer: (id: string) => void;
  addSupplier: (input: { name: string; phone: string; supplies: string }) => void;
  deleteSupplier: (id: string) => void;
  addPurchase: (input: { supplierName: string; productId: string; qty: number; cost: number }) => { ok: true } | { ok: false; message: string };
  addReturn: (input: { productId: string; qty: number; reason: string }) => { ok: true } | { ok: false; message: string };
  completeSale: (input: {
    lines: CartLine[];
    discountType: DiscountType;
    discountValue: number;
    payment: Payment;
  }) => { ok: true; sale: ShopSale } | { ok: false; message: string };
}

const Ctx = createContext<ShopState | null>(null);

type Snapshot = {
  categories: string[];
  products: ShopProduct[];
  sales: ShopSale[];
  finance: FinanceEntry[];
  customers: ShopCustomer[];
  suppliers: ShopSupplier[];
  purchases: ShopPurchase[];
  returns: ShopReturn[];
};

function normalizeProduct(raw: ShopProduct): ShopProduct {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    sellingPrice: Number(raw.sellingPrice) || 0,
    stock: Number(raw.stock) || 0,
    description: raw.description ?? "",
    image: raw.image ?? "",
    published: raw.published !== false,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

function loadSnapshot(): Snapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Snapshot>;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.categories)) return null;
    const sales = Array.isArray(parsed.sales) ? parsed.sales : [];
    const storedFinance = Array.isArray(parsed.finance) ? parsed.finance : SEED_FINANCE;
    const knownSales = new Set(storedFinance.map((entry) => entry.saleId).filter(Boolean));
    const finance = [
      ...sales.filter((sale) => !knownSales.has(sale.id)).map(saleToFinance),
      ...storedFinance,
    ];
    return {
      categories: parsed.categories.filter((c) => typeof c === "string" && c.trim()),
      products: parsed.products.map(normalizeProduct),
      sales,
      finance,
      customers: Array.isArray(parsed.customers) ? parsed.customers : SEED_CUSTOMERS,
      suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : SEED_SUPPLIERS,
      purchases: Array.isArray(parsed.purchases) ? parsed.purchases : [],
      returns: Array.isArray(parsed.returns) ? parsed.returns : [],
    };
  } catch {
    return null;
  }
}

export function ShopStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<ShopProduct[]>(SEED_PRODUCTS);
  const [sales, setSales] = useState<ShopSale[]>([]);
  const [finance, setFinance] = useState<FinanceEntry[]>(SEED_FINANCE);
  const [customers, setCustomers] = useState<ShopCustomer[]>(SEED_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<ShopSupplier[]>(SEED_SUPPLIERS);
  const [purchases, setPurchases] = useState<ShopPurchase[]>([]);
  const [returns, setReturns] = useState<ShopReturn[]>([]);

  useEffect(() => {
    const saved = loadSnapshot();
    if (saved) {
      setCategories(saved.categories.length ? saved.categories : DEFAULT_CATEGORIES);
      setProducts(saved.products);
      setSales(saved.sales);
      setFinance(saved.finance);
      setCustomers(saved.customers);
      setSuppliers(saved.suppliers);
      setPurchases(saved.purchases);
      setReturns(saved.returns);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const snapshot: Snapshot = { categories, products, sales, finance, customers, suppliers, purchases, returns };
    window.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(snapshot));
  }, [ready, categories, products, sales, finance, customers, suppliers, purchases, returns]);

  const value = useMemo<ShopState>(
    () => ({
      ready,
      categories,
      products,
      sales,
      finance,
      customers,
      suppliers,
      purchases,
      returns,
      addProduct: (input) => {
        const category = input.category.trim();
        const product: ShopProduct = {
          id: `p-${Date.now()}`,
          name: input.name.trim(),
          category,
          sellingPrice: Math.max(0, Math.round(input.sellingPrice)),
          stock: Math.max(0, Math.round(input.stock)),
          description: input.description.trim(),
          image: input.image,
          published: input.published,
          createdAt: new Date().toISOString(),
        };
        setCategories((prev) => (prev.some((c) => c.toLowerCase() === category.toLowerCase()) ? prev : [...prev, category]));
        setProducts((prev) => [product, ...prev]);
        return product;
      },
      updateProduct: (id, patch) => {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            const next = { ...p, ...patch };
            if (patch.name != null) next.name = patch.name.trim();
            if (patch.category != null) next.category = patch.category.trim();
            if (patch.sellingPrice != null) next.sellingPrice = Math.max(0, Math.round(patch.sellingPrice));
            if (patch.stock != null) next.stock = Math.max(0, Math.round(patch.stock));
            if (patch.description != null) next.description = patch.description.trim();
            return next;
          }),
        );
        if (patch.category?.trim()) {
          const category = patch.category.trim();
          setCategories((prev) =>
            prev.some((c) => c.toLowerCase() === category.toLowerCase()) ? prev : [...prev, category],
          );
        }
      },
      deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
      setStock: (id, stock) =>
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, Math.round(stock)) } : p)),
        ),
      addFinance: (input) => {
        const entry: FinanceEntry = {
          id: `f-${Date.now()}`,
          kind: input.kind,
          category: input.category.trim() || "Other",
          amount: Math.max(0, Math.round(input.amount)),
          note: input.note.trim(),
          createdAt: new Date().toISOString(),
          source: "manual",
        };
        setFinance((prev) => [entry, ...prev]);
      },
      deleteFinance: (id) => setFinance((prev) => prev.filter((entry) => entry.id !== id || entry.source === "sale")),
      addCustomer: (input) =>
        setCustomers((prev) => [
          { id: `c-${Date.now()}`, name: input.name.trim(), phone: input.phone.trim(), city: input.city.trim(), createdAt: new Date().toISOString() },
          ...prev,
        ]),
      deleteCustomer: (id) => setCustomers((prev) => prev.filter((customer) => customer.id !== id)),
      addSupplier: (input) =>
        setSuppliers((prev) => [
          { id: `su-${Date.now()}`, name: input.name.trim(), phone: input.phone.trim(), supplies: input.supplies.trim(), createdAt: new Date().toISOString() },
          ...prev,
        ]),
      deleteSupplier: (id) => setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id)),
      addPurchase: ({ supplierName, productId, qty, cost }) => {
        const product = products.find((item) => item.id === productId);
        if (!product) return { ok: false, message: "Pick a product from POP." };
        if (qty < 1) return { ok: false, message: "Quantity must be at least 1." };
        const purchase: ShopPurchase = {
          id: `pu-${Date.now()}`,
          supplierName: supplierName.trim() || "Supplier",
          productId: product.id,
          productName: product.name,
          qty: Math.round(qty),
          cost: Math.max(0, Math.round(cost)),
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, stock: item.stock + purchase.qty } : item)));
        setPurchases((prev) => [purchase, ...prev]);
        return { ok: true };
      },
      addReturn: ({ productId, qty, reason }) => {
        const product = products.find((item) => item.id === productId);
        if (!product) return { ok: false, message: "Pick a product from POP." };
        if (qty < 1) return { ok: false, message: "Quantity must be at least 1." };
        const entry: ShopReturn = {
          id: `r-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          qty: Math.round(qty),
          reason: reason.trim() || "Customer return",
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => prev.map((item) => (item.id === product.id ? { ...item, stock: item.stock + entry.qty } : item)));
        setReturns((prev) => [entry, ...prev]);
        return { ok: true };
      },
      completeSale: ({ lines, discountType, discountValue, payment }) => {
        if (!lines.length) return { ok: false, message: "Add at least one product to the cart." };

        const items: SaleLine[] = [];
        for (const line of lines) {
          const product = products.find((p) => p.id === line.productId);
          if (!product) return { ok: false, message: "A product in the cart is no longer in the shop." };
          if (line.qty < 1) return { ok: false, message: "Quantity must be at least 1." };
          if (line.qty > product.stock) {
            return { ok: false, message: `${product.name} only has ${product.stock} in stock.` };
          }
          items.push({
            productId: product.id,
            name: product.name,
            category: product.category,
            qty: line.qty,
            price: product.sellingPrice,
          });
        }

        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const rawDiscount = Math.max(0, discountValue);
        const discountAmount =
          discountType === "percent"
            ? Math.round(subtotal * (Math.min(100, rawDiscount) / 100))
            : Math.min(subtotal, Math.round(rawDiscount));
        const total = Math.max(0, subtotal - discountAmount);

        const sale: ShopSale = {
          id: `s-${Date.now()}`,
          items,
          subtotal,
          discountType,
          discountValue: discountType === "percent" ? Math.min(100, rawDiscount) : Math.round(rawDiscount),
          discountAmount,
          total,
          payment,
          createdAt: new Date().toISOString(),
        };

        setProducts((prev) =>
          prev.map((product) => {
            const line = items.find((item) => item.productId === product.id);
            return line ? { ...product, stock: product.stock - line.qty } : product;
          }),
        );
        setSales((prev) => [sale, ...prev]);
        setFinance((prev) => [saleToFinance(sale), ...prev]);
        return { ok: true, sale };
      },
    }),
    [ready, categories, products, sales, finance, customers, suppliers, purchases, returns],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside ShopStoreProvider");
  return ctx;
}
