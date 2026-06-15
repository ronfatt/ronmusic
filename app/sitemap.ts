import type { MetadataRoute } from "next";
import { getAlbums, getPublishedSongs } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ron-music.vercel.app";
  const [songs, albums] = await Promise.all([getPublishedSongs(), getAlbums()]);

  return [
    "",
    "/music",
    "/albums",
    "/artist",
    "/contact",
    ...songs.map((song) => `/music/${song.slug}`),
    ...albums.map((album) => `/albums/${album.slug}`)
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date()
  }));
}
