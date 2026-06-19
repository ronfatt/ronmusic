import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PlaySongButton } from "@/components/music/PlaySongButton";
import { ShareButton } from "@/components/music/ShareButton";
import { ButtonLink } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/supabase/admin";
import type { Song } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";

function getStringValue(source: Record<string, unknown> | null | undefined, key: string) {
  const value = source?.[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminSongPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("songs").select("*").eq("id", id).single();
  if (!data) notFound();

  const song = data as Song;
  const youtubeId = song.youtube_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)?.[1];
  const tags = song.mood_tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
  const englishIntro = getStringValue(song.translations, "englishIntro");
  const chineseIntro = getStringValue(song.translations, "chineseIntro");
  const malayIntro = getStringValue(song.translations, "malayIntro");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gold/25 bg-gold/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Admin preview</p>
            <h1 className="mt-2 text-2xl font-black text-pearl">Previewing {song.title}</h1>
            <p className="mt-1 text-sm text-pearl/62">This preview can show draft songs before they are public.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/admin/songs/${song.id}/edit`} variant="secondary" className="gap-2">
              <ArrowLeft size={15} /> Back to edit
            </ButtonLink>
            {song.status === "published" ? (
              <ButtonLink href={`/music/${song.slug}`} variant="ghost" className="gap-2">
                Public page <ExternalLink size={15} />
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>

      <article className="rounded-lg border border-white/10 bg-ink/45 p-5 md:p-8">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <Image src={song.cover_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"} alt={`${song.title} cover`} width={880} height={880} className="aspect-square w-full rounded-lg object-cover shadow-glow" />
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">{song.artist}</p>
            <h2 className="mt-4 text-5xl font-black text-pearl md:text-6xl">{song.title}</h2>
            <p className="mt-5 text-lg leading-8 text-pearl/68">{song.description || "No description yet."}</p>
            <p className="mt-5 text-sm text-pearl/50">{song.genre} · {song.language} · {formatDate(song.release_date)}</p>
            {tags.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-pearl/65">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <PlaySongButton song={song} label="Play song" />
              <ShareButton title={`${song.title} | R.ON Music`} />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-2xl font-black text-pearl">Lyrics</h3>
            <pre className="mt-5 whitespace-pre-wrap font-sans leading-8 text-pearl/72">{song.lyrics || "Lyrics will be added soon."}</pre>
          </section>
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-2xl font-black text-pearl">Song story</h3>
            <p className="mt-5 leading-8 text-pearl/72">{song.story || "Story notes will be added soon."}</p>
          </section>
        </div>

        {englishIntro || chineseIntro || malayIntro ? (
          <section className="mt-10 rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-2xl font-black text-pearl">Language notes</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {englishIntro ? <p className="text-sm leading-6 text-pearl/70"><span className="mb-2 block font-bold text-electric">English</span>{englishIntro}</p> : null}
              {chineseIntro ? <p className="text-sm leading-6 text-pearl/70"><span className="mb-2 block font-bold text-gold">中文</span>{chineseIntro}</p> : null}
              {malayIntro ? <p className="text-sm leading-6 text-pearl/70"><span className="mb-2 block font-bold text-pearl">Malay</span>{malayIntro}</p> : null}
            </div>
          </section>
        ) : null}

        {song.social_caption ? (
          <section className="mt-10 rounded-lg border border-gold/20 bg-gold/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">Release note</p>
            <p className="mt-3 text-lg leading-8 text-pearl/78">{song.social_caption}</p>
          </section>
        ) : null}

        {youtubeId ? (
          <section className="mt-10 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`${song.title} music video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </section>
        ) : null}
      </article>

      <Link href={`/admin/songs/${song.id}/edit`} className="inline-flex text-sm font-semibold text-gold hover:text-pearl">
        Back to edit
      </Link>
    </div>
  );
}
