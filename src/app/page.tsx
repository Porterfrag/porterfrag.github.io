"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import BootSequence from "@/components/BootSequence";
import SectionTransition from "@/components/SectionTransition";
import Hero from "@/components/Hero";
import Dossier from "@/components/Dossier";
import Loadout from "@/components/Loadout";
import Projects from "@/components/Projects";
import OpenChannel from "@/components/OpenChannel";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("rwd:booted") === "1") setBooting(false);
    } catch {
      setBooting(false);
    }
  }, []);

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem("rwd:booted", "1");
    } catch {
      /* storage unavailable */
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    if (booting) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set("[data-reveal]", {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        filter: "blur(0px)",
      });
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    window.addEventListener("scroll", ScrollTrigger.update, { passive: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.parallax ?? "0.1");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.from(".hero__title .glitch-line", {
        opacity: 0,
        yPercent: 115,
        duration: 1,
        stagger: 0.09,
        ease: "power4.out",
        delay: 0.1,
      });
    }, rootRef);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
      gsap.ticker.remove(raf);
      window.removeEventListener("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [booting]);

  return (
    <>
      {booting && <BootSequence onDone={finishBoot} />}
      <SectionTransition />
      <main className="shell" ref={rootRef}>
        <Hero active={!booting} />
        <Dossier />
        <Loadout />
        <Projects />
        <OpenChannel />
      </main>
    </>
  );
}
