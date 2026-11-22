"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import NowPlaying from "@/components/NowPlaying";
import { useLastfm } from "@/components/MusicProvider";
import { albums, artists, gear, lastfmUser } from "@/data/music";

export default function MusicPage() {
  const rootRef = useRef<HTMLElement>(null);
  const { data } = useLastfm();

  const liveArtists = data?.topArtists ?? [];
  const liveAlbums = data?.topAlbums ?? [];

  const artistList = liveArtists.length
    ? liveArtists.map((artist) => ({
        name: artist.name,
        tag: `${Number(artist.playcount).toLocaleString("en-US")} SCROBBLES`,
        image: artist.image,
        url: artist.url,
      }))
    : artists.map((artist) => ({
        name: artist.name,
        tag: artist.tag,
        image: "",
        url: "",
      }));

  const albumList = liveAlbums.length
    ? liveAlbums.map((album, i) => ({
        id: String(i + 1).padStart(2, "0"),
        title: album.name,
        artist: album.artist,
        image: album.image,
        url: album.url,
      }))
    : albums.map((album) => ({ ...album, image: "", url: "" }));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      anchors: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.from(".music-hero__title span", {
        opacity: 0,
        yPercent: 115,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      });
    }, rootRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [data]);

  return (
    <main className="shell music" ref={rootRef}>
      <section className="music-hero" id="music-top">
        <div className="music-hero__inner">
          <div className="mono text-red">[ 006 ] // FREQUENCY LOG</div>
          <h1 className="music-hero__title">
            <span>SOUND</span>
            <span className="outline">SYSTEM</span>
          </h1>
          <p className="music-hero__line">
            A running log of what&apos;s on rotation — the artists, the albums,
            the hardware, and whatever Last.fm caught me playing last.
          </p>
          <div className="hero__actions">
            <a className="btn" href="#now-playing">
              CHECK NOW PLAYING <span className="btn__arrow">↘</span>
            </a>
            <Link className="btn btn--ghost" href="/">
              BACK TO PROFILE <span className="btn__arrow">↗</span>
            </Link>
          </div>
        </div>
        <div className="music-hero__deco" aria-hidden="true">
          <div className="music-hero__ring" />
          <div className="music-hero__ring music-hero__ring--two" />
          <div className="music-hero__wave" />
        </div>
      </section>

      <section className="section section--tight" id="now-playing">
        <div className="section-head" data-reveal>
          <div>
            <div className="mono text-red">[ 001 ] // LIVE FEED</div>
            <h2 className="section-head__title">
              NOW <em>PLAYING</em>
            </h2>
          </div>
          <div className="section-head__meta mono-xs">
            SOURCE: LAST.FM / {lastfmUser.toUpperCase()}
            <br />
            REFRESH: 30S
          </div>
        </div>
        <div data-reveal>
          <NowPlaying />
        </div>
      </section>

      <section className="section" id="rotation">
        <div className="section-head" data-reveal>
          <div>
            <div className="mono text-red">[ 002 ] // ROTATION LOG</div>
            <h2 className="section-head__title">
              ARTISTS<em>_</em>
            </h2>
          </div>
          <div className="section-head__meta mono-xs">
            ENTRIES: {String(artistList.length).padStart(2, "0")}
            <br />
            SOURCE: {liveArtists.length ? "LAST.FM TOP ARTISTS" : "LOCAL FALLBACK"}
          </div>
        </div>
        <div className="artist-grid">
          {artistList.map((artist, i) => {
            const content = (
              <>
                <span className="artist-card__index mono-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="artist-card__name">{artist.name}</span>
                <span className="artist-card__tag mono-xs">{artist.tag}</span>
              </>
            );
            return artist.url ? (
              <a
                className="artist-card artist-card--linked"
                href={artist.url}
                target="_blank"
                rel="noreferrer"
                key={`artist-${i}`}
                data-reveal
              >
                {artist.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="artist-card__image" src={artist.image} alt="" />
                )}
                {content}
              </a>
            ) : (
              <div className="artist-card" key={`${artist.name}-${i}`} data-reveal>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" id="albums">
        <div className="section-head" data-reveal>
          <div>
            <div className="mono text-red">[ 003 ] // COLLECTION</div>
            <h2 className="section-head__title">
              ALBUMS<em>_</em>
            </h2>
          </div>
          <div className="section-head__meta mono-xs">
            SLOTS: {String(albumList.length).padStart(2, "0")}
            <br />
            SOURCE: {liveAlbums.length ? "LAST.FM TOP ALBUMS" : "LOCAL FALLBACK"}
          </div>
        </div>
        <div className="album-grid">
          {albumList.map((album) => {
            const content = (
              <>
                <div className="album-slot__art">
                  {album.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.image} alt={album.title} />
                  ) : (
                    <>
                      <span className="album-slot__plus">+</span>
                      <span className="album-slot__code mono-xs">
                        SLOT_{album.id}
                      </span>
                    </>
                  )}
                </div>
                <div className="album-slot__meta">
                  <span className="mono-xs">{album.title}</span>
                  <span className="mono-xs text-muted">{album.artist}</span>
                </div>
              </>
            );
            return album.url ? (
              <a
                className="album-slot"
                href={album.url}
                target="_blank"
                rel="noreferrer"
                key={`album-${album.id}`}
                data-reveal
              >
                {content}
              </a>
            ) : (
              <div
                className="album-slot"
                key={`album-${album.id}`}
                data-reveal
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" id="rack">
        <div className="section-head" data-reveal>
          <div>
            <div className="mono text-red">[ 004 ] // HARDWARE</div>
            <h2 className="section-head__title">
              THE RACK<em>_</em>
            </h2>
          </div>
          <div className="section-head__meta mono-xs">
            IEM: 04
            <br />
            SPEAKER: 01 / DAC: 01
          </div>
        </div>
        <div className="rack">
          {gear.map((group) => (
            <div className="rack__group" key={group.category} data-reveal>
              <div className="rack__group-head">
                <span className="mono text-red">[{group.code}]</span>
                <span className="rack__category">{group.category}</span>
                <span className="mono-xs text-muted">
                  {String(group.items.length).padStart(2, "0")} UNIT
                </span>
              </div>
              <div className="rack__items">
                {group.items.map((item, i) => (
                  <div className="rack__item" key={item.name}>
                    <span className="mono-xs text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="rack__name">{item.name}</span>
                    <span className="mono-xs text-red">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="music-footer mono-xs">
        <span>© 2026 RWD // FREQUENCY LOG</span>
        <Link href="/">BACK TO RUNNER PROFILE ↑</Link>
      </div>
    </main>
  );
}
