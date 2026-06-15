import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PlaySongButton } from "@/components/music/PlaySongButton";
import { getAlbumBySlug } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) return { title: "Album not found | R.ON Music" };

  return {
    title: `${album.title} | R.ON Music`,
    description: album.description || "Album and EP collection by R.ON.",
    openGraph: {
      title: `${album.title} | R.ON Music`,
      description: album.description || "Album and EP collection by R.ON.",
      images: album.cover_url ? [{ url: album.cover_url }] : undefined
    }
  };
}

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
        <Image src={album.cover_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80"} alt={`${album.title} cover`} width={840} height={840} className="aspect-square w-full rounded-lg object-cover shadow-gold" />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">Album / EP</p>
          <h1 className="mt-4 text-5xl font-black text-pearl">{album.title}</h1>
          <p className="mt-5 text-lg leading-8 text-pearl/70">{album.description}</p>
          <p className="mt-5 text-sm text-pearl/50">{formatDate(album.release_date)}</p>
        </div>
      </div>

      <div className="mt-14 rounded-lg border border-white/10 bg-white/[0.04]">
        {album.songs.map((song) => (
          <div key={song.id} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 border-b border-white/10 p-4 last:border-b-0">
            <span className="font-mono text-sm text-pearl/45">{String(song.track_number || 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-bold text-pearl">{song.title}</h2>
              <p className="text-sm text-pearl/50">{song.genre} · {song.language}</p>
            </div>
            <PlaySongButton song={song} />
          </div>
        ))}
      </div>
    </section>
  );
}
