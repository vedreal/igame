// Tiny localStorage-backed store for coins + best scores
const KEY = "anima-quest:v1";

export type GameId = "tap-slime" | "rune-rush" | "star-catch";

export type Save = {
  coins: number;
  best: Record<GameId, number>;
  level: number;
  exp: number;
};

const DEFAULT: Save = {
  coins: 0,
  best: { "tap-slime": 0, "rune-rush": 0, "star-catch": 0 },
  level: 1,
  exp: 0,
};

export function loadSave(): Save {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw), best: { ...DEFAULT.best, ...JSON.parse(raw).best } };
  } catch {
    return DEFAULT;
  }
}

export function saveSave(s: Save) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function awardScore(gameId: GameId, score: number): Save {
  const s = loadSave();
  const isNewBest = score > s.best[gameId];
  s.best[gameId] = Math.max(s.best[gameId], score);
  s.coins += score;
  s.exp += score;
  while (s.exp >= s.level * 50) {
    s.exp -= s.level * 50;
    s.level += 1;
  }
  saveSave(s);
  return { ...s, _newBest: isNewBest } as Save & { _newBest?: boolean };
}
