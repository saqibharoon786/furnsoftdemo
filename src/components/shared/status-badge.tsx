import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  success: "bg-success/12 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-info/12 text-info border-info/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  primary: "bg-primary-soft text-primary border-primary/20",
};

export type Tone = keyof typeof tones;

export function StatusBadge({
  children,
  tone = "neutral",
  className,
  dot,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        tones[tone],
        className,
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export const statusTone: Record<string, Tone> = {
  new: "info",
  qualified: "primary",
  customer: "success",
  inactive: "neutral",
  open: "info",
  pending: "warning",
  resolved: "success",
  active: "success",
  paused: "warning",
  draft: "neutral",
  sent: "success",
  running: "info",
  scheduled: "warning",
  approved: "success",
  rejected: "danger",
  online: "success",
  offline: "neutral",
};
