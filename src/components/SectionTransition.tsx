"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "@/data/profile";

export default function SectionTransition() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.findIndex((item) => item.id === entry.target.id);
          if (index < 0 || index === active) return;

          setActive(index);
          if (first.current) {
            first.current = false;
          } else {
            setPulse((value) => value + 1);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [active]);

  const section = sections[active];

  return (
    <div
      key={pulse}
      className={`section-transition${pulse ? " is-playing" : ""}`}
      aria-hidden="true"
    >
      <div className="section-transition__pulse" />
      <div className="section-transition__label mono">
        [ {section.code} ] // {section.name}
      </div>
    </div>
  );
}
