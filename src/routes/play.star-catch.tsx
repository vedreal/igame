import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Countdown, GameOver, Timer } from "@/components/GameOver";

export const Route = createFileRoute("/play/star-catch")({
  component: StarCatch,
  head: () => ({ meta: [{ title: "Star Catcher — Anima Quest" }] }),
});

type Star = {
  id: number;
  x: number; // %
  y: number; // px
  v: number;
  hue: string;
  size: number;
  bomb?: boolean;
};

const HUES = ["#fde68a", "#f0abfc", "#67e8f9", "#c4b5fd", "#fda4af"];

function StarCatch() {
  const [phase, setPhase] = useState<"count" | "play" | "done">("count");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [stars, setStars] = useState<Star[]>([]);
  const [missShake, setMissShake] = useState(0);
  const idRef = useRef(0);
  const fieldRef = useRef<HTMLDivElement>(null);

  // timer
  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  // spawn
  useEffect(() => {
    if (phase !== "play") return;
    const spawn = setInterval(() => {
      const isBomb = Math.random() < 0.18;
      setStars((arr) => [
        ...arr,
        {
          id: idRef.current++,
          x: Math.random() * 85 + 5,
          y: -40,
          v: 1.2 + Math.random() * 1.6,
          hue: isBomb ? "#ef4444" : HUES[Math.floor(Math.random() * HUES.length)],
          size: 32 + Math.random() * 22,
          bomb: isBomb,
        },
      ]);
    }, 420);
    return () => clearInterval(spawn);
  }, [phase]);

  // animation loop
  useEffect(() => {
    if (phase !== "play") return;
    let raf = 0;
    const tick = () => {
      const h = fieldRef.current?.clientHeight ?? 600;
      setStars((arr) =>
        arr
          .map((s) => ({ ...s, y: s.y + s.v }))
          .filter((s) => s.y < h + 60),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const tapStar = (s: Star) => {
    if (phase !== "play") return;
    setStars((arr) => arr.filter((x) => x.id !== s.id));
    if (s.bomb) {
      setScore((v) => Math.max(0, v - 3));
      setMissShake(Date.now());
    } else {
      setScore((v) => v + Math.round(s.size / 8));
    }
  };

  const restart = () => {
    setScore(0); setTime(25); setStars([]);
    setPhase("count");
  };

  return (
    <GameShell title="Star Catcher" back>
      <div className="relative flex-1 px-3 pb-4">
        {phase === "play" && <Timer seconds={time} score={score} />}
        {phase === "count" && <Countdown onDone={() => setPhase("play")} />}
        {phase === "done" && <GameOver gameId="star-catch" score={score} onRestart={restart} />}

        <div className="mt-16 text-center text-xs text-muted-foreground">Catch stars · avoid bombs 💣</div>

        <div
          ref={fieldRef}
          key={missShake}
          className="relative mx-auto mt-3 h-[440px] w-full overflow-hidden rounded-3xl bg-card-magic glass-border shadow-magic"
        >
          {stars.map((s) => (
            <button
              key={s.id}
              onPointerDown={() => tapStar(s)}
              className="absolute -translate-x-1/2 -translate-y-1/2 active:scale-90 transition"
              style={{ left: `${s.x}%`, top: s.y, width: s.size, height: s.size }}
              aria-label={s.bomb ? "bomb" : "star"}
            >
              {s.bomb ? (
                <div
                  className="grid h-full w-full place-items-center rounded-full text-xl"
                  style={{ background: "radial-gradient(circle, #fca5a5, #7f1d1d)", boxShadow: `0 0 18px ${s.hue}` }}
                >
                  💣
                </div>
              ) : (
                <svg viewBox="0 0 24 24" className="h-full w-full" style={{ filter: `drop-shadow(0 0 12px ${s.hue})` }}>
                  <defs>
                    <radialGradient id={`g${s.id}`} cx="50%" cy="40%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="100%" stopColor={s.hue} />
                    </radialGradient>
                  </defs>
                  <path
                    d="M12 2l2.6 6.5L21 9.3l-5 4.6L17.5 21 12 17.6 6.5 21 8 13.9 3 9.3l6.4-.8z"
                    fill={`url(#g${s.id})`}
                    stroke="#fff"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
