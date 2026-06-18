"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AssistantResult = {
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

function getField(form: HTMLFormElement, name: string) {
  const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  return field?.value || "";
}

function setField(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  if (!field) return;
  field.value = value;
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

export function AdminSongAssistant() {
  const [result, setResult] = useState<AssistantResult | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [error, setError] = useState("");
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);

  async function generateCopy(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;

    setError("");
    setLoadingCopy(true);
    try {
      const response = await fetch("/api/admin/ai/song-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: getField(form, "title"),
          language: getField(form, "language"),
          genre: getField(form, "genre"),
          lyrics: getField(form, "lyrics"),
          notes: getField(form, "ai_notes")
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "AI generation failed.");
      setResult(payload.data);
      setSelectedCoverIndex(0);
      setField(form, "description", payload.data.description);
      setField(form, "story", payload.data.story);
      setField(form, "seo_title", payload.data.seoTitle);
      setField(form, "seo_description", payload.data.seoDescription);
      setField(form, "social_caption", payload.data.socialCaption);
      setField(form, "mood_tags", payload.data.moodTags.join(", "));
      setField(form, "translations", JSON.stringify(payload.data.translations, null, 2));
      setField(form, "release_kit", JSON.stringify(payload.data.releaseKit, null, 2));
      setField(form, "cover_prompt", payload.data.coverDirections[0]?.prompt || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed.");
    } finally {
      setLoadingCopy(false);
    }
  }

  async function generateCover(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form) return;

    const prompt = getField(form, "cover_prompt") || result?.coverDirections[selectedCoverIndex]?.prompt || "";
    setError("");
    setLoadingCover(true);
    try {
      const response = await fetch("/api/admin/ai/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: getField(form, "title"),
          prompt
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Cover generation failed.");
      setCoverUrl(payload.coverUrl);
      setField(form, "generated_cover_url", payload.coverUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover generation failed.");
    } finally {
      setLoadingCover(false);
    }
  }

  return (
    <section className="rounded-lg border border-electric/20 bg-electric/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-pearl">
            <Sparkles size={20} className="text-electric" />
            AI Song Assistant
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-pearl/65">
            Use the title, language, genre, lyrics, and notes to draft the song description, story, SEO copy, launch caption, and cover prompt.
          </p>
        </div>
        <Button type="button" onClick={generateCopy} disabled={loadingCopy} className="gap-2">
          <Sparkles size={16} />
          {loadingCopy ? "Writing..." : "Generate copy"}
        </Button>
      </div>

      <textarea
        name="ai_notes"
        rows={3}
        placeholder="Optional notes for AI: mood, inspiration, Bible verse, instruments, story angle, target language..."
        className="mt-5 w-full rounded-lg border border-white/10 bg-ink/80 px-4 py-3 text-sm text-pearl outline-none focus:border-electric"
      />

      <textarea
        name="cover_prompt"
        rows={4}
        defaultValue={result?.coverDirections[selectedCoverIndex]?.prompt || ""}
        placeholder="Cover prompt will appear here. You can edit it before generating the image."
        className="mt-4 w-full rounded-lg border border-white/10 bg-ink/80 px-4 py-3 text-sm text-pearl outline-none focus:border-electric"
      />

      {result?.coverDirections?.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {result.coverDirections.map((direction, index) => (
            <button
              key={direction.name}
              type="button"
              onClick={(event) => {
                const form = event.currentTarget.form;
                setSelectedCoverIndex(index);
                if (form) setField(form, "cover_prompt", direction.prompt);
              }}
              className={`rounded-lg border p-3 text-left transition ${
                selectedCoverIndex === index ? "border-electric bg-electric/15" : "border-white/10 bg-ink/50 hover:bg-white/10"
              }`}
            >
              <span className="block text-sm font-bold capitalize text-pearl">{direction.name}</span>
              <span className="mt-2 line-clamp-3 block text-xs leading-5 text-pearl/55">{direction.prompt}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={generateCover} disabled={loadingCover} variant="secondary" className="gap-2">
          <ImageIcon size={16} />
          {loadingCover ? "Generating cover..." : "Generate cover"}
        </Button>
        {result ? <span className="text-xs text-pearl/55">SEO: {result.seoTitle} · Tags: {result.moodTags.join(", ")}</span> : null}
        {error ? <span className="text-sm text-red-300">{error}</span> : null}
      </div>

      {result ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-ink/50 p-4">
            <h3 className="text-sm font-bold text-gold">Release Kit</h3>
            <dl className="mt-3 space-y-3 text-sm text-pearl/70">
              <div><dt className="text-pearl/45">YouTube</dt><dd>{result.releaseKit.youtubeTitle}</dd></div>
              <div><dt className="text-pearl/45">Facebook</dt><dd>{result.releaseKit.facebookCaption}</dd></div>
              <div><dt className="text-pearl/45">Licensing</dt><dd>{result.releaseKit.licensingPitch}</dd></div>
            </dl>
          </div>
          <div className="rounded-lg border border-white/10 bg-ink/50 p-4">
            <h3 className="text-sm font-bold text-electric">Translations</h3>
            <dl className="mt-3 space-y-3 text-sm text-pearl/70">
              <div><dt className="text-pearl/45">English</dt><dd>{result.translations.englishIntro}</dd></div>
              <div><dt className="text-pearl/45">Chinese</dt><dd>{result.translations.chineseIntro}</dd></div>
              <div><dt className="text-pearl/45">Malay</dt><dd>{result.translations.malayIntro}</dd></div>
            </dl>
          </div>
        </div>
      ) : null}

      {coverUrl ? (
        <div className="mt-5 flex items-center gap-4 rounded-lg border border-white/10 bg-ink/60 p-3">
          <Image src={coverUrl} alt="Generated cover preview" width={96} height={96} className="size-24 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-semibold text-pearl">Generated cover ready</p>
            <p className="mt-1 text-xs text-pearl/55">This URL will be saved as the song cover if you submit the form.</p>
          </div>
        </div>
      ) : null}

      <input name="generated_cover_url" type="hidden" />
    </section>
  );
}
