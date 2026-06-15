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
          <div key={song.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/10 p-4 last:border-b-0">
            <div>
              <p className="font-bold">{song.title}</p>
              <p className="text-sm text-pearl/50">{song.status} · {song.genre} · {song.play_count} plays</p>
            </div>
            <Link href={`/music/${song.slug}`} className="text-sm text-electric">View</Link>
            <Link href={`/admin/songs/${song.id}/edit`} className="text-sm text-gold">Edit</Link>
            <form action={deleteSong.bind(null, song.id)}>
              <button className="text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
