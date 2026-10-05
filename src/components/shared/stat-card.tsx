import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="panel group p-5 transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-105">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
              up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {up ? "+" : ""}
            {delta}%
          </span>
        ) : null}
        <span className="text-muted-foreground">{hint ?? "vs. last 30 days"}</span>
      </div>
    </div>
  );
}
