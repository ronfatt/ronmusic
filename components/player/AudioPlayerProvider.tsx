"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "@/lib/types";

type PlayerContextValue = {
  playlist: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: "off" | "one" | "all";
  progress: number;
  duration: number;
  volume: number;
  playSong: (song: Song) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
};

export const AudioPlayerContext = createContext<PlayerContextValue | null>(null);

export function AudioPlayerProvider({ children, initialSongs }: { children: ReactNode; initialSongs: Song[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState(initialSongs);
  const [currentSong, setCurrentSong] = useState<Song | null>(initialSongs[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volumeState, setVolumeState] = useState(0.82);

  const incrementPlayCount = useCallback((songId: string) => {
    fetch(`/api/songs/${songId}/play`, { method: "POST" }).catch(() => undefined);
  }, []);

  const playSong = useCallback((song: Song) => {
    if (!song.audio_url) return;
    setCurrentSong(song);
    setIsPlaying(true);
    if (!playlist.some((item) => item.id === song.id)) {
      setPlaylist((current) => [song, ...current]);
    }
    incrementPlayCount(song.id);
  }, [incrementPlayCount, playlist]);

  const currentIndex = currentSong ? playlist.findIndex((song) => song.id === currentSong.id) : -1;

  const next = useCallback(() => {
    if (!playlist.length) return;
    const nextSong = isShuffle
      ? playlist[Math.floor(Math.random() * playlist.length)]
      : playlist[(currentIndex + 1 + playlist.length) % playlist.length];
    playSong(nextSong);
  }, [currentIndex, isShuffle, playlist, playSong]);

  const previous = useCallback(() => {
    if (!playlist.length) return;
    const previousSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    playSong(previousSong);
  }, [currentIndex, playlist, playSong]);

  const toggle = useCallback(() => {
    if (!currentSong?.audio_url) return;
    setIsPlaying((value) => !value);
  }, [currentSong]);

  const seek = useCallback((value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setProgress(value);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((value) => !value);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((value) => (value === "off" ? "all" : value === "all" ? "one" : "off"));
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ song: Song }>).detail;
      if (detail?.song) playSong(detail.song);
    };

    window.addEventListener("ron-play-song", handler);
    return () => window.removeEventListener("ron-play-song", handler);
  }, [playSong]);

  useEffect(() => {
    if (!audioRef.current || !currentSong?.audio_url) {
      setIsPlaying(false);
      return;
    }
    audioRef.current.src = currentSong.audio_url;
    audioRef.current.volume = volumeState;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentSong, isPlaying, volumeState]);

  const value = useMemo(
    () => ({
      playlist,
      currentSong,
      isPlaying,
      isShuffle,
      repeatMode,
      progress,
      duration,
      volume: volumeState,
      playSong,
      toggle,
      next,
      previous,
      seek,
      setVolume,
      toggleShuffle,
      cycleRepeat
    }),
    [currentSong, cycleRepeat, duration, isPlaying, isShuffle, next, playSong, playlist, previous, progress, repeatMode, seek, setVolume, toggle, toggleShuffle, volumeState]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => {
          if (!audioRef.current) return;
          if (repeatMode === "one") {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => setIsPlaying(false));
            return;
          }
          if (repeatMode === "all") next();
          else setIsPlaying(false);
        }}
      />
    </AudioPlayerContext.Provider>
  );
}
