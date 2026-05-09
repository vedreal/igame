import { Coins, Star, Zap } from "lucide-react";
import { Save } from "@/lib/game-store";

export function StatsBar({ save }: { save: Save }) {
  const next = save.level * 50;
  const pct = Math.min(100, (save.exp / next) * 100);
  return (
    <div className="flex items-center gap-2 px-5 py-3">
      <div className="flex items-center gap-1.5 rounded-full bg-card-magic glass-border px-3 py-1.5 text-sm font-bold">
        <Coins className="h-4 w-4 text-gold" />
        <span className="text-gold-gradient">{save.coins}</span>
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-full bg-card-magic glass-border px-3 py-1.5">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-magic-gradient text-[10px] font-bold text-primary-foreground shadow-glow">
          {save.level}
        </div>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-magic-gradient transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

export function ScoreCard({ icon: Icon, label, value, color }: { icon: typeof Star; label: string; value: number | string; color?: string }) {
  return (
    <div className="rounded-2xl bg-card-magic glass-border px-3 py-2.5 text-center">
      <div className="mb-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        {label}
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

export { Star, Zap };
