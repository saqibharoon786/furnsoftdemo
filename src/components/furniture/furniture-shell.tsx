import { Link, useRouterState } from "@tanstack/react-router";
import {
  Armchair,
  BarChart3,
  Boxes,
  Menu,
  PackagePlus,
  RotateCcw,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type ShopPath = "/" | "/pos" | "/inventory" | "/finance" | "/reports" | "/customers" | "/suppliers" | "/purchases" | "/returns";

const GROUPS: { label: string; items: { label: string; to: ShopPath; icon: LucideIcon; hint: string }[] }[] = [
  {
    label: "Floor",
    items: [
      { label: "POP", to: "/", icon: Armchair, hint: "Catalog" },
      { label: "POS", to: "/pos", icon: ShoppingCart, hint: "Sell" },
      { label: "Inventory", to: "/inventory", icon: Boxes, hint: "Stock" },
    ],
  },
  {
    label: "Books",
    items: [
      { label: "Finance", to: "/finance", icon: Wallet, hint: "Money" },
      { label: "Reports", to: "/reports", icon: BarChart3, hint: "Pulse" },
    ],
  },
  {
    label: "People & stock",
    items: [
      { label: "Customers", to: "/customers", icon: Users, hint: "Buyers" },
      { label: "Suppliers", to: "/suppliers", icon: Truck, hint: "Mills" },
      { label: "Purchases", to: "/purchases", icon: PackagePlus, hint: "Inbound" },
      { label: "Returns", to: "/returns", icon: RotateCcw, hint: "Back in" },
    ],
  },
];

function currentLabel(pathname: string) {
  for (const group of GROUPS) {
    const match = group.items.find((item) => (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)));
    if (match) return match.label;
  }
  return "Atelier";
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {GROUPS.map((group) => (
        <div key={group.label} className="space-y-1.5">
          <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">{group.label}</p>
          {group.items.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                onClick={onNavigate}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-colors",
                  active ? "bg-white text-black" : "text-zinc-300 hover:bg-white/8 hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg",
                    active ? "bg-black text-white" : "bg-white/8 text-white group-hover:bg-white/12",
                  )}
                >
                  <item.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-tight">{item.label}</span>
                  <span className={cn("block text-[11px] leading-tight", active ? "text-zinc-600" : "text-zinc-500")}>
                    {item.hint}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-4 pt-5 pb-2">
      <span className="grid size-10 place-items-center rounded-2xl bg-white text-black">
        <Armchair className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold tracking-tight text-white">Atelier</p>
        <p className="text-[11px] text-zinc-500">Furniture floor</p>
      </div>
    </div>
  );
}

export function FurnitureShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="flex min-h-dvh overflow-x-hidden bg-[#f6f1e8]">
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col bg-black text-white lg:flex">
        <Brand />
        <NavLinks />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-black px-3 text-white lg:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="size-10 border-white/15 bg-white text-black hover:bg-zinc-200"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Atelieer</p>
            <p className="truncate text-sm font-semibold">{currentLabel(pathname)}</p>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[min(86vw,280px)] border-none bg-black p-0 text-white">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <Brand />
          <NavLinks onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
