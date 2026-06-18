import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/admin";
import { getOpenAIClient, openAITextModel } from "@/lib/openai/client";

const requestSchema = z.object({
  title: z.string().trim().min(1).max(140),
  language: z.string().trim().optional(),
  genre: z.string().trim().optional(),
  lyrics: z.string().trim().max(20000).optional(),
  notes: z.string().trim().max(2000).optional()
});

function parseJson(text: string) {
  const cleaned = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned) as {
    description: string;
    story: string;
    seoTitle: string;
    seoDescription: string;
    socialCaption: string;
    moodTags: string[];
    translations: {
      englishIntro: string;
      chineseIntro: string;
      malayIntro: string;
      poeticEnglishLyrics: string;
      chineseLyricMeaning: string;
    };
    releaseKit: {
      youtubeTitle: string;
      youtubeDescription: string;
      facebookCaption: string;
      instagramCaption: string;
      tiktokCaption: string;
      whatsappShareText: string;
      licensingPitch: string;
    };
    coverDirections: Array<{
      name: string;
      prompt: string;
    }>;
  };
}

export async function POST(request: Request) {
  await requireAdmin();

  const payload = requestSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: payload.error.errors[0]?.message || "Invalid request." }, { status: 400 });
  }

  const openai = getOpenAIClient();
  const { title, language, genre, lyrics, notes } = payload.data;

  const response = await openai.responses.create({
    model: openAITextModel,
    input: [
      {
        role: "system",
        content:
          "You are the private admin writing assistant for R.ON Music. Write premium, cinematic artist-owned music copy. Do not claim facts not provided. Return only valid JSON. Keep the artist's ownership and original-work identity central."
      },
      {
        role: "user",
        content: `Create admin-ready metadata for this original R.ON song.

Song title: ${title}
Language: ${language || "Unknown"}
Genre: ${genre || "Original music"}
Artist notes: ${notes || "None"}
Lyrics:
${lyrics || "No lyrics provided"}

Return JSON with these exact keys:
description: 1 polished paragraph, 35-70 words.
story: 2-3 paragraphs about the emotional/background story, 120-220 words.
seoTitle: under 65 characters.
seoDescription: under 155 characters.
socialCaption: 1 short launch caption.
moodTags: 6-10 short lowercase tags.
translations: object with englishIntro, chineseIntro, malayIntro, poeticEnglishLyrics, chineseLyricMeaning. If lyrics are not provided, keep lyric fields empty strings.
releaseKit: object with youtubeTitle, youtubeDescription, facebookCaption, instagramCaption, tiktokCaption, whatsappShareText, licensingPitch.
coverDirections: exactly 3 objects with name and prompt. Directions should be: cinematic, worship/reflection, and dramatic/rock/world. Each prompt must be square album cover art, premium dark R.ON/RONOVA mood, no text, no logos, no readable words.`
      }
    ]
  });

  try {
    const data = parseJson(response.output_text);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "AI response could not be parsed. Try again." }, { status: 502 });
  }
}
