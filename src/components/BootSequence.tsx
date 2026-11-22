"use client";

import { useEffect, useState } from "react";

const LINES = [
  "> MOUNTING UPLINK ............ <b>OK</b>",
  "> DECRYPTING OPERATOR FILE ... <b>OK</b>",
  "> CALIBRATING VISUAL CORE .... <i>ONLINE</i>",
  "> WELCOME, RUNNER.",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const duration = 2100;
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      setStep(Math.min(LINES.length, Math.floor(p * LINES.length) + 1));
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        document.body.style.overflow = previous;
        onDone();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [onDone]);

  const skip = () => {
    document.body.style.overflow = "";
    onDone();
  };

  return (
    <div className="boot" role="status" aria-live="polite">
      <div className="boot__inner">
        <div className="boot__logo">
          RWD<span>_</span>
          <br />
          SYSTEM
        </div>
        <div className="boot__lines">
          {LINES.slice(0, step).map((line, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </div>
        <div className="boot__bar">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="boot__meta mono-xs">
          <span>TAU CETI // SECTOR 07</span>
          <span>{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
        </div>
        <button className="boot__skip" onClick={skip} type="button">
          [ SKIP SEQUENCE ]
        </button>
      </div>
    </div>
  );
}
