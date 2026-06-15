import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PlaySongButton } from "@/components/music/PlaySongButton";
import { ShareButton } from "@/components/music/ShareButton";
import { SongCard } from "@/components/music/SongCard";
import { getPublishedSongs, getSongBySlug } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const song = await getSongBySlug(slug);
  if (!song) return { title: "Song not found | R.ON Music" };

  return {
    title: `${song.title} | R.ON Music`,
    description: song.description || song.story || "Original music by R.ON.",
    openGraph: {
      title: `${song.title} | R.ON Music`,
      description: song.description || "Original music by R.ON.",
      images: song.cover_url ? [{ url: song.cover_url }] : undefined,
      type: "music.song"
    }
  };
}

export default async function SongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);
  if (!song) notFound();
  const songs = await getPublishedSongs();
  const related = songs.filter((item) => item.id !== song.id).slice(0, 3);

  const youtubeId = song.youtube_url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)?.[1];

  return (
    <article className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[440px_1fr]">
        <Image src={song.cover_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"} alt={`${song.title} cover`} width={880} height={880} className="aspect-square w-full rounded-lg object-cover shadow-glow" />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">{song.artist}</p>
          <h1 className="mt-4 text-5xl font-black text-pearl md:text-6xl">{song.title}</h1>
          <p className="mt-5 text-lg leading-8 text-pearl/68">{song.description}</p>
          <p className="mt-5 text-sm text-pearl/50">{song.genre} · {song.language} · {formatDate(song.release_date)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PlaySongButton song={song} label="Play song" />
            <ShareButton title={`${song.title} | R.ON Music`} />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black text-pearl">Lyrics</h2>
          <pre className="mt-5 whitespace-pre-wrap font-sans leading-8 text-pearl/72">{song.lyrics || "Lyrics will be added soon."}</pre>
        </section>
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black text-pearl">Song story</h2>
          <p className="mt-5 leading-8 text-pearl/72">{song.story || "Story notes will be added soon."}</p>
        </section>
      </div>

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

      <section className="mt-16">
        <h2 className="mb-6 text-3xl font-black text-pearl">Related songs</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <SongCard key={item.id} song={item} />)}
        </div>
      </section>
    </article>
  );
}
