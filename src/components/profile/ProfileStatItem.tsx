// [Jules - Extracted StatItem from monolithic ProfileView.tsx]
import { TrendingUp } from "lucide-react";

export function ProfileStatItem({ value, label, trend }: { value: string | number, label: string, trend?: string }) {
  return (
    <div className="text-center sm:text-left flex flex-col items-center sm:items-start p-2 sm:p-0">
      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{value}</span>
        {trend && (
          <span className="hidden sm:inline-flex text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">{label}</p>
    </div>
  );
}
