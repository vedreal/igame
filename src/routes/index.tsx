import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { StatsBar } from "@/components/HudBits";
import { loadSave, Save, GameId } from "@/lib/game-store";
import hero from "@/assets/hero.png";
import heroLv50 from "@/assets/hero-lv50.png";
import heroLv100 from "@/assets/hero-lv100.png";
import heroLv150 from "@/assets/hero-lv150.png";
import heroLv200 from "@/assets/hero-lv200.png";
import heroLv300 from "@/assets/hero-lv300.png";
import iconTapSlime from "@/assets/icon-tap-slime.png";
import iconRuneRush from "@/assets/icon-rune-rush.png";
import iconStarCatch from "@/assets/icon-star-catch.png";

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
  icon: string;
  hue: string;
};

const GAMES: GameDef[] = [
  { id: "tap-slime",  name: "Slime Strike",  blurb: "Tap fast, defeat the slimes!",       to: "/play/tap-slime",  icon: iconTapSlime,  hue: "from-fuchsia-500 to-violet-500" },
  { id: "rune-rush",  name: "Rune Rush",     blurb: "Match the glowing rune in time",      to: "/play/rune-rush",  icon: iconRuneRush,  hue: "from-sky-400 to-indigo-500" },
  { id: "star-catch", name: "Star Catcher",  blurb: "Catch falling stars from the sky",    to: "/play/star-catch", icon: iconStarCatch, hue: "from-amber-300 to-rose-400" },
];

type HeroInfo = {
  src: string;
  name: string;
  title: string;
  glowColor: string;
  gradientClass: string;
};

function getHeroByLevel(level: number): HeroInfo {
  if (level >= 300) return {
    src: heroLv300,
    name: "Dragon Knight",
    title: "Lv 300+ · Legendary",
    glowColor: "oklch(0.45 0.28 20 / 0.7)",
    gradientClass: "from-red-600 to-yellow-500",
  };
  if (level >= 200) return {
    src: heroLv50,
    name: "Fire Warrior",
    title: "Lv 200–299 · Blaze",
    glowColor: "oklch(0.6 0.28 40 / 0.7)",
    gradientClass: "from-orange-400 to-red-500",
  };
  if (level >= 150) return {
    src: heroLv150,
    name: "Thunder Archer",
    title: "Lv 150–199 · Storm",
    glowColor: "oklch(0.75 0.22 280 / 0.7)",
    gradientClass: "from-purple-400 to-yellow-300",
  };
  if (level >= 100) return {
    src: heroLv100,
    name: "Ice Mage",
    title: "Lv 100–149 · Frost",
    glowColor: "oklch(0.7 0.18 220 / 0.7)",
    gradientClass: "from-cyan-300 to-blue-500",
  };
  if (level >= 50) return {
    src: heroLv200,
    name: "Holy Paladin",
    title: "Lv 50–99 · Divine",
    glowColor: "oklch(0.85 0.18 90 / 0.7)",
    gradientClass: "from-yellow-300 to-white",
  };
  return {
    src: hero,
    name: "Sword Bearer",
    title: "Lv 1–49 · Beginner",
    glowColor: "oklch(0.5 0.25 310 / 0.6)",
    gradientClass: "from-fuchsia-400 to-violet-500",
  };
}

function Index() {
  const [save, setSave] = useState<Save | null>(null);
  useEffect(() => { setSave(loadSave()); }, []);
  if (!save) return <GameShell />;

  const heroInfo = getHeroByLevel(save.level);

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
            key={heroInfo.name}
            src={heroInfo.src}
            alt={heroInfo.name}
            width={768}
            height={1024}
            className="relative h-full w-full object-contain animate-float"
            style={{ filter: `drop-shadow(0 8px 24px ${heroInfo.glowColor})` }}
          />
        </div>

        <div className="mt-1 flex flex-col items-center gap-0.5">
          <span className={`text-sm font-bold bg-gradient-to-r ${heroInfo.gradientClass} bg-clip-text text-transparent`}>
            {heroInfo.name}
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
            {heroInfo.title}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3 px-5 pb-8">
        {GAMES.map((g, i) => (
          <Link
            key={g.id}
            to={g.to}
            className="group relative overflow-hidden rounded-3xl bg-card-magic glass-border p-4 shadow-magic transition active:scale-[0.98] animate-fade-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${g.hue} opacity-30 blur-2xl group-hover:opacity-50 transition`} />
            <div className="relative flex items-center gap-3">
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${g.hue} shadow-glow overflow-hidden`}>
                <img
                  src={g.icon}
                  alt={g.name}
                  className="h-12 w-12 object-contain"
                />
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
        ))}
      </section>
    </GameShell>
  );
}
