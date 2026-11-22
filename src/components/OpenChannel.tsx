"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

export default function OpenChannel() {
  const [copied, setCopied] = useState<"email" | "discord" | null>(null);

  const copy = async (value: string, key: "email" | "discord") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="channel" id="channel">
      <div className="channel__inner">
        <div className="mono text-red" data-reveal>
          [ 005 ] // TRANSMISSION
        </div>
        <h2 className="channel__big" data-reveal>
          OPEN <em>CHANNEL</em>
        </h2>
        <p className="channel__text" data-reveal>
          Got a system to build, a workflow to untangle, or just want to talk
          shop? The channel is open. Send a signal and I&apos;ll get back to you.
        </p>
        <div className="channel__actions" data-reveal>
          <a className="btn" href={`mailto:${profile.email}`}>
            SEND EMAIL <span className="btn__arrow">↗</span>
          </a>
          <a
            className="btn btn--ghost"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GITHUB <span className="btn__arrow">↗</span>
          </a>
        </div>

        <div className="channel__grid" data-reveal>
          <div className="channel__cell">
            <small className="mono-xs">EMAIL ADDRESS</small>
            <button
              type="button"
              onClick={() => copy(profile.email, "email")}
              title="Copy email"
            >
              {copied === "email" ? "COPIED ✓" : profile.email}
            </button>
          </div>
          <div className="channel__cell">
            <small className="mono-xs">DISCORD HANDLE</small>
            <button
              type="button"
              onClick={() => copy(profile.discord, "discord")}
              title="Copy Discord handle"
            >
              {copied === "discord" ? "COPIED ✓" : profile.discord}
            </button>
          </div>
          <div className="channel__cell">
            <small className="mono-xs">AVAILABILITY</small>
            <span className="text-red">OPEN FOR COLLABORATION</span>
          </div>
        </div>
      </div>

      <div className="footer mono-xs">
        <span>© 2026 {profile.handle} // ALL SIGNALS RESERVED</span>
        <span>BUILT WITH NEXT.JS // THREE.JS // GSAP</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </section>
  );
}
