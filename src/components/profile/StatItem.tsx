import { cn } from "@/lib/utils";

export function StatItem({ value, label, trend }: { value: string | number, label: string, trend?: string }) {
  return (
    <div className="text-center sm:text-left flex flex-col items-center sm:items-start p-2 sm:p-0">
      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
          )}>
            {trend}
          </span>
        )}
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
}
