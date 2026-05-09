import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { Countdown, GameOver, Timer } from "@/components/GameOver";
import monster from "@/assets/monster.png";

export const Route = createFileRoute("/play/tap-slime")({
  component: TapSlime,
  head: () => ({ meta: [{ title: "Slime Strike — Anima Quest" }] }),
});

type Pop = { id: number; x: number; y: number; v: number };

function TapSlime() {
  const [phase, setPhase] = useState<"count" | "play" | "done">("count");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [hits, setHits] = useState(0);
  const [shake, setShake] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== "play") return;
    if (time <= 0) { setPhase("done"); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, time]);

  const onHit = (e: React.PointerEvent) => {
    if (phase !== "play") return;
    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 0;
    const y = rect ? e.clientY - rect.top : 0;
    const v = Math.floor(1 + Math.random() * 3);
    setScore((s) => s + v);
    setHits((h) => h + 1);
    setShake(Date.now());
    setPops((p) => [...p, { id: idRef.current++, x, y, v }]);
    setTimeout(() => setPops((p) => p.slice(1)), 800);
  };

  const restart = () => {
    setScore(0); setTime(15); setHits(0); setPops([]);
    setPhase("count");
  };

  return (
    <GameShell title="Slime Strike" back>
      <div ref={containerRef} className="relative flex-1 px-5 pb-8">
        {phase === "play" && <Timer seconds={time} score={score} />}
        {phase === "count" && <Countdown onDone={() => setPhase("play")} />}
        {phase === "done" && <GameOver gameId="tap-slime" score={score} onRestart={restart} />}

        <div className="mt-16 text-center text-xs text-muted-foreground">Tap the slime as fast as you can!</div>
        <div className="mt-2 text-center text-sm">Hits: <span className="font-bold text-accent">{hits}</span></div>

        <div className="mt-8 grid place-items-center">
          <div className="relative h-72 w-72">
            <div className="absolute inset-0 rounded-full bg-magic-gradient opacity-40 blur-3xl animate-pulse-glow" />
            <button
              onPointerDown={onHit}
              key={shake}
              className="relative h-full w-full animate-shake"
              style={{ animationPlayState: phase === "play" ? "running" : "paused" }}
              disabled={phase !== "play"}
            >
              <img
                src={monster}
                alt="Slime"
                width={768}
                height={768}
                loading="lazy"
                className="h-full w-full select-none object-contain animate-float"
                draggable={false}
              />
            </button>
          </div>
        </div>

        {/* floating pops */}
        {pops.map((p) => (
          <div
            key={p.id}
            className="pointer-events-none absolute text-2xl font-extrabold text-gold-gradient animate-rise"
            style={{ left: p.x, top: p.y, textShadow: "0 0 10px rgba(255,200,80,0.6)" }}
          >
            +{p.v}
          </div>
        ))}
      </div>
    </GameShell>
  );
}
