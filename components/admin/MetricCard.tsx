import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: "default" | "green" | "amber" | "red" | "blue";
}

const colorClasses: Record<NonNullable<MetricCardProps["color"]>, string> = {
  default: "bg-slate-500/10 text-slate-300",
  green: "bg-emerald-500/10 text-emerald-400",
  amber: "bg-amber-500/10 text-amber-400",
  red: "bg-red-500/10 text-red-400",
  blue: "bg-blue-500/10 text-blue-400",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  color = "default",
}: MetricCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm backdrop-blur-sm">
      {Icon && (
        <div className={cn("rounded-lg p-2.5", colorClasses[color])}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-semibold tabular-nums text-slate-100">
          {value}
        </p>
      </div>
    </div>
  );
}

export default MetricCard;