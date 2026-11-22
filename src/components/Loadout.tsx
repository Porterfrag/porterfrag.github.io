"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { loadout } from "@/data/profile";

export default function Loadout() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = gridRef.current?.querySelectorAll<HTMLElement>(".module");
    if (!nodes) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" id="loadout">
      <div className="section-head" data-reveal>
        <div>
          <div className="mono text-red">[ 003 ] // CAPABILITIES</div>
          <h2 className="section-head__title">
            LOADOUT<em>_</em>
          </h2>
        </div>
        <div className="section-head__meta mono-xs">
          MODULES: {String(loadout.length).padStart(2, "0")} / {String(loadout.length).padStart(2, "0")}
          <br />
          SYNC: <span className="text-red">COMPLETE</span>
        </div>
      </div>

      <div className="loadout" ref={gridRef}>
        {loadout.map((item) => (
          <article
            className="module"
            key={item.id}
            style={{ "--level": item.level / 100 } as CSSProperties}
            data-reveal
          >
            <div className="module__top mono-xs">
              <span className="module__id">MOD_{item.id}</span>
              <span>{item.tag}</span>
            </div>
            <h3 className="module__name">{item.name}</h3>
            <p className="module__detail">{item.detail}</p>
            <div className="module__meter">
              <i />
            </div>
            <div className="module__foot mono-xs">
              <span>PROFICIENCY INDEX / EST.</span>
              <b>{item.status}</b>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
