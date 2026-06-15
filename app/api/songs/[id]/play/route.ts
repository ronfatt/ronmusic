import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: false, message: "Supabase service role is not configured." }, { status: 503 });
  const songsTable = supabase.from("songs") as any;

  const { data, error } = await songsTable.select("play_count").eq("id", id).single();
  if (error) return NextResponse.json({ ok: false }, { status: 404 });

  const { error: updateError } = await songsTable
    .update({ play_count: (data.play_count ?? 0) + 1 })
    .eq("id", id);

  if (updateError) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
