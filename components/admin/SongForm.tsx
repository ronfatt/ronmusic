import type { Song } from "@/lib/types";
import { AdminSongAssistant } from "@/components/admin/AdminSongAssistant";
import { Button } from "@/components/ui/Button";
import { SongPublishChecklist } from "@/components/admin/SongPublishChecklist";

export function SongForm({ action, song }: { action: (formData: FormData) => void; song?: Song }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form action={action} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <section className="grid gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Step 1</p>
            <h2 className="mt-2 text-xl font-black text-pearl">Song identity</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <input name="title" defaultValue={song?.title} placeholder="Song title" required maxLength={140} className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
            <input name="slug" defaultValue={song?.slug} placeholder="slug-auto-if-empty" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
            <select name="language" defaultValue={song?.language || "English"} className="h-12 rounded-lg border border-white/10 bg-ink px-4">
              {["Chinese", "English", "Malay", "Instrumental"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select name="genre" defaultValue={song?.genre || "Cinematic"} className="h-12 rounded-lg border border-white/10 bg-ink px-4">
              {["Worship", "Rock", "Cinematic", "World Music", "Pop Ballad", "AI-assisted", "Instrumental"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input name="release_date" type="date" defaultValue={song?.release_date || ""} className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
            <select name="status" defaultValue={song?.status || "draft"} className="h-12 rounded-lg border border-white/10 bg-ink px-4">
              <option>draft</option>
              <option>published</option>
            </select>
          </div>
        </section>

        <section className="grid gap-5 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Step 2</p>
            <h2 className="mt-2 text-xl font-black text-pearl">Lyrics, story, and AI copy</h2>
          </div>
          <textarea name="lyrics" defaultValue={song?.lyrics || ""} placeholder="Lyrics" rows={9} maxLength={20000} className="rounded-lg border border-white/10 bg-ink px-4 py-3" />
          <textarea name="story" defaultValue={song?.story || ""} placeholder="Song story / background" rows={6} maxLength={6000} className="rounded-lg border border-white/10 bg-ink px-4 py-3" />
          <AdminSongAssistant />
          <textarea name="description" defaultValue={song?.description || ""} placeholder="Short description" rows={3} maxLength={500} className="rounded-lg border border-white/10 bg-ink px-4 py-3" />
          <div className="grid gap-5 md:grid-cols-2">
            <input name="seo_title" defaultValue={song?.seo_title || ""} placeholder="SEO title" maxLength={65} className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
            <input name="seo_description" defaultValue={song?.seo_description || ""} placeholder="SEO description" maxLength={155} className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          </div>
          <textarea name="social_caption" defaultValue={song?.social_caption || ""} placeholder="Social launch caption" rows={2} maxLength={500} className="rounded-lg border border-white/10 bg-ink px-4 py-3" />
          <input name="mood_tags" defaultValue={song?.mood_tags || ""} placeholder="Mood tags, comma separated" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <textarea name="release_kit" defaultValue={song?.release_kit ? JSON.stringify(song.release_kit, null, 2) : ""} placeholder="Release kit JSON" rows={6} className="rounded-lg border border-white/10 bg-ink px-4 py-3 font-mono text-xs" />
          <textarea name="translations" defaultValue={song?.translations ? JSON.stringify(song.translations, null, 2) : ""} placeholder="Translations JSON" rows={6} className="rounded-lg border border-white/10 bg-ink px-4 py-3 font-mono text-xs" />
        </section>

        <section className="grid gap-5 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Step 3</p>
            <h2 className="mt-2 text-xl font-black text-pearl">Media and publishing</h2>
          </div>
          <input name="youtube_url" defaultValue={song?.youtube_url || ""} placeholder="YouTube / MV URL" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <div className="grid gap-5 md:grid-cols-2">
            <label className="rounded-lg border border-white/10 bg-ink/55 p-4 text-sm text-pearl/70">
              Cover image
              <span className="block text-xs text-pearl/45">JPG, PNG, WebP, or AVIF. Max 8MB.</span>
              {song?.cover_url ? <a className="mt-1 block text-xs text-electric" href={song.cover_url} target="_blank">Current cover</a> : null}
              <input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-3 block w-full text-sm" />
            </label>
            <label className="rounded-lg border border-white/10 bg-ink/55 p-4 text-sm text-pearl/70">
              Audio file
              <span className="block text-xs text-pearl/45">MP3, WAV, AAC, MP4 audio, or OGG. Max 50MB.</span>
              {song?.audio_url ? <a className="mt-1 block text-xs text-electric" href={song.audio_url} target="_blank">Current audio</a> : null}
              <input name="audio" type="file" accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg" className="mt-3 block w-full text-sm" />
            </label>
          </div>
        </section>
        <Button type="submit" className="w-fit">{song ? "Save song" : "Create song"}</Button>
      </form>
      <div className="xl:sticky xl:top-24 xl:self-start">
        <SongPublishChecklist song={song} />
      </div>
    </div>
  );
}
