import type { Song } from "@/types/bingo";

export const SONGS: Song[] = Array.from({ length: 75 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    title: `Song #${id}`,
    artist: "Playing Track",
    category: "Bollywood",
  };
});

export const SONGS_BY_ID = new Map(SONGS.map((song) => [song.id, song]));

export function getSongById(id: number): Song | undefined {
  return (
    SONGS_BY_ID.get(id) ?? {
      id,
      title: `Song #${id}`,
      artist: "Playing Track",
      category: "Bollywood",
    }
  );
}

export function getSongsByCategory(category: string): Song[] {
  return SONGS;
}
