import Link from "next/link";
import Image from "next/image";
import { getAlbums } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-gold">Albums / EPs</p>
        <h1 className="mt-4 text-5xl font-black text-pearl">Collections from the R.ON universe</h1>
      </div>
      {albums.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link key={album.id} href={`/albums/${album.slug}`} className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-electric/40">
              <Image src={album.cover_url || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80"} alt={`${album.title} cover`} width={720} height={720} className="aspect-square w-full rounded-lg object-cover" />
              <h2 className="mt-5 text-2xl font-black text-pearl">{album.title}</h2>
              <p className="mt-2 text-sm text-pearl/50">{formatDate(album.release_date)} · {album.songs.length} tracks</p>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-pearl/65">{album.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No albums or EPs yet"
          message="Create the first collection from the admin dashboard, then assign songs with track numbers to publish a complete R.ON release."
        />
      )}
    </section>
  );
}
