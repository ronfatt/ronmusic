import type { Album, AlbumWithSongs, Inquiry, Song } from "@/lib/types";
import { getSupabaseServerClient, getSupabaseServiceClient, hasSupabaseEnv } from "./server";

export const demoSongs: Song[] = [
  {
    id: "demo-1",
    title: "Stories From The Heart",
    slug: "stories-from-the-heart",
    artist: "R.ON",
    language: "English",
    genre: "Cinematic",
    description: "A cinematic ballad demo entry for the R.ON Music launch experience.",
    lyrics: "When the night becomes a river\nI will write the light back home",
    story: "Written as a signature theme for the artist universe, blending emotional piano with cinematic guitars.",
    cover_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    audio_url: "",
    youtube_url: "",
    release_date: "2026-01-01",
    status: "published",
    play_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-2",
    title: "Electric Grace",
    slug: "electric-grace",
    artist: "R.ON",
    language: "Instrumental",
    genre: "Worship",
    description: "Instrumental worship textures with electric blue atmosphere and warm gold melody lines.",
    lyrics: "",
    story: "A worship-focused instrumental designed for prayer, reflection, and cinematic visuals.",
    cover_url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    audio_url: "",
    youtube_url: "",
    release_date: "2026-02-14",
    status: "published",
    play_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const demoAlbums: AlbumWithSongs[] = [
  {
    id: "album-demo",
    title: "RONOVA Sessions",
    slug: "ronova-sessions",
    description: "A future-facing EP collection for cinematic, worship, and world-inspired songs.",
    cover_url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
    release_date: "2026-03-01",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    songs: demoSongs.map((song, index) => ({ ...song, track_number: index + 1 }))
  }
];

export async function getPublishedSongs() {
  const supabase = await getSupabaseServerClient();
  if (!supabase || !hasSupabaseEnv()) return demoSongs;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("status", "published")
    .order("release_date", { ascending: false });

  if (error) {
    console.error("Failed to load songs", error);
    return [];
  }

  return (data ?? []) as Song[];
}

export async function getSongBySlug(slug: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase || !hasSupabaseEnv()) return demoSongs.find((song) => song.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as Song;
}

export async function getAlbums() {
  const supabase = await getSupabaseServerClient();
  if (!supabase || !hasSupabaseEnv()) return demoAlbums;

  const { data, error } = await supabase
    .from("albums")
    .select("*, song_albums(track_number, songs(*))")
    .order("release_date", { ascending: false });

  if (error) {
    console.error("Failed to load albums", error);
    return [];
  }

  return (data ?? []).map((album: Album & { song_albums?: Array<{ track_number: number | null; songs: Song }> }) => ({
    ...album,
    songs: (album.song_albums ?? [])
      .map((item) => ({ ...item.songs, track_number: item.track_number }))
      .filter((song) => song.status === "published")
      .sort((a, b) => (a.track_number ?? 0) - (b.track_number ?? 0))
  })) as AlbumWithSongs[];
}

export async function getAlbumBySlug(slug: string) {
  const albums = await getAlbums();
  return albums.find((album) => album.slug === slug) ?? null;
}

export async function getAdminSongs() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Song[];
}

export async function getAdminAlbums() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("albums").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Album[];
}

export async function getInquiries() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Inquiry[];
}
