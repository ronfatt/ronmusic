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

  return (
    <div>
      <h1 className="text-3xl font-black">Dashboard overview</h1>
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
