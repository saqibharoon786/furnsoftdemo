import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const palette = [
  "bg-chart-1/15 text-chart-1",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-3/20 text-chart-3",
  "bg-chart-4/15 text-chart-4",
  "bg-chart-5/15 text-chart-5",
];

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({
  name,
  className,
  online,
}: {
  name: string;
  className?: string;
  online?: boolean;
}) {
  const tone = palette[name.charCodeAt(0) % palette.length];
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar className={cn("size-9", className)}>
        <AvatarFallback className={cn("text-xs font-semibold", tone)}>
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      {online !== undefined ? (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface",
            online ? "bg-success" : "bg-muted-foreground/50",
          )}
        />
      ) : null}
    </span>
  );
}
