import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const USER = process.env.LASTFM_USER || "porterfrag";
const API_KEY = process.env.LASTFM_API_KEY;

const empty = {
  configured: false,
  user: USER,
  tracks: [],
  topArtists: [],
  topAlbums: [],
};

const imageAt = (images, index = 2) =>
  images?.[index]?.["#text"] ?? images?.[1]?.["#text"] ?? "";

async function getLastfm(method, limit) {
  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", method);
  url.searchParams.set("user", USER);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    headers: { "User-Agent": "RWD-Runner-Profile/1.0" },
  });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  const data = await response.json();
  if (data?.error) throw new Error(`LASTFM_${data.error}`);
  return data;
}

async function main() {
  let payload = empty;

  if (API_KEY) {
    try {
      const [recent, artists, albums] = await Promise.all([
        getLastfm("user.getrecenttracks", 8),
        getLastfm("user.gettopartists", 18),
        getLastfm("user.gettopalbums", 4),
      ]);

      const tracks = recent?.recenttracks?.track ?? [];
      const topArtists = artists?.topartists?.artist ?? [];
      const topAlbums = albums?.topalbums?.album ?? [];
      const asArray = (value) =>
        Array.isArray(value) ? value : value ? [value] : [];

      payload = {
        configured: true,
        user: USER,
        tracks: asArray(tracks).map((track) => ({
          name: String(track.name ?? "UNKNOWN TRACK"),
          artist: String(
            (typeof track.artist === "object"
              ? track.artist?.["#text"]
              : track.artist) ?? "UNKNOWN ARTIST",
          ),
          album: String(track.album?.["#text"] ?? ""),
          image: imageAt(track.image),
          nowPlaying: track["@attr"]?.nowplaying === "true",
          date: String(track.date?.["#text"] ?? ""),
        })),
        topArtists: asArray(topArtists).map((artist) => ({
          name: String(artist.name ?? "UNKNOWN"),
          playcount: String(artist.playcount ?? "0"),
          image: imageAt(artist.image),
          url: String(artist.url ?? ""),
        })),
        topAlbums: asArray(topAlbums).map((album) => ({
          name: String(album.name ?? "UNKNOWN"),
          artist: String(album.artist?.name ?? "UNKNOWN"),
          playcount: String(album.playcount ?? "0"),
          image: imageAt(album.image),
          url: String(album.url ?? ""),
        })),
      };
    } catch (error) {
      console.warn("Last.fm fetch failed, using empty payload:", error.message);
    }
  } else {
    console.warn("LASTFM_API_KEY is not set, writing empty payload.");
  }

  const target = path.join(process.cwd(), "public", "lastfm.json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(payload, null, 2), "utf8");
  console.log(
    `Wrote ${target} (${payload.tracks.length} tracks, ${payload.topArtists.length} artists, ${payload.topAlbums.length} albums)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
