import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/admin";
import { getOpenAIClient, openAIImageModel } from "@/lib/openai/client";

const requestSchema = z.object({
  prompt: z.string().trim().min(20).max(3000),
  title: z.string().trim().min(1).max(140)
});

export async function POST(request: Request) {
  const { supabase } = await requireAdmin();

  const payload = requestSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.errors[0]?.message || "Invalid request." }, { status: 400 });
  }

  const openai = getOpenAIClient();
  const image = await openai.images.generate({
    model: openAIImageModel,
    prompt: `${payload.data.prompt}\n\nSquare music cover art. No text, no logo, no readable typography.`,
    size: "1024x1024",
    quality: "high"
  });

  const b64 = image.data?.[0]?.b64_json;
  if (!b64) {
    return NextResponse.json({ error: "Image generation returned no image data." }, { status: 502 });
  }

  const buffer = Buffer.from(b64, "base64");
  const path = `ai/${Date.now()}-${payload.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  const { error } = await supabase.storage.from("covers").upload(path, buffer, {
    contentType: "image/png",
    upsert: false
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("covers").getPublicUrl(path);
  return NextResponse.json({ coverUrl: data.publicUrl });
}
