import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SongCard } from "@/components/music/SongCard";
import { PlaySongButton } from "@/components/music/PlaySongButton";
import { getAlbums, getPublishedSongs } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

export default async function HomePage() {
  const songs = await getPublishedSongs();
  const albums = await getAlbums();
  const latest = songs[0];

  return (
    <div>
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=80"
          alt="Cinematic recording studio"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/20" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-electric/30 bg-electric/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-electric">
              RONOVA begins here
            </p>
            <h1 className="text-balance text-6xl font-black leading-none text-pearl sm:text-7xl lg:text-8xl">R.ON Music</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-pearl/78">Original songs, cinematic sound, and stories from the heart.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/music" className="gap-2">Listen Now <ArrowRight size={17} /></ButtonLink>
              <ButtonLink href="/music" variant="secondary">Explore Music</ButtonLink>
              <ButtonLink href="/contact" variant="ghost">Contact for Booking</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {latest ? (
          <div className="grid gap-8 rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow md:grid-cols-[360px_1fr] md:p-8">
            <Image src={latest.cover_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"} alt={`${latest.title} cover`} width={720} height={720} className="aspect-square w-full rounded-lg object-cover" />
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">Featured latest song</p>
              <h2 className="mt-4 text-4xl font-black text-pearl md:text-5xl">{latest.title}</h2>
              <p className="mt-4 max-w-2xl text-pearl/68">{latest.description || latest.story}</p>
              <p className="mt-4 text-sm text-pearl/50">{latest.genre} · {latest.language} · {formatDate(latest.release_date)}</p>
              <div className="mt-7"><PlaySongButton song={latest} label="Play latest song" /></div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-electric">New releases</p>
            <h2 className="mt-3 text-3xl font-black text-pearl">Latest from R.ON</h2>
          </div>
          <Link href="/music" className="text-sm font-semibold text-gold hover:text-pearl">View library</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {songs.slice(0, 4).map((song) => <SongCard key={song.id} song={song} />)}
        </div>
      </section>

      <section className="border-y border-white/10 bg-midnight/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">About the artist</p>
            <h2 className="mt-3 text-4xl font-black text-pearl">Songs built like stories.</h2>
          </div>
          <div className="space-y-6 text-lg leading-8 text-pearl/72">
            <p>R.ON is an independent music producer, songwriter, and composer creating emotional ballads, cinematic rock, worship music, world-inspired sounds, and AI-assisted productions.</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {["Worship", "Cinematic Rock", "World Music", "Pop Ballad", "AI-assisted"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-pearl/70">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-electric">Albums / EPs</p>
            <h2 className="mt-3 text-3xl font-black text-pearl">Featured collections</h2>
          </div>
          <ButtonLink href="/contact" variant="secondary" className="gap-2"><Mail size={16} /> Booking</ButtonLink>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {albums.slice(0, 3).map((album) => (
            <Link key={album.id} href={`/albums/${album.slug}`} className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-gold/40">
              <Image src={album.cover_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80"} alt={`${album.title} cover`} width={720} height={720} className="aspect-square w-full rounded-lg object-cover transition group-hover:scale-[1.02]" />
              <h3 className="mt-4 text-xl font-bold text-pearl">{album.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-pearl/60">{album.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-14 rounded-lg border border-electric/20 bg-electric/10 p-6">
          <Sparkles className="text-electric" />
          <h3 className="mt-4 text-2xl font-black text-pearl">Follow the R.ON universe</h3>
          <p className="mt-2 text-pearl/65">YouTube, MV links, release stories, and future RONOVA updates are gathered here as the official artist-owned home.</p>
        </div>
      </section>
    </div>
  );
}
