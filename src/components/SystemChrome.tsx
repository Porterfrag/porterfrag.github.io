"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile, sections } from "@/data/profile";
import SignalScope from "./SignalScope";

export default function SystemChrome() {
  const [time, setTime] = useState("--:--:--");
  const [activeSection, setActiveSection] = useState(0);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.findIndex((item) => item.id === entry.target.id);
          if (index >= 0) setActiveSection(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Makassar",
          hour12: false,
        }).format(new Date()),
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="overlay-grid" aria-hidden="true" />
      <div className="overlay-grain" aria-hidden="true" />
      <div className="overlay-scan" aria-hidden="true" />

      <header className="hud-top">
        <div className="hud-top__brand mono">
          <b>RWD</b>
          <span className="hud-top__brand-tail"> // RUNNER PROFILE</span>
        </div>
        <div className="hud-top__right mono-xs">
          <nav className="hud-nav" aria-label="Main navigation">
            <Link href="/" className={isHome ? "is-active" : ""}>
              PROFILE
            </Link>
            <Link href="/music" className={!isHome ? "is-active" : ""}>
              MUSIC
            </Link>
          </nav>
          <span>ID: {profile.operatorCode}</span>
          <span>LOC: {profile.location}</span>
          <span>
            <i className="status-dot" />
            UPLINK ACTIVE
          </span>
        </div>
      </header>

      <div className="corner corner--tl" aria-hidden="true" />
      <div className="corner corner--tr" aria-hidden="true" />
      <div className="corner corner--bl" aria-hidden="true" />
      <div className="corner corner--br" aria-hidden="true" />

      <div className="side-rail" aria-hidden="true">
        <span className="side-rail__text">SCROLL TO DECRYPT</span>
        <span className="side-rail__line" />
        <span className="side-rail__text text-red">
          {isHome ? `${sections[activeSection].code} / 05` : "006 / MUSIC"}
        </span>
      </div>

      <footer className="hud-bottom">
        <div className="mono-xs">[ {time} ]</div>
        <div className="scope-wrap" aria-hidden="true">
          <SignalScope />
        </div>
        <div className="mono-xs">SCAN // ACTIVE</div>
      </footer>
    </>
  );
}
