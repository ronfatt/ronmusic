"use client";

import { Play } from "lucide-react";
import type { Song } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function PlaySongButton({ song, label = "Play" }: { song: Song; label?: string }) {
  const hasAudio = Boolean(song.audio_url);

  return (
    <Button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("ron-play-song", { detail: { song } }))}
      disabled={!hasAudio}
      className="gap-2"
      title={hasAudio ? label : "Audio coming soon"}
    >
      <Play size={16} fill="currentColor" />
      {hasAudio ? label : "Coming Soon"}
    </Button>
  );
}
