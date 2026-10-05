import { Link, useRouterState } from "@tanstack/react-router";
import { Check, ChevronsUpDown, LogOut, Sparkles, UserCog } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { WORKSPACES, CURRENT_USER } from "@/lib/mock/data";
import { useApp } from "@/store/app-store";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { workspaceId, setWorkspaceId } = useApp();
  const workspace = WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0];

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-sidebar-accent-foreground">Relay</p>
          <p className="truncate text-[11px] text-sidebar-foreground/60">WhatsApp CRM</p>
        </div>
      </div>

      <nav className="scrollbar-slim flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  active ? "text-sidebar-primary" : "text-sidebar-foreground/60",
                )}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-sidebar-primary px-1.5 py-0.5 text-[10px] font-bold text-sidebar-primary-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-sidebar-accent/70">
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
                {workspace.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
                  {workspace.name}
                </span>
                <span className="block truncate text-[11px] text-sidebar-foreground/60">
                  {workspace.plan}
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {WORKSPACES.map((w) => (
              <DropdownMenuItem
                key={w.id}
                onClick={() => {
                  setWorkspaceId(w.id);
                  toast.success(`Switched to ${w.name}`);
                }}
              >
                <span className="flex-1">{w.name}</span>
                <span className="text-xs text-muted-foreground">{w.plan}</span>
                {w.id === workspaceId ? <Check className="size-3.5" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              {workspace.plan}
            </span>
            <span className="text-[11px] text-sidebar-foreground/60">68% used</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sidebar-border">
            <div className="h-full w-[68%] rounded-full bg-sidebar-primary" />
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3 h-7 w-full text-xs"
            asChild
          >
            <Link to="/settings" onClick={onNavigate}>
              Manage plan
            </Link>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-sidebar-accent/70">
              <UserAvatar name={CURRENT_USER.name} className="size-8" online />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
                  {CURRENT_USER.name}
                </span>
                <span className="block truncate text-[11px] text-sidebar-foreground/60">
                  {CURRENT_USER.role}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{CURRENT_USER.name}</p>
              <p className="text-xs text-muted-foreground">{CURRENT_USER.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" onClick={onNavigate}>
                <UserCog className="size-4" /> Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Sign out is not wired up in this preview.")}>
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
