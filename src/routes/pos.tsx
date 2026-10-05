import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Printer, Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatMoney, stockLabel, stockTone, type DiscountType, type ShopSale } from "@/lib/shop";
import { printSaleReceipt } from "@/lib/print-receipt";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "POS — Furniture" },
      {
        name: "description",
        content: "Sell shop products with a discount. Completed sales update inventory on this device.",
      },
    ],
  }),
  component: PosPage,
});

type CartLine = { productId: string; qty: number };

function PosPage() {
  const { ready, categories, products, completeSale } = useShop();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [discountValue, setDiscountValue] = useState("0");
  const [payment, setPayment] = useState<ShopSale["payment"]>("Cash");
  const [receipt, setReceipt] = useState<ShopSale | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = filter === "All" || product.category === filter;
      const matchesQuery = !q || product.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, filter]);

  const lines = cart
    .map((line) => {
      const product = products.find((item) => item.id === line.productId);
      return product ? { ...line, product } : null;
    })
    .filter((line): line is CartLine & { product: (typeof products)[number] } => line != null);

  const subtotal = lines.reduce((sum, line) => sum + line.product.sellingPrice * line.qty, 0);
  const rawDiscount = Math.max(0, Number(discountValue) || 0);
  const discountAmount =
    discountType === "percent"
      ? Math.round(subtotal * (Math.min(100, rawDiscount) / 100))
      : Math.min(subtotal, Math.round(rawDiscount));
  const total = Math.max(0, subtotal - discountAmount);

  const addToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === productId);
      const nextQty = (existing?.qty ?? 0) + 1;
      if (nextQty > product.stock) {
        toast.error(`Only ${product.stock} ${product.name} left.`);
        return prev;
      }
      if (!existing) return [...prev, { productId, qty: 1 }];
      return prev.map((line) => (line.productId === productId ? { ...line, qty: nextQty } : line));
    });
  };

  const setQty = (productId: string, qty: number) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    if (qty < 1) {
      setCart((prev) => prev.filter((line) => line.productId !== productId));
      return;
    }
    if (qty > product.stock) {
      toast.error(`Only ${product.stock} ${product.name} left.`);
      return;
    }
    setCart((prev) => prev.map((line) => (line.productId === productId ? { ...line, qty } : line)));
  };

  const sell = () => {
    const result = completeSale({
      lines: lines.map((line) => ({ productId: line.productId, qty: line.qty })),
      discountType,
      discountValue: rawDiscount,
      payment,
    });
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setCart([]);
    setDiscountValue("0");
    setReceipt(result.sale);
    toast.success(`Sale saved · ${formatMoney(result.sale.total)}`);
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-3 sm:p-4 lg:p-8">
      <PageHeader
        title="POS"
        subtitle="Uploaded products appear here. Add a discount, then sell. Stock and finance update on this device."
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="pl-9"
            />
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === category
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {!ready ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
              No products match. Upload one and it will show up here.
            </div>
          ) : (
            <div className="panel overflow-x-auto">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>In cart</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((product) => {
                    const inCart = lines.find((line) => line.productId === product.id)?.qty ?? 0;
                    const soldOut = product.stock <= 0;
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatMoney(product.sellingPrice)}</TableCell>
                        <TableCell>
                          <StatusBadge tone={stockTone(product.stock)}>{product.stock}</StatusBadge>
                        </TableCell>
                        <TableCell>{inCart || "—"}</TableCell>
                        <TableCell>
                          <Button size="sm" disabled={soldOut} onClick={() => addToCart(product.id)}>
                            {soldOut ? stockLabel(product.stock) : "Add"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        <aside className="panel order-first flex flex-col gap-4 p-4 lg:sticky lg:top-4 lg:order-none">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-4" />
            <h2 className="font-semibold">Cart</h2>
          </div>

          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add a row from the table to start a sale.</p>
          ) : (
            <ul className="space-y-3">
              {lines.map((line) => (
                <li key={line.productId} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{line.product.name}</p>
                    <p className="text-xs text-muted-foreground">{formatMoney(line.product.sellingPrice)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="size-7" aria-label={`Decrease ${line.product.name}`} onClick={() => setQty(line.productId, line.qty - 1)}>
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{line.qty}</span>
                    <Button variant="outline" size="icon" className="size-7" aria-label={`Increase ${line.product.name}`} onClick={() => setQty(line.productId, line.qty + 1)}>
                      <Plus className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => setQty(line.productId, 0)} aria-label="Remove">
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2 border-t pt-3">
            <Label htmlFor="pos-discount">Discount</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={discountType === "percent" ? "default" : "outline"}
                onClick={() => setDiscountType("percent")}
              >
                Percent %
              </Button>
              <Button
                type="button"
                variant={discountType === "amount" ? "default" : "outline"}
                onClick={() => setDiscountType("amount")}
              >
                Amount Rs
              </Button>
            </div>
            <Input
              id="pos-discount"
              inputMode="decimal"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percent" ? "10" : "500"}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Cash", "Card", "Bank"] as const).map((method) => (
                <Button
                  key={method}
                  type="button"
                  size="sm"
                  variant={payment === method ? "default" : "outline"}
                  onClick={() => setPayment(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd>- {formatMoney(discountAmount)}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
          </dl>

          <Button disabled={lines.length === 0} onClick={sell}>
            Complete sale
          </Button>
        </aside>
      </div>

      <Dialog open={!!receipt} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sale complete</DialogTitle>
            <DialogDescription>
              Saved on this device. Inventory stock has been reduced. No server was used.
            </DialogDescription>
          </DialogHeader>
          {receipt ? (
            <div className="space-y-2 text-sm">
              {receipt.items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-3">
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span>{formatMoney(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 text-muted-foreground">
                <span>Discount</span>
                <span>- {formatMoney(receipt.discountAmount)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total · {receipt.payment}</span>
                <span>{formatMoney(receipt.total)}</span>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (!receipt) return;
                const printed = printSaleReceipt(receipt);
                if (!printed) toast.error("The receipt could not open for printing.");
              }}
            >
              <Printer className="size-4" /> Print receipt
            </Button>
            <Button onClick={() => setReceipt(null)}>New sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
