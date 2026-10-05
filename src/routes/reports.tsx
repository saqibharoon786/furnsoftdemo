import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney, stockLabel, stockTone } from "@/lib/shop";
import { useShop } from "@/store/shop-store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Furniture" },
      { name: "description", content: "Sales, stock and finance reports from data saved on this device." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { products, sales, finance, categories } = useShop();

  const byCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        sales: sales.reduce(
          (sum, sale) =>
            sum + sale.items.filter((item) => item.category === category).reduce((line, item) => line + item.price * item.qty, 0),
          0,
        ),
      })),
    [categories, sales],
  );

  const income = finance.filter((entry) => entry.kind === "income").reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = finance.filter((entry) => entry.kind === "expense").reduce((sum, entry) => sum + entry.amount, 0);
  const unitsSold = sales.reduce((sum, sale) => sum + sale.items.reduce((line, item) => line + item.qty, 0), 0);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-3 sm:p-4 lg:p-8">
      <PageHeader
        title="Reports"
        subtitle="Built from the products, sales and finance already saved on this device."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Units sold" value={String(unitsSold)} />
        <Stat label="Sales total" value={formatMoney(sales.reduce((sum, sale) => sum + sale.total, 0))} />
        <Stat label="Profit" value={formatMoney(income - expenses)} />
      </div>

      <section className="panel p-4">
        <h2 className="mb-4 font-semibold">Sales by category</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCategory}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="category"
                interval={0}
                angle={-28}
                textAnchor="end"
                height={52}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number) => formatMoney(value)}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="sales" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <h2 className="px-4 pt-4 font-semibold">Stock report</h2>
        <div className="divide-y">
          {products.map((product) => (
            <div key={product.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.category} · {formatMoney(product.sellingPrice)}
                </p>
              </div>
              <StatusBadge tone={stockTone(product.stock)} className="shrink-0 whitespace-nowrap">
                {product.stock} · {stockLabel(product.stock)}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <h2 className="px-4 pt-4 font-semibold">Finance report</h2>
        <div className="divide-y">
          {finance.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {entry.category} · {entry.kind}
                </p>
                <p className="truncate text-xs text-muted-foreground">{entry.note || entry.source}</p>
              </div>
              <p className="text-sm font-semibold">
                {entry.kind === "expense" ? "− " : ""}
                {formatMoney(entry.amount)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold leading-tight sm:text-xl">{value}</p>
    </div>
  );
}
