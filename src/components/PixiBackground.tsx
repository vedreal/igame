import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";

export function PixiBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let destroyed = false;
    const app = new Application();

    type Particle = {
      g: Graphics;
      x: number;
      y: number;
      vy: number;
      vx: number;
      r: number;
      twinkle: number;
      hue: number;
    };
    const particles: Particle[] = [];
    let raf = 0;

    (async () => {
      await app.init({
        resizeTo: host,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: window.devicePixelRatio || 1,
      });
      if (destroyed) {
        app.destroy(true, { children: true });
        return;
      }
      host.appendChild(app.canvas);

      const layer = new Container();
      app.stage.addChild(layer);

      const w = () => app.renderer.width / (window.devicePixelRatio || 1);
      const h = () => app.renderer.height / (window.devicePixelRatio || 1);

      const colors = [0xc084fc, 0x60a5fa, 0xf0abfc, 0xfde68a, 0x67e8f9];
      const count = 60;
      for (let i = 0; i < count; i++) {
        const r = Math.random() * 2.5 + 0.8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const g = new Graphics().circle(0, 0, r).fill({ color, alpha: 0.9 });
        g.x = Math.random() * w();
        g.y = Math.random() * h();
        layer.addChild(g);
        particles.push({
          g,
          x: g.x,
          y: g.y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -(Math.random() * 0.4 + 0.1),
          r,
          twinkle: Math.random() * Math.PI * 2,
          hue: color,
        });
      }

      // bigger glowing orbs
      for (let i = 0; i < 6; i++) {
        const r = Math.random() * 60 + 40;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const orb = new Graphics().circle(0, 0, r).fill({ color, alpha: 0.08 });
        orb.x = Math.random() * w();
        orb.y = Math.random() * h();
        layer.addChildAt(orb, 0);
        particles.push({
          g: orb,
          x: orb.x,
          y: orb.y,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(Math.random() * 0.1 + 0.02),
          r,
          twinkle: Math.random() * Math.PI * 2,
          hue: color,
        });
      }

      const tick = () => {
        const W = w();
        const H = h();
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.twinkle += 0.04;
          if (p.y < -p.r) {
            p.y = H + p.r;
            p.x = Math.random() * W;
          }
          if (p.x < -p.r) p.x = W + p.r;
          if (p.x > W + p.r) p.x = -p.r;
          p.g.x = p.x;
          p.g.y = p.y;
          p.g.alpha = p.r > 10 ? 0.08 + Math.sin(p.twinkle) * 0.04 : 0.4 + Math.sin(p.twinkle) * 0.5;
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      try { app.destroy(true, { children: true }); } catch { /* noop */ }
    };
  }, []);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0 -z-10" />;
}
