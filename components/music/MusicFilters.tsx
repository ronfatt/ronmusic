"use client";

import { useMemo, useState } from "react";
import type { Song } from "@/lib/types";
import { SongCard } from "./SongCard";
import { EmptyState } from "@/components/ui/EmptyState";

const languages = ["All", "Chinese", "English", "Malay", "Instrumental"];
const genres = ["All", "Worship", "Rock", "Cinematic", "World Music", "Pop Ballad", "AI-assisted", "Instrumental"];

export function MusicFilters({ songs }: { songs: Song[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [genre, setGenre] = useState("All");
  const hasSongs = songs.length > 0;

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return songs.filter((song) => {
      const matchesQuery = song.title.toLowerCase().includes(needle);
      const matchesLanguage = language === "All" || song.language === language;
      const matchesGenre = genre === "All" || song.genre === genre;
      return matchesQuery && matchesLanguage && matchesGenre;
    });
  }, [genre, language, query, songs]);

  return (
    <div className="space-y-8">
      <div className="glass rounded-lg p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-pearl/50">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search songs by title"
              className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-pearl outline-none transition placeholder:text-pearl/35 focus:border-electric"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-pearl/50">Language</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-pearl outline-none focus:border-electric">
              {languages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-pearl/50">Genre</span>
            <select value={genre} onChange={(event) => setGenre(event.target.value)} className="h-12 w-full rounded-lg border border-white/10 bg-ink/70 px-4 text-sm text-pearl outline-none focus:border-electric">
              {genres.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((song) => <SongCard key={song.id} song={song} />)}
        </div>
      ) : !hasSongs ? (
        <EmptyState
          title="First releases coming soon"
          message="R.ON Music is ready for the official catalog. Once the first published song is uploaded, it will appear here with lyrics, story, cover art, and playback."
        />
      ) : (
        <EmptyState title="No songs found" message="Try another title, language, or genre filter." />
      )}
    </div>
  );
}
