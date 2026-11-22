"use client";

import { useEffect, useRef } from "react";

type Burst = {
  x: number;
  y: number;
  started: number;
  seed: number;
};

const LIFE = 620;

export default function ClickFX() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const bursts: Burst[] = [];
    let raf = 0;

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        const age = now - burst.started;
        if (age > LIFE) {
          bursts.splice(i, 1);
          continue;
        }

        const p = age / LIFE;
        const ease = 1 - Math.pow(1 - p, 3);
        const fade = 1 - p;

        // center flash
        if (p < 0.22) {
          const flash = 1 - p / 0.22;
          ctx.fillStyle = `rgba(255, 59, 48, ${flash * 0.45})`;
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 2 + flash * 7, 0, Math.PI * 2);
          ctx.fill();
        }

        // outer ring
        ctx.strokeStyle = `rgba(255, 59, 48, ${fade * 0.85})`;
        ctx.lineWidth = 0.4 + fade * 1.4;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, 6 + ease * 56, 0, Math.PI * 2);
        ctx.stroke();

        // delayed inner ring
        if (p > 0.12) {
          const p2 = (p - 0.12) / 0.88;
          const ease2 = 1 - Math.pow(1 - p2, 3);
          ctx.strokeStyle = `rgba(242, 240, 235, ${(1 - p2) * 0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 3 + ease2 * 34, 0, Math.PI * 2);
          ctx.stroke();
        }

        // radial shards
        for (let k = 0; k < 8; k++) {
          const angle = (k / 8) * Math.PI * 2 + burst.seed;
          const distance = 8 + ease * 48;
          const x = burst.x + Math.cos(angle) * distance;
          const y = burst.y + Math.sin(angle) * distance;
          ctx.fillStyle = `rgba(255, 59, 48, ${fade * 0.75})`;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }

        // crosshair ticks
        const inner = 10 + ease * 10;
        const outer = inner + 9 * fade;
        ctx.strokeStyle = `rgba(255, 59, 48, ${fade * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const angle = (k / 4) * Math.PI * 2 + burst.seed;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          ctx.moveTo(burst.x + dx * inner, burst.y + dy * inner);
          ctx.lineTo(burst.x + dx * outer, burst.y + dy * outer);
        }
        ctx.stroke();
      }

      raf = bursts.length ? requestAnimationFrame(render) : 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      bursts.push({
        x: event.clientX,
        y: event.clientY,
        started: performance.now(),
        seed: Math.random() * Math.PI * 2,
      });
      if (!raf) raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <canvas ref={ref} className="click-fx" aria-hidden="true" />;
}
