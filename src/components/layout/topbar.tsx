import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "./app-sidebar";
import { NAV_ITEMS } from "./nav-items";
import { toast } from "sonner";

const NOTIFICATIONS = [
  { id: 1, title: "Fatima Iqbal replied", body: "Can you share the pricing for the growth plan?", at: "2m" },
  { id: 2, title: "Campaign finished", body: "September Website Offer reached 4,102 people.", at: "1h" },
  { id: 3, title: "Automation paused", body: "Abandoned Inquiry was paused by Bilal Ahmed.", at: "4h" },
];

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const current =
    NAV_ITEMS.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)))?.label ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur lg:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[270px] border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="hidden min-w-0 items-center gap-2 text-sm lg:flex">
        <span className="text-muted-foreground">ClickMasters</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="truncate font-semibold">{current}</span>
      </div>

      <form
        className="relative ml-auto w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) toast(`Searching for "${query.trim()}"…`);
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts, conversations…"
          className="h-9 pl-9"
        />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="hidden shrink-0 sm:inline-flex">
            <Plus className="size-4" /> New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/contacts">New contact</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/campaigns">New campaign</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/templates">New template</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/automation">New automation</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative shrink-0" aria-label="Notifications">
            <Bell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-surface" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NOTIFICATIONS.map((n) => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-[11px] text-muted-foreground">{n.at}</span>
              </div>
              <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="hidden shrink-0 sm:inline-flex"
        aria-label="Help"
        onClick={() => toast("Help centre opens in the full product.")}
      >
        <HelpCircle className="size-[18px]" />
      </Button>
    </header>
  );
}
