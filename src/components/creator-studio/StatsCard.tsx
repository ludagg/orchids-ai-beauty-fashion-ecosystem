import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export default function StatsCard({ title, value, change, trend, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            trend === "up"
              ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
              : trend === "down"
              ? "text-rose-600 bg-rose-500/10 dark:text-rose-400"
              : "text-muted-foreground bg-muted"
          }`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </div>
    </div>
  );
}
