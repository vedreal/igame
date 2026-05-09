import { useEffect, useRef, useState } from "react";
import { GameId, awardScore } from "@/lib/game-store";
import { Link } from "@tanstack/react-router";
import { Trophy, RotateCw, Home, Coins } from "lucide-react";

export function GameOver({
  gameId,
  score,
  onRestart,
}: {
  gameId: GameId;
  score: number;
  onRestart: () => void;
}) {
  const [newBest, setNewBest] = useState(false);
  const awarded = useRef(false);

  useEffect(() => {
    if (awarded.current) return;
    awarded.current = true;
    const s = awardScore(gameId, score) as ReturnType<typeof awardScore> & { _newBest?: boolean };
    setNewBest(!!s._newBest);
  }, [gameId, score]);

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-background/70 backdrop-blur-sm animate-fade-up">
      <div className="mx-5 w-full max-w-sm rounded-3xl bg-card-magic glass-border p-6 text-center shadow-magic animate-pop">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-gold-gradient shadow-gold animate-pulse-glow">
          <Trophy className="h-8 w-8 text-gold-foreground" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-extrabold text-magic-gradient">
          {newBest ? "New Best!" : "Quest Complete"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">You earned</p>
        <div className="mt-2 flex items-center justify-center gap-2 text-4xl font-extrabold text-gold-gradient">
          <Coins className="h-7 w-7 text-gold" />
          {score}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onRestart}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-magic-gradient px-4 py-3 font-bold text-primary-foreground shadow-magic active:scale-95 transition"
          >
            <RotateCw className="h-4 w-4" /> Retry
          </button>
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-card-magic glass-border px-4 py-3 font-bold active:scale-95 transition"
          >
            <Home className="h-4 w-4" /> Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) { onDone(); return; }
    const t = setTimeout(() => setN(n - 1), 700);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-background/40 backdrop-blur-sm">
      <div key={n} className="text-8xl font-extrabold text-magic-gradient animate-pop drop-shadow-[0_0_30px_rgba(192,132,252,0.8)]">
        {n === 0 ? "GO!" : n}
      </div>
    </div>
  );
}

export function Timer({ seconds, score }: { seconds: number; score: number }) {
  return (
    <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-2">
      <div className="rounded-full bg-card-magic glass-border px-4 py-1.5 text-sm font-bold tabular-nums">
        ⏱ {seconds.toString().padStart(2, "0")}s
      </div>
      <div className="rounded-full bg-gold-gradient px-4 py-1.5 text-sm font-bold text-gold-foreground shadow-gold tabular-nums">
        {score}
      </div>
    </div>
  );
}
