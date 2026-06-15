import { MusicFilters } from "@/components/music/MusicFilters";
import { getPublishedSongs } from "@/lib/supabase/queries";

export default async function MusicPage() {
  const songs = await getPublishedSongs();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-electric">Music library</p>
        <h1 className="mt-4 text-5xl font-black text-pearl">Original songs by R.ON</h1>
        <p className="mt-4 text-lg leading-8 text-pearl/68">Search and filter the official catalog by language, genre, story, and sound direction.</p>
      </div>
      <MusicFilters songs={songs} />
    </section>
  );
}
