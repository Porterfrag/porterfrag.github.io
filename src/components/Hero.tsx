"use client";

import dynamic from "next/dynamic";
import { profile } from "@/data/profile";
import GlitchTitle from "./GlitchTitle";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero({ active = true }: { active?: boolean }) {
  return (
    <section className="hero" id="top">
      <div className="hero__canvas" aria-hidden="true">
        <HeroScene />
      </div>

      <div className="hero__content">
        <div className="hero__eyebrow mono">[ 001 ] // RUNNER PROFILE</div>
        <h1 className="hero__title" aria-label="Ridho Wahyu Darmawan">
          <GlitchTitle active={active} />
        </h1>
        <div className="hero__role mono">{profile.role}</div>
        <p className="hero__line">{profile.heroLine}</p>
        <div className="hero__actions">
          <a className="btn" href="#dossier">
            VIEW DOSSIER <span className="btn__arrow">↘</span>
          </a>
          <a className="btn btn--ghost" href="#channel">
            OPEN CHANNEL <span className="btn__arrow">↗</span>
          </a>
        </div>
      </div>

      <div className="hero__scroll mono-xs" aria-hidden="true">
        SCROLL <i />
      </div>
    </section>
  );
}
