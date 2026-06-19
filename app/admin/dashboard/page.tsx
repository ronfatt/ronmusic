import { getAdminAlbums, getAdminSongs, getInquiries } from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const [songs, albums, inquiries] = await Promise.all([getAdminSongs(), getAdminAlbums(), getInquiries()]);
  const plays = songs.reduce((sum, song) => sum + song.play_count, 0);
  const cards = [
    ["Songs", songs.length],
    ["Albums", albums.length],
    ["Play count", plays],
    ["Inquiries", inquiries.length]
  ];
  const isEmptySetup = songs.length === 0 && albums.length === 0 && inquiries.length === 0;

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard overview</h1>
      {isEmptySetup ? (
        <div className="mt-6 rounded-lg border border-gold/25 bg-gold/10 p-5">
          <p className="font-bold text-gold">R.ON Music is ready for the first upload.</p>
          <p className="mt-2 text-sm leading-6 text-pearl/70">
            Songs, albums, and inquiries are currently empty. Start by creating a published song with audio, cover art, lyrics, and a story.
          </p>
        </div>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-pearl/55">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
