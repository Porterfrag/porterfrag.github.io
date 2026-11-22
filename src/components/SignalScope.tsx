"use client";

import { useEffect, useRef } from "react";

const RED = "255, 59, 48";

export default function SignalScope() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;

    const blips = [
      { angle: 0.5, radius: 6 },
      { angle: 2.3, radius: 9 },
      { angle: 4.6, radius: 7 },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // ---- sonar sweep ----
      const cx = 19;
      const cy = height / 2;
      const r = Math.min(11, height / 2 - 3);

      ctx.strokeStyle = `rgba(${RED}, 0.32)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(${RED}, 0.14)`;
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();

      const sweep = t * 0.0015;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, `rgba(${RED}, 0.6)`);
      gradient.addColorStop(1, `rgba(${RED}, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, sweep - 0.65, sweep);
      ctx.closePath();
      ctx.fill();

      blips.forEach((blip, i) => {
        const angle = blip.angle + sweep * 0.22;
        const x = cx + Math.cos(angle) * blip.radius;
        const y = cy + Math.sin(angle) * blip.radius;
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.002 + i * 1.7));
        ctx.fillStyle = `rgba(${RED}, ${pulse})`;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      });

      // ---- signal grid ----
      const startX = 46;
      const endX = Math.max(startX + 20, width - 10);
      const span = endX - startX;
      const mid = height / 2;

      ctx.strokeStyle = "rgba(242, 240, 235, 0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = startX; x <= endX; x += 26) {
        ctx.moveTo(x, 2);
        ctx.lineTo(x, height - 2);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(242, 240, 235, 0.09)";
      ctx.beginPath();
      ctx.moveTo(startX, mid);
      ctx.lineTo(endX, mid);
      ctx.stroke();

      // ---- oscilloscope trace ----
      ctx.beginPath();
      for (let x = startX; x <= endX; x++) {
        const u = (x - startX) / span;
        const phase = u * 13 - t * 0.0032;
        const envelope = 0.55 + 0.45 * Math.sin(u * 5.5 + t * 0.0007);
        let y = mid + Math.sin(phase) * 4.2 * envelope + Math.sin(phase * 2.7) * 1.5;

        const spike = Math.abs(Math.sin(u * 41 + t * 0.0005));
        if (spike > 0.988) {
          y += (spike - 0.988) * 520 * (Math.sin(u * 97) > 0 ? 1 : -1);
        }

        if (x === startX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgb(${RED})`;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = `rgba(${RED}, 0.85)`;
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ---- scan head ----
      const headX = startX + span * 0.72;
      ctx.strokeStyle = `rgba(${RED}, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(headX, 2);
      ctx.lineTo(headX, height - 2);
      ctx.stroke();
    };

    const tick = (now: number) => {
      elapsed += Math.min(now - last, 60);
      last = now;
      render(elapsed);

      if (!reduce && !document.hidden) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="signal-scope" aria-hidden="true" />;
}
