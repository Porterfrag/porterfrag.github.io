import type { Metadata } from "next";
import { MusicProvider } from "@/components/MusicProvider";

export const metadata: Metadata = {
  title: "Sound System — Ridho Wahyu Darmawan",
  description:
    "A frequency log: artists on rotation, albums in the queue, the audio gear in use, and whatever Last.fm says is playing right now.",
  openGraph: {
    title: "Sound System — Ridho Wahyu Darmawan",
    description: "Artists, albums, gear, and scrobbles.",
    type: "website",
  },
};

export default function MusicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MusicProvider>{children}</MusicProvider>;
}
