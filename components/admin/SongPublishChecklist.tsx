import { Check, Circle, ExternalLink } from "lucide-react";
import type { Song } from "@/lib/types";
import { ButtonLink } from "@/components/ui/Button";

const requirements = [
  { key: "title", label: "Song title" },
  { key: "audio_url", label: "Audio file" },
  { key: "cover_url", label: "Cover image" },
  { key: "lyrics", label: "Lyrics" },
  { key: "story", label: "Song story" },
  { key: "description", label: "Short description" },
  { key: "release_date", label: "Release date" }
] as const;

export function SongPublishChecklist({ song }: { song?: Song }) {
  const completed = requirements.filter((item) => Boolean(song?.[item.key])).length;
  const total = requirements.length;
  const isPublished = song?.status === "published";

  return (
    <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Publish readiness</p>
          <h2 className="mt-2 text-xl font-black text-pearl">{completed}/{total} essentials complete</h2>
        </div>
        {song ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${isPublished ? "bg-gold/15 text-gold" : "bg-white/10 text-pearl/60"}`}>
            {song.status}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2">
        {requirements.map((item) => {
          const done = Boolean(song?.[item.key]);
          return (
            <div key={item.key} className="flex items-center gap-3 rounded-lg border border-white/10 bg-ink/45 px-3 py-2 text-sm">
              {done ? <Check size={16} className="text-gold" /> : <Circle size={16} className="text-pearl/35" />}
              <span className={done ? "text-pearl" : "text-pearl/50"}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm leading-6 text-pearl/60">
        Use the AI assistant after lyrics are entered, then preview the public presentation before changing the status to published.
      </p>

      {song ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href={`/admin/songs/${song.id}/preview`} variant="secondary" className="gap-2">
            Preview page <ExternalLink size={15} />
          </ButtonLink>
          {isPublished ? (
            <ButtonLink href={`/music/${song.slug}`} variant="ghost" className="gap-2">
              Public page <ExternalLink size={15} />
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
