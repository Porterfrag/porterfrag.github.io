import type { Metadata } from "next";
import { Anton, Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import SystemChrome from "@/components/SystemChrome";
import ClickFX from "@/components/ClickFX";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ridho Wahyu Darmawan — Web Developer",
  description:
    "Web developer focused on school information systems, internship management, and IT support operations. TypeScript, JavaScript, PHP, Laravel, MySQL, GitHub.",
  keywords: [
    "Ridho Wahyu Darmawan",
    "Web Developer",
    "TypeScript",
    "JavaScript",
    "Native PHP",
    "Laravel",
    "MySQL",
    "IT Support",
    "School Information System",
  ],
  openGraph: {
    title: "Ridho Wahyu Darmawan — Web Developer",
    description:
      "Runner profile // systems, internship platforms, and IT support tooling.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="js">
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${anton.variable} ${chakra.variable} ${plex.variable}`}>
        <SystemChrome />
        <ClickFX />
        {children}
      </body>
    </html>
  );
}
