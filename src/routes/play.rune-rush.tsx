import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Countdown, GameOver, Timer } from "@/components/GameOver";

export const Route = createFileRoute("/play/rune-rush")({
  component: RuneRush,
  head: () => ({ meta: [{ title: "Rune Rush — Anima Quest" }] }),
});

const RUNES = ["✦", "❄", "✧", "⚡", "☾", "✺", "❀", "♆"];
const COLORS = [
  "from-fuchsia-500 to-violet-500",
  "from-sky-400 to-indigo-500",
  "from-amber-300 to-rose-400",
  "from-emerald-400 to-teal-500",
];

type Cell = { rune: string; color: string };

function makeBoard(target: string): Cell[] {
  const cells: Cell[] = [];
  // 9 cells, 1 is target, others are different runes
  const targetIdx = Math.floor(Math.random() * 9);
  for (let i = 0; i < 9; i++) {
    if (i === targetIdx) {
      cells.push({ rune: target, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    } else {
      let r = RUNES[Math.floor(Math.random() * RUNES.length)];
      while (r === target) r = RUNES[Math.floor(Math.random() * RUNES.length)];
      cells.push({ rune: r, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
    }
  }
  return cells;
}

function RuneRush() {
  const [phase, setPhase] = useState<"count" | "play" | "done">("count");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [target, setTarget] = useState(RUNES[0]);
  const [board, setBoard] = useState<Cell[]>(() => makeBoard(RUNES[0]));
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const flashKey = useRef(0);

  const newRound = () => {
    const t = RUNES[Math.floor(Math.random() * RUNES.length)];
    setTarget(t);
    setBoard(makeBoard(t));
  };

  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  const tap = (c: Cell) => {
    if (phase !== "play") return;
    flashKey.current++;
    if (c.rune === target) {
      const gained = 1 + combo;
      setScore((s) => s + gained);
      setCombo((x) => Math.min(x + 1, 9));
      setFlash("good");
      newRound();
    } else {
      setCombo(0);
      setScore((s) => Math.max(0, s - 1));
      setFlash("bad");
    }
    setTimeout(() => setFlash(null), 250);
  };

  const restart = () => {
    setScore(0); setTime(20); setCombo(0);
    newRound();
    setPhase("count");
  };

  return (
    <GameShell title="Rune Rush" back>
      <div className="relative flex-1 px-5 pb-8">
        {phase === "play" && <Timer seconds={time} score={score} />}
        {phase === "count" && <Countdown onDone={() => setPhase("play")} />}
        {phase === "done" && <GameOver gameId="rune-rush" score={score} onRestart={restart} />}

        <div className="mt-16 text-center text-xs text-muted-foreground">Tap the matching rune!</div>

        <div className="mt-4 grid place-items-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Find</div>
          <div
            key={target}
            className="mt-1 grid h-24 w-24 place-items-center rounded-3xl bg-magic-gradient text-5xl shadow-magic animate-pop"
          >
            {target}
          </div>
          {combo > 1 && (
            <div className="mt-2 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-gold-foreground shadow-gold animate-pop">
              ×{combo} COMBO!
            </div>
          )}
        </div>

        <div
          className={`mt-6 grid grid-cols-3 gap-3 transition ${
            flash === "good" ? "ring-4 ring-emerald-400/60 rounded-3xl" : ""
          } ${flash === "bad" ? "animate-shake" : ""}`}
          key={flashKey.current}
        >
          {board.map((c, i) => (
            <button
              key={i}
              onPointerDown={() => tap(c)}
              disabled={phase !== "play"}
              className={`grid aspect-square place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-3xl font-bold text-white shadow-magic active:scale-90 transition`}
            >
              {c.rune}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
