import type { BingoCell, PlayerCard, Song } from "@/types/bingo";
import { CENTER_INDEX, TOTAL_CELLS } from "@/types/bingo";

const FREE_CELL: BingoCell = {
  id: 0,
  title: "FREE",
  marked: true,
  isFree: true,
};

function shuffle<T>(array: T[], random: () => number): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generates a random 5×5 bingo card with 24 unique songs and a FREE center cell.
 * Each call produces a different layout when using the default random source.
 */
export function generateBingoCard(
  songs: Song[],
  random: () => number = Math.random,
): PlayerCard {
  if (songs.length < 24) {
    throw new Error("At least 24 songs are required to generate a bingo card");
  }

  const picked = shuffle(songs, random).slice(0, 24);
  const positions = shuffle(
    Array.from({ length: TOTAL_CELLS }, (_, i) => i).filter((i) => i !== CENTER_INDEX),
    random,
  );

  const cells: BingoCell[] = Array.from({ length: TOTAL_CELLS }, () => ({
    id: 0,
    title: "",
    marked: false,
  }));

  cells[CENTER_INDEX] = { ...FREE_CELL };

  picked.forEach((song, index) => {
    const cellIndex = positions[index];
    cells[cellIndex] = {
      id: song.id,
      title: song.title,
      marked: false,
    };
  });

  return { cells };
}

/**
 * Returns the row and column for a flat cell index.
 */
export function cellIndexToPosition(index: number): { row: number; col: number } {
  return { row: Math.floor(index / 5), col: index % 5 };
}

/**
 * Returns the flat cell index for a row and column.
 */
export function positionToCellIndex(row: number, col: number): number {
  return row * 5 + col;
}
