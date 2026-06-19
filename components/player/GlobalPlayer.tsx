"use client";

import { useContext } from "react";
import Image from "next/image";
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { AudioPlayerContext } from "./AudioPlayerProvider";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function GlobalPlayer() {
  const player = useContext(AudioPlayerContext);
  if (!player) return null;
  const { currentSong, isPlaying, isShuffle, repeatMode, progress, duration, volume, toggle, next, previous, seek, setVolume, toggleShuffle, cycleRepeat } = player;
  const canPlay = Boolean(currentSong?.audio_url);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/92 px-3 py-2 backdrop-blur-xl sm:px-5 sm:py-3">
      <div className="mx-auto grid max-w-7xl items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {currentSong?.cover_url ? (
            <Image
              src={currentSong.cover_url}
              alt={`${currentSong.title} cover`}
              width={56}
              height={56}
              className="size-12 rounded-lg object-cover sm:size-14"
            />
          ) : (
            <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-electric/25 bg-[radial-gradient(circle_at_35%_25%,rgba(56,169,255,0.45),transparent_34%),linear-gradient(135deg,rgba(245,184,83,0.25),rgba(6,10,20,0.95))] text-xs font-black text-pearl sm:size-14 sm:text-sm">
              R.ON
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-pearl">{currentSong?.title || "Select a song"}</p>
            <p className="truncate text-xs text-pearl/55">{currentSong?.artist || "R.ON"}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button className={`grid size-9 place-items-center rounded-lg transition sm:size-10 ${isShuffle ? "bg-electric/20 text-electric" : "text-pearl/55 hover:bg-white/10 hover:text-pearl"}`} onClick={toggleShuffle} aria-label="Shuffle">
            <Shuffle size={17} />
          </button>
          <button className="grid size-9 place-items-center rounded-lg text-pearl/70 transition hover:bg-white/10 hover:text-pearl sm:size-10" onClick={previous} aria-label="Previous song">
            <SkipBack size={18} />
          </button>
          <button className="grid size-10 place-items-center rounded-full bg-electric text-ink shadow-glow transition hover:bg-[#66bbff] disabled:cursor-not-allowed disabled:opacity-45 sm:size-12" onClick={toggle} disabled={!canPlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button className="grid size-9 place-items-center rounded-lg text-pearl/70 transition hover:bg-white/10 hover:text-pearl sm:size-10" onClick={next} aria-label="Next song">
            <SkipForward size={18} />
          </button>
          <button className={`grid size-9 place-items-center rounded-lg transition sm:size-10 ${repeatMode !== "off" ? "bg-gold/20 text-gold" : "text-pearl/55 hover:bg-white/10 hover:text-pearl"}`} onClick={cycleRepeat} aria-label={`Repeat ${repeatMode}`}>
            {repeatMode === "one" ? <Repeat1 size={17} /> : <Repeat size={17} />}
          </button>
        </div>

        <div className="grid grid-cols-[38px_1fr_38px] items-center gap-2 text-xs text-pearl/55">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(progress, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            className="accent-electric"
            aria-label="Playback progress"
          />
          <span>{formatTime(duration)}</span>
          <Volume2 className="hidden text-pearl/50 md:block" size={16} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className="col-span-2 hidden accent-gold md:block"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
