"use client";

import { profile } from "@/data/profile";
import { assetPath } from "@/lib/paths";

export default function Dossier() {
  return (
    <section className="section" id="dossier">
      <div className="section-head" data-reveal>
        <div>
          <div className="mono text-red">[ 002 ] // IDENTIFICATION</div>
          <h2 className="section-head__title">
            DOSSIER<em>_</em>
          </h2>
        </div>
        <div className="section-head__meta mono-xs">
          FILE: {profile.operatorCode}
          <br />
          CLEARANCE: PUBLIC
          <br />
          STATUS: <span className="text-red">ACTIVE</span>
        </div>
      </div>

      <div className="dossier">
        <div data-reveal data-parallax="0.04">
          <div className="photo-frame">
            <img
              src={assetPath("/foto_profil.jpg")}
              alt="Illustrated portrait of Ridho Wahyu Darmawan"
            />
            <div className="photo-frame__tint" aria-hidden="true" />
            <div className="photo-frame__scan" aria-hidden="true" />
            <div className="photo-frame__cross" aria-hidden="true" />
            <div className="photo-frame__label mono-xs" aria-hidden="true">
              <span>SUBJECT // RWD</span>
              <span>REC ●</span>
            </div>
            <div className="photo-frame__foot" aria-hidden="true">
              <div className="barcode" />
              <span className="mono-xs">{profile.operatorCode}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="dossier__body" data-reveal>
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <div className="dossier__note">
              <p>“{profile.note}”</p>
            </div>
          </div>

          <div className="dossier__stats" data-reveal>
            {profile.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat__value">{stat.value}</div>
                <div className="stat__label mono-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
