import type { Artist } from './artist';

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  audio_url: string;
  image_url: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface SongWithArtist extends Song {
  artist: Artist;
}
