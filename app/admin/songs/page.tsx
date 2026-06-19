import Link from "next/link";
import { deleteSong } from "@/app/admin/actions";
import { ButtonLink } from "@/components/ui/Button";
import { getAdminSongs } from "@/lib/supabase/queries";

export default async function AdminSongsPage() {
  const songs = await getAdminSongs();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Songs</h1>
        <ButtonLink href="/admin/songs/new">New song</ButtonLink>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
        {songs.map((song) => (
          <div key={song.id} className="grid gap-4 border-b border-white/10 p-4 last:border-b-0 md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center">
            <div>
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-pearl/50">{song.status} · {song.genre} · {song.play_count} plays</p>
            </div>
            <Link href={`/admin/songs/${song.id}/preview`} className="text-sm text-electric">Preview</Link>
            {song.status === "published" ? <Link href={`/music/${song.slug}`} className="text-sm text-electric">Public</Link> : <span className="text-sm text-pearl/35">Draft</span>}
            <Link href={`/admin/songs/${song.id}/edit`} className="text-sm text-gold">Edit</Link>
            <form action={deleteSong.bind(null, song.id)} className="w-fit">
              <button className="text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
        {songs.length === 0 ? (
          <div className="p-8 text-center">
            <h2 className="text-lg font-bold text-pearl">No songs yet</h2>
            <p className="mt-2 text-sm text-pearl/60">Create the first song, add lyrics, run the AI assistant, then preview before publishing.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
