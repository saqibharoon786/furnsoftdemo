import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Package, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, stockLabel, stockTone } from "@/lib/shop";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Furniture" },
      {
        name: "description",
        content: "Stock for every shop product. Sales from POS reduce quantity automatically.",
      },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const { ready, products, sales, setStock } = useShop();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        !q || product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q),
    );
  }, [products, query]);

  const units = products.reduce((sum, product) => sum + product.stock, 0);
  const stockValue = products.reduce((sum, product) => sum + product.stock * product.sellingPrice, 0);
  const low = products.filter((product) => product.stock > 0 && product.stock <= 3).length;
  const out = products.filter((product) => product.stock <= 0).length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-3 sm:p-4 lg:p-8">
      <PageHeader
        title="Inventory"
        subtitle="Every uploaded product is stored here. A POS sale lowers the stock."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Units on hand" value={String(units)} />
        <Stat label="Stock value" value={formatMoney(stockValue)} />
        <Stat label="Need attention" value={`${low} low · ${out} out`} />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search inventory"
          className="pl-9"
        />
      </div>

      {!ready ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Inventory is empty"
          description="Upload a product and the same item, price and stock will appear here."
        />
      ) : (
        <div className="panel overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Selling price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell>{formatMoney(product.sellingPrice)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label={`Decrease ${product.name} stock`}
                        onClick={() => setStock(product.id, product.stock - 1)}
                        disabled={product.stock <= 0}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Input
                        className="h-7 w-16 text-center"
                        inputMode="numeric"
                        value={product.stock}
                        aria-label={`${product.name} stock`}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          if (Number.isFinite(next)) setStock(product.id, next);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        aria-label={`Increase ${product.name} stock`}
                        onClick={() => setStock(product.id, product.stock + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={stockTone(product.stock)}>{stockLabel(product.stock)}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent sales</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sales yet. Complete one from POS and it will show up here.</p>
        ) : (
          <div className="panel divide-y">
            {sales.slice(0, 8).map((sale) => (
              <div key={sale.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {sale.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleString()} · {sale.payment}
                    {sale.discountAmount > 0 ? ` · discount ${formatMoney(sale.discountAmount)}` : ""}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatMoney(sale.total)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold leading-tight tracking-tight sm:text-xl">{value}</p>
    </div>
  );
}
