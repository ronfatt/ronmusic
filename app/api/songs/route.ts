import { NextResponse } from "next/server";
import { getPublishedSongs } from "@/lib/supabase/queries";

export async function GET() {
  const songs = await getPublishedSongs();
  return NextResponse.json({ songs });
}
