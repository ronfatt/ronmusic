import Link from "next/link";
import Image from "next/image";
import type { Song } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import { PlaySongButton } from "./PlaySongButton";

export function SongCard({ song }: { song: Song }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-electric/40 hover:bg-white/[0.07]">
      <Link href={`/music/${song.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-midnight">
          <Image
            src={song.cover_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80"}
            alt={`${song.title} cover`}
            width={800}
            height={800}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-4 p-4">
        <div>
          <Link href={`/music/${song.slug}`} className="line-clamp-1 text-lg font-bold text-pearl hover:text-electric">
            {song.title}
          </Link>
          <p className="mt-1 text-sm text-pearl/58">{song.language || "Unknown"} · {song.genre || "Original"} · {formatDate(song.release_date)}</p>
        </div>
        <PlaySongButton song={song} />
      </div>
    </article>
  );
}
