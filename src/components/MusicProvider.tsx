"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { assetPath } from "@/lib/paths";

export type Track = {
  name: string;
  artist: string;
  album: string;
  image: string;
  nowPlaying: boolean;
  date: string;
};

export type TopArtist = {
  name: string;
  playcount: string;
  image: string;
  url: string;
};

export type TopAlbum = {
  name: string;
  artist: string;
  playcount: string;
  image: string;
  url: string;
};

export type LastfmData = {
  configured: boolean;
  user: string;
  tracks: Track[];
  topArtists: TopArtist[];
  topAlbums: TopAlbum[];
};

type ContextValue = {
  data: LastfmData | null;
  loading: boolean;
};

const MusicContext = createContext<ContextValue>({ data: null, loading: true });

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LastfmData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    let result: LastfmData | null = null;

    try {
      const response = await fetch(assetPath("/lastfm.json"), {
        cache: "no-store",
      });
      if (response.ok) result = (await response.json()) as LastfmData;
    } catch {
      /* ignore */
    }

    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = window.setInterval(load, 30_000);
    return () => window.clearInterval(id);
  }, [load]);

  return (
    <MusicContext.Provider value={{ data, loading }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useLastfm() {
  return useContext(MusicContext);
}
