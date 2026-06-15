import { notFound } from "next/navigation";
import { updateSong } from "@/app/admin/actions";
import { SongForm } from "@/components/admin/SongForm";
import { requireAdmin } from "@/lib/supabase/admin";
import type { Song } from "@/lib/types";

export default async function EditSongPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("songs").select("*").eq("id", id).single();
  if (!data) notFound();
  return (
    <div>
      <h1 className="mb-6 text-3xl font-black">Edit song</h1>
      <SongForm action={updateSong.bind(null, id)} song={data as Song} />
    </div>
  );
}
