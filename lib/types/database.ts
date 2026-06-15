export type SongStatus = "draft" | "published";

export type Song = {
  id: string;
  title: string;
  slug: string;
  artist: string;
  language: string | null;
  genre: string | null;
  description: string | null;
  lyrics: string | null;
  story: string | null;
  cover_url: string | null;
  audio_url: string | null;
  youtube_url: string | null;
  release_date: string | null;
  status: SongStatus;
  play_count: number;
  created_at: string;
  updated_at: string;
};

export type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  release_date: string | null;
  created_at: string;
  updated_at: string;
};

export type SongAlbum = {
  id: string;
  song_id: string;
  album_id: string;
  track_number: number | null;
};

export type AlbumWithSongs = Album & {
  songs: Array<Song & { track_number: number | null }>;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  inquiry_type: string | null;
  message: string;
  source: string | null;
  created_at: string;
};
