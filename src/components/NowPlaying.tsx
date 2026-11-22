"use client";

import { useLastfm } from "./MusicProvider";

export default function NowPlaying() {
  const { data, loading } = useLastfm();

  const tracks = data?.tracks ?? [];
  const current = tracks.find((track) => track.nowPlaying) ?? tracks[0];
  const recent = tracks.filter((track) => !track.nowPlaying).slice(0, 5);
  const isLive = Boolean(current?.nowPlaying);
  const isEmpty = Boolean(data?.configured && tracks.length === 0 && !loading);
  const isOffline = Boolean(!data?.configured && !loading);

  return (
    <div className="nowplaying">
      <div className="nowplaying__main">
        <div className="nowplaying__art">
          {current?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.image} alt={`${current.name} cover`} />
          ) : (
            <div className="nowplaying__art-fallback">
              <span className="mono-xs">NO SIGNAL</span>
              <div className="nowplaying__art-cross" />
            </div>
          )}
        </div>
        <div className="nowplaying__info">
          <div className="nowplaying__status mono-xs">
            <i className={isLive ? "is-live" : ""} />
            {loading
              ? "CONNECTING..."
              : isLive
                ? "SCROBBLING NOW"
                : isEmpty
                  ? "NO SCROBBLES YET"
                  : isOffline
                    ? "LAST.FM OFFLINE"
                    : "LAST PLAYED"}
          </div>
          <h3 className="nowplaying__title">
            {current?.name ?? (isEmpty ? "AWAITING SIGNAL" : "NO TRACK DATA")}
          </h3>
          <p className="nowplaying__artist">
            {current?.artist ??
              (isEmpty
                ? "BELUM ADA LAGU YANG TEREKAM DI AKUN INI"
                : "HUBUNGKAN AKUN LAST.FM UNTUK MENAMPILKAN SCROBBLE")}
          </p>
          {current?.album && (
            <p className="nowplaying__album mono-xs">ALBUM // {current.album}</p>
          )}
          <div className="eq" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${(i % 7) * 0.11}s` }} />
            ))}
          </div>
          {(isOffline || isEmpty) && (
            <div className="nowplaying__links">
              <a
                className="nowplaying__link mono-xs"
                href={`https://www.last.fm/user/${data?.user ?? "porterfrag"}`}
                target="_blank"
                rel="noreferrer"
              >
                VIEW LAST.FM PROFILE ↗
              </a>
              {isOffline && (
                <a
                  className="nowplaying__link mono-xs"
                  href="https://www.last.fm/api/account/create"
                  target="_blank"
                  rel="noreferrer"
                >
                  GET API KEY ↗
                </a>
              )}
              {isEmpty && (
                <a
                  className="nowplaying__link mono-xs"
                  href="https://www.last.fm/about/trackmymusic"
                  target="_blank"
                  rel="noreferrer"
                >
                  HOW TO SCROBBLE ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="nowplaying__recent">
        <div className="nowplaying__recent-head mono-xs">
          <span>RECENT TRANSMISSIONS</span>
          <span>
            {data?.configured
              ? `${recent.length} TRACKS`
              : loading
                ? "CONNECTING..."
                : "OFFLINE"}
          </span>
        </div>
        {recent.length ? (
          <ol className="tracklist">
            {recent.map((track, i) => (
              <li key={`${track.name}-${i}`}>
                <span className="tracklist__index mono-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="tracklist__name">{track.name}</span>
                <span className="tracklist__artist mono-xs">{track.artist}</span>
                <span className="tracklist__date mono-xs">{track.date}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="nowplaying__empty mono-xs">
            {loading
              ? "READING SCROBBLES..."
              : isEmpty
                ? "AKUN LAST.FM MASIH KOSONG. HUBUNGKAN SCROBBLER (SPOTIFY / YOUTUBE MUSIC / BROWSER) AGAR LAGU YANG KAMU DENGARKAN MULAI TEREKAM DI SINI."
                : "BELUM ADA DATA SCROBBLE YANG BISA DITAMPILKAN."}
          </div>
        )}
      </div>
    </div>
  );
}
