import { ImageIcon, TrendingUp, Zap, Crown } from "lucide-react";
import { cn } from "@/utils/cn";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const { totalImages, imagesThisMonth, dailyUsage, dailyLimit, plan } = stats;

  // dailyLimit is null for unlimited plans (Pro/Business)
  const isUnlimited = dailyLimit === null;
  const usedPct = isUnlimited
    ? 0
    : Math.min(100, (dailyUsage / (dailyLimit ?? 1)) * 100);

  const cards = [
    {
      label: "Total images processed",
      value: totalImages.toLocaleString(),
      icon: ImageIcon,
      color: "bg-accent-light text-accent",
    },
    {
      label: "This month",
      value: imagesThisMonth.toLocaleString(),
      icon: TrendingUp,
      color: "bg-[#e6f0fa] text-[#185fa5]",
    },
    {
      label: "Today's edits",
      value: isUnlimited
        ? `${dailyUsage} (unlimited)`
        : `${dailyUsage} / ${dailyLimit}`,
      icon: Zap,
      color:
        !isUnlimited && usedPct >= 80
          ? "bg-red-50 text-red-600"
          : "bg-gold-light text-gold",
      extra:
        !isUnlimited && dailyLimit !== null ? (
          <div className="mt-2 w-full bg-surface-2 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all",
                usedPct >= 80 ? "bg-red-500" : "bg-gold"
              )}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        ) : null,
    },
    {
      label: "Current plan",
      value: plan.charAt(0).toUpperCase() + plan.slice(1),
      icon: Crown,
      color:
        plan === "free"
          ? "bg-surface-2 text-ink-2"
          : "bg-accent-light text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center mb-4",
              card.color
            )}
          >
            <card.icon className="w-4 h-4" />
          </div>
          <p className="text-[13px] text-ink-3 mb-1">{card.label}</p>
          <p className="text-2xl font-semibold text-ink tracking-tight">
            {card.value}
          </p>
          {card.extra}
        </div>
      ))}
    </div>
  );
}
