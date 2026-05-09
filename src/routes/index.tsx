import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sword, Sparkles, Star } from "lucide-react";
import { GameShell } from "@/components/GameShell";
import { StatsBar } from "@/components/HudBits";
import { loadSave, Save, GameId } from "@/lib/game-store";
import hero from "@/assets/hero.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Anima Quest — Fantasy Mini Games" },
      { name: "description", content: "A magical mini-game collection. Tap, match, and catch your way through an anime fantasy world." },
    ],
  }),
});

type GameDef = {
  id: GameId;
  name: string;
  blurb: string;
  to: "/play/tap-slime" | "/play/rune-rush" | "/play/star-catch";
  icon: typeof Sword;
  hue: string;
};

const GAMES: GameDef[] = [
  { id: "tap-slime",  name: "Slime Strike", blurb: "Tap fast, defeat the slimes!", to: "/play/tap-slime",  icon: Sword,     hue: "from-fuchsia-500 to-violet-500" },
  { id: "rune-rush",  name: "Rune Rush",    blurb: "Match the glowing rune in time", to: "/play/rune-rush",  icon: Sparkles,  hue: "from-sky-400 to-indigo-500" },
  { id: "star-catch", name: "Star Catcher", blurb: "Catch falling stars from the sky", to: "/play/star-catch", icon: Star,      hue: "from-amber-300 to-rose-400" },
];

function Index() {
  const [save, setSave] = useState<Save | null>(null);
  useEffect(() => { setSave(loadSave()); }, []);
  if (!save) return <GameShell />;

  return (
    <GameShell>
      <StatsBar save={save} />

      <section className="relative px-5 pt-2 pb-4 text-center">
        <div className="absolute inset-x-0 top-2 -z-10 mx-auto h-44 w-44 rounded-full bg-magic-gradient opacity-40 blur-3xl" />
        <h1 className="text-3xl font-extrabold leading-tight text-magic-gradient">Anima Quest</h1>
        <p className="mt-1 text-xs text-muted-foreground">Choose your adventure, hero ✨</p>

        <div className="relative mx-auto mt-2 h-56 w-56">
          <div className="absolute inset-x-4 bottom-2 h-3 rounded-full bg-magic-gradient opacity-50 blur-md" />
          <img
            src={hero}
            alt="Hero"
            width={768}
            height={1024}
            className="relative h-full w-full object-contain animate-float"
            style={{ filter: "drop-shadow(0 8px 24px oklch(0.5 0.25 310 / 0.6))" }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 px-5 pb-8">
        {GAMES.map((g, i) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.id}
              to={g.to}
              className="group relative overflow-hidden rounded-3xl bg-card-magic glass-border p-4 shadow-magic transition active:scale-[0.98] animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            >
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${g.hue} opacity-30 blur-2xl group-hover:opacity-50 transition`} />
              <div className="relative flex items-center gap-3">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${g.hue} shadow-glow`}>
                  <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-base font-bold">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.blurb}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</div>
                  <div className="text-base font-bold text-gold-gradient">{save.best[g.id]}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </GameShell>
  );
}
