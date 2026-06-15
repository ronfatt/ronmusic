import { assignSongToAlbum, createAlbum } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { getAdminAlbums, getAdminSongs } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";

export default async function AdminAlbumsPage() {
  const [albums, songs] = await Promise.all([getAdminAlbums(), getAdminSongs()]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <section>
        <h1 className="text-3xl font-black">Manage albums</h1>
        <div className="mt-6 rounded-lg border border-white/10">
          {albums.map((album) => (
            <div key={album.id} className="border-b border-white/10 p-4 last:border-b-0">
              <p className="font-bold">{album.title}</p>
              <p className="text-sm text-pearl/50">{formatDate(album.release_date)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-6">
        <form action={createAlbum} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">Create album / EP</h2>
          <input name="title" placeholder="Album title" required maxLength={140} className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <input name="slug" placeholder="slug-auto-if-empty" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <input name="release_date" type="date" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <textarea name="description" placeholder="Description" rows={4} maxLength={1000} className="rounded-lg border border-white/10 bg-ink px-4 py-3" />
          <label className="text-sm text-pearl/70">
            Cover image
            <span className="block text-xs text-pearl/45">JPG, PNG, WebP, or AVIF. Max 8MB.</span>
            <input name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-2 block w-full" />
          </label>
          <Button type="submit">Create album</Button>
        </form>
        <form action={assignSongToAlbum} className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-black">Assign song to album</h2>
          <select name="album_id" className="h-12 rounded-lg border border-white/10 bg-ink px-4">
            {albums.map((album) => <option key={album.id} value={album.id}>{album.title}</option>)}
          </select>
          <select name="song_id" className="h-12 rounded-lg border border-white/10 bg-ink px-4">
            {songs.map((song) => <option key={song.id} value={song.id}>{song.title}</option>)}
          </select>
          <input name="track_number" type="number" min="1" defaultValue="1" className="h-12 rounded-lg border border-white/10 bg-ink px-4" />
          <Button type="submit">Assign track</Button>
        </form>
      </section>
    </div>
  );
}
