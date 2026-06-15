import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioPlayerProvider } from "@/components/player/AudioPlayerProvider";
import { GlobalPlayer } from "@/components/player/GlobalPlayer";
import { getPublishedSongs } from "@/lib/supabase/queries";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ron-music.vercel.app"),
  title: "R.ON Music",
  description: "Original songs, cinematic sound, and stories from the heart.",
  openGraph: {
    title: "R.ON Music",
    description: "Original songs, cinematic sound, and stories from the heart.",
    siteName: "R.ON Music",
    type: "website"
  }
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const songs = await getPublishedSongs();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AudioPlayerProvider initialSongs={songs}>
          {children}
          <GlobalPlayer />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
