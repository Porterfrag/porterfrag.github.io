"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&*!?/<>\\[]{}=+";
const LINES = ["RIDHO", "WAHYU", "DARMAWAN"];
const SCRAMBLE_MS = 700;
const STAGGER_MS = 190;
const GLITCH_MS = 170;

export default function GlitchTitle({ active }: { active: boolean }) {
  const [texts, setTexts] = useState<string[]>(() => [...LINES]);
  const [glitching, setGlitching] = useState<number[]>([]);
  const glitchTimer = useRef<number | undefined>(undefined);
  const timeouts = useRef<number[]>([]);

  const burst = useCallback((index: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setGlitching((prev) => (prev.includes(index) ? prev : [...prev, index]));
    const id = window.setTimeout(() => {
      setGlitching((prev) => prev.filter((n) => n !== index));
    }, GLITCH_MS);
    timeouts.current.push(id);
  }, []);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTexts([...LINES]);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      let done = true;

      const next = LINES.map((line, i) => {
        const local = elapsed - i * STAGGER_MS;
        if (local < 0) {
          done = false;
          return "";
        }
        const p = Math.min(1, local / SCRAMBLE_MS);
        if (p < 1) {
          done = false;
          const revealed = Math.floor(p * line.length);
          return line
            .split("")
            .map((char, index) =>
              index < revealed
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join("");
        }
        return line;
      });

      setTexts(next);

      if (done) {
        scheduleGlitches();
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const scheduleGlitches = () => {
      const schedule = () => {
        glitchTimer.current = window.setTimeout(() => {
          burst(Math.floor(Math.random() * LINES.length));
          schedule();
        }, 2400 + Math.random() * 4200);
      };
      schedule();
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(glitchTimer.current);
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
      setTexts([...LINES]);
      setGlitching([]);
    };
  }, [active, burst]);

  return (
    <>
      {LINES.map((line, i) => (
        <span
          key={line}
          className={`glitch-line${glitching.includes(i) ? " is-glitching" : ""}`}
          data-text={line}
          aria-hidden="true"
          onMouseEnter={() => burst(i)}
        >
          <span className={`glitch-line__text${i === 2 ? " outline" : ""}`}>
            {texts[i]}
          </span>
        </span>
      ))}
    </>
  );
}
