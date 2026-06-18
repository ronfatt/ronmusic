"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils/format";

const songSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug: z.string().trim().optional(),
  language: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().max(500).optional(),
  seo_title: z.string().max(65).optional(),
  seo_description: z.string().max(155).optional(),
  social_caption: z.string().max(500).optional(),
  mood_tags: z.string().max(500).optional(),
  lyrics: z.string().max(20000).optional(),
  story: z.string().max(6000).optional(),
  release_kit: z.string().max(12000).optional(),
  translations: z.string().max(12000).optional(),
  youtube_url: z.string().max(300).optional(),
  generated_cover_url: z.string().url().optional().or(z.literal("")),
  cover_prompt: z.string().max(3000).optional(),
  ai_notes: z.string().max(2000).optional(),
  release_date: z.string().optional(),
  status: z.enum(["draft", "published"])
});

function parseOptionalJson(value?: string) {
  if (!value?.trim()) return {};
  return JSON.parse(value);
}

const albumSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug: z.string().trim().optional(),
  description: z.string().max(1000).optional(),
  release_date: z.string().optional()
});

const uploadRules = {
  audio: {
    maxSize: 50 * 1024 * 1024,
    types: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/aac", "audio/ogg"]
  },
  covers: {
    maxSize: 8 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "image/avif"]
  }
};

async function uploadFile(bucket: "audio" | "covers", file: File | null) {
  if (!file || file.size === 0) return null;
  const { supabase } = await requireAdmin();
  const rules = uploadRules[bucket];
  if (file.size > rules.maxSize) {
    throw new Error(bucket === "audio" ? "Audio file must be 50MB or smaller." : "Cover image must be 8MB or smaller.");
  }
  if (!rules.types.includes(file.type)) {
    throw new Error(bucket === "audio" ? "Unsupported audio format." : "Unsupported cover image format.");
  }
  const extension = file.name.split(".").pop()?.toLowerCase() || (bucket === "audio" ? "mp3" : "jpg");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function createSong(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = songSchema.parse(Object.fromEntries(formData));
  const cover_url = await uploadFile("covers", formData.get("cover") as File | null);
  const audio_url = await uploadFile("audio", formData.get("audio") as File | null);
  const { generated_cover_url: generatedCoverUrl, cover_prompt: coverPrompt, ai_notes: _aiNotes, release_kit: releaseKit, translations, ...songPayload } = parsed;
  const songsTable = supabase.from("songs") as any;

  const { error } = await songsTable.insert({
    ...songPayload,
    slug: parsed.slug || slugify(parsed.title),
    cover_prompt: coverPrompt || null,
    release_kit: parseOptionalJson(releaseKit),
    translations: parseOptionalJson(translations),
    cover_url: cover_url || generatedCoverUrl || null,
    audio_url,
    release_date: parsed.release_date || null
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/music");
  redirect("/admin/songs");
}

export async function updateSong(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = songSchema.parse(Object.fromEntries(formData));
  const cover_url = await uploadFile("covers", formData.get("cover") as File | null);
  const audio_url = await uploadFile("audio", formData.get("audio") as File | null);
  const { generated_cover_url: generatedCoverUrl, cover_prompt: coverPrompt, ai_notes: _aiNotes, release_kit: releaseKit, translations, ...songPayload } = parsed;
  const songsTable = supabase.from("songs") as any;

  const payload = {
    ...songPayload,
    slug: parsed.slug || slugify(parsed.title),
    cover_prompt: coverPrompt || null,
    release_kit: parseOptionalJson(releaseKit),
    translations: parseOptionalJson(translations),
    release_date: parsed.release_date || null,
    ...(cover_url || generatedCoverUrl ? { cover_url: cover_url || generatedCoverUrl } : {}),
    ...(audio_url ? { audio_url } : {})
  };

  const { error } = await songsTable.update(payload).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/music");
  redirect("/admin/songs");
}

export async function deleteSong(id: string) {
  const { supabase } = await requireAdmin();
  const songsTable = supabase.from("songs") as any;
  const { error } = await songsTable.delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/music");
}

export async function createAlbum(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = albumSchema.parse(Object.fromEntries(formData));
  const cover_url = await uploadFile("covers", formData.get("cover") as File | null);
  const albumsTable = supabase.from("albums") as any;
  const { error } = await albumsTable.insert({
    ...parsed,
    slug: parsed.slug || slugify(parsed.title),
    cover_url,
    release_date: parsed.release_date || null
  });
  if (error) throw new Error(error.message);
  revalidatePath("/albums");
}

export async function assignSongToAlbum(formData: FormData) {
  const { supabase } = await requireAdmin();
  const album_id = String(formData.get("album_id"));
  const song_id = String(formData.get("song_id"));
  const track_number = Number(formData.get("track_number") || 1);
  const songAlbumsTable = supabase.from("song_albums") as any;
  const { error } = await songAlbumsTable.upsert({ album_id, song_id, track_number }, { onConflict: "song_id,album_id" });
  if (error) throw new Error(error.message);
  revalidatePath("/albums");
  revalidatePath("/admin/albums");
}
