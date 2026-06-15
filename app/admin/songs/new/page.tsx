import { createSong } from "@/app/admin/actions";
import { SongForm } from "@/components/admin/SongForm";

export default function NewSongPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-black">Create new song</h1>
      <SongForm action={createSong} />
    </div>
  );
}
