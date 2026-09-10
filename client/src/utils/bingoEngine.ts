import { getSongById } from "@/data/songs";
import type {
  GameState,
  PlayerCard,
  Song,
  WinPattern,
  WinResult,
} from "@/types/bingo";
import { CENTER_INDEX, GRID_SIZE } from "@/types/bingo";
import { positionToCellIndex } from "@/utils/generateBingoCard";

export function createInitialGameState(category: string, songIds: number[]): GameState {
  return {
    category,
    calledSongs: [],
    remainingSongs: [...songIds],
    currentSong: null,
    status: "waiting",
  };
}

export function startGame(state: GameState): GameState {
  return {
    ...state,
    status: "playing",
    calledSongs: [],
    remainingSongs: [...state.remainingSongs],
    currentSong: null,
  };
}

export function callNextSong(state: GameState): { state: GameState; song: Song } | null {
  if (state.status !== "playing" || state.remainingSongs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * state.remainingSongs.length);
  const songId = state.remainingSongs[randomIndex];
  const song = getSongById(songId);

  if (!song) return null;

  const remainingSongs = state.remainingSongs.filter((id) => id !== songId);
  const calledSongs = [...state.calledSongs, songId];

  return {
    song,
    state: {
      ...state,
      currentSong: song,
      calledSongs,
      remainingSongs,
      status: remainingSongs.length === 0 ? "finished" : "playing",
    },
  };
}

export function markSong(card: PlayerCard, songId: number): PlayerCard {
  return {
    cells: card.cells.map((cell) =>
      cell.id === songId && !cell.isFree ? { ...cell, marked: true } : cell,
    ),
  };
}

export function toggleCellMark(
  card: PlayerCard,
  cellIndex: number,
  calledSongs?: number[],
): PlayerCard {
  const cell = card.cells[cellIndex];
  if (!cell || cell.isFree) return card;

  if (!cell.marked && calledSongs && !calledSongs.includes(cell.id)) {
    return card;
  }

  return {
    cells: card.cells.map((c, i) =>
      i === cellIndex ? { ...c, marked: !c.marked } : c,
    ),
  };
}

function isCellMarked(card: PlayerCard, index: number): boolean {
  return card.cells[index]?.marked ?? false;
}

export function checkHorizontal(card: PlayerCard, row: number): boolean {
  for (let col = 0; col < GRID_SIZE; col++) {
    if (!isCellMarked(card, positionToCellIndex(row, col))) return false;
  }
  return true;
}

export function checkVertical(card: PlayerCard, col: number): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    if (!isCellMarked(card, positionToCellIndex(row, col))) return false;
  }
  return true;
}

export function checkDiagonal(card: PlayerCard, diagonal: "main" | "anti"): boolean {
  if (diagonal === "main") {
    for (let i = 0; i < GRID_SIZE; i++) {
      if (!isCellMarked(card, positionToCellIndex(i, i))) return false;
    }
    return true;
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    if (!isCellMarked(card, positionToCellIndex(i, GRID_SIZE - 1 - i))) return false;
  }
  return true;
}

export function checkFullHouse(card: PlayerCard): boolean {
  return card.cells.every((cell) => cell.marked);
}

export function checkFourCorners(card: PlayerCard): boolean {
  const corners = [0, 4, 20, 24];
  return corners.every((idx) => isCellMarked(card, idx));
}

export function checkXPattern(card: PlayerCard): boolean {
  return checkDiagonal(card, "main") && checkDiagonal(card, "anti");
}

export function checkPlusCross(card: PlayerCard): boolean {
  return checkHorizontal(card, 2) && checkVertical(card, 2);
}

export function checkIndices(card: PlayerCard, indices: number[]): boolean {
  return indices.every((idx) => isCellMarked(card, idx));
}

export function checkEarlyFive(card: PlayerCard): boolean {
  return getMarkedCount(card) >= 5;
}

export const T_INDICES = [0, 1, 2, 3, 4, 7, 12, 17, 22];
export const L_INDICES = [0, 5, 10, 15, 20, 21, 22, 23, 24];
export const U_INDICES = [0, 5, 10, 15, 20, 21, 22, 23, 24, 4, 9, 14, 19];
export const H_INDICES = [0, 5, 10, 15, 20, 4, 9, 14, 19, 11, 12, 13];
export const Z_INDICES = [0, 1, 2, 3, 4, 8, 12, 16, 20, 21, 22, 23, 24];
export const BOX_INDICES = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
export const DIAMOND_INDICES = [2, 10, 14, 22];

export function checkWinner(
  card: PlayerCard,
  enabledPatterns?: string[],
): WinResult | null {
  const isEnabled = (id: string) =>
    !enabledPatterns || enabledPatterns.length === 0 || enabledPatterns.includes(id);

  // Check Custom Shape Patterns
  if (isEnabled("pattern-t") && checkIndices(card, T_INDICES)) {
    return { pattern: "pattern-t", label: "T Shape" };
  }
  if (isEnabled("pattern-l") && checkIndices(card, L_INDICES)) {
    return { pattern: "pattern-l", label: "L Shape" };
  }
  if (isEnabled("pattern-u") && checkIndices(card, U_INDICES)) {
    return { pattern: "pattern-u", label: "U Shape" };
  }
  if (isEnabled("pattern-h") && checkIndices(card, H_INDICES)) {
    return { pattern: "pattern-h", label: "H Shape" };
  }
  if (isEnabled("pattern-z") && checkIndices(card, Z_INDICES)) {
    return { pattern: "pattern-z", label: "Z Shape" };
  }
  if (isEnabled("pattern-box") && checkIndices(card, BOX_INDICES)) {
    return { pattern: "pattern-box", label: "Box / Square" };
  }
  if (isEnabled("pattern-diamond") && checkIndices(card, DIAMOND_INDICES)) {
    return { pattern: "pattern-diamond", label: "Diamond" };
  }

  // Check Special Combo Patterns
  if (isEnabled("x-pattern") && checkXPattern(card)) {
    return { pattern: "x-pattern", label: "X Pattern" };
  }
  if (isEnabled("plus-cross") && checkPlusCross(card)) {
    return { pattern: "plus-cross", label: "Plus / Cross" };
  }
  if (isEnabled("four-corners") && checkFourCorners(card)) {
    return { pattern: "four-corners", label: "Four Corners" };
  }

  // Check Standard Line Patterns
  if (isEnabled("single-line") || isEnabled("horizontal") || isEnabled("top-line") || isEnabled("middle-line") || isEnabled("bottom-line")) {
    for (let row = 0; row < GRID_SIZE; row++) {
      if (checkHorizontal(card, row)) {
        if (row === 0 && isEnabled("top-line")) return { pattern: "top-line", label: "Top Line", lineIndex: 0 };
        if (row === 2 && isEnabled("middle-line")) return { pattern: "middle-line", label: "Middle Line", lineIndex: 2 };
        if (row === 4 && isEnabled("bottom-line")) return { pattern: "bottom-line", label: "Bottom Line", lineIndex: 4 };
        if (isEnabled("single-line") || isEnabled("horizontal")) return { pattern: "single-line", label: `Row ${row + 1}`, lineIndex: row };
      }
    }
  }

  if (isEnabled("vertical-line") || isEnabled("vertical")) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (checkVertical(card, col)) {
        return { pattern: "vertical-line", label: `Column ${col + 1}`, lineIndex: col };
      }
    }
  }

  if (isEnabled("diagonal")) {
    if (checkDiagonal(card, "main")) return { pattern: "diagonal", diagonal: "main", label: "Main Diagonal" };
    if (checkDiagonal(card, "anti")) return { pattern: "diagonal", diagonal: "anti", label: "Anti Diagonal" };
  }

  if (isEnabled("early-five") && checkEarlyFive(card)) {
    return { pattern: "early-five", label: "Early Five" };
  }

  if (isEnabled("full-house") && checkFullHouse(card)) {
    return { pattern: "full-house", label: "Full House" };
  }

  return null;
}

export function getMarkedCount(card: PlayerCard): number {
  return card.cells.filter((cell) => cell.marked).length;
}

export function getProgressPercent(card: PlayerCard): number {
  return Math.round((getMarkedCount(card) / card.cells.length) * 100);
}

export function formatWinPattern(result: WinResult): string {
  if (result.label) return result.label;
  return result.pattern ?? "Bingo!";
}

/** Returns cell indices that form the winning line (for UI highlighting). */
export function getWinningCellIndices(result: WinResult): number[] {
  if (result.pattern === "pattern-t") return T_INDICES;
  if (result.pattern === "pattern-l") return L_INDICES;
  if (result.pattern === "pattern-u") return U_INDICES;
  if (result.pattern === "pattern-h") return H_INDICES;
  if (result.pattern === "pattern-z") return Z_INDICES;
  if (result.pattern === "pattern-box") return BOX_INDICES;
  if (result.pattern === "pattern-diamond") return DIAMOND_INDICES;

  if (result.pattern === "four-corners") return [0, 4, 20, 24];
  if (result.pattern === "x-pattern") return [0, 4, 6, 8, 12, 16, 18, 20, 24];
  if (result.pattern === "plus-cross") return [2, 7, 10, 11, 12, 13, 14, 17, 22];

  if (result.pattern === "top-line") return [0, 1, 2, 3, 4];
  if (result.pattern === "middle-line") return [10, 11, 12, 13, 14];
  if (result.pattern === "bottom-line") return [20, 21, 22, 23, 24];

  if ((result.pattern === "horizontal" || result.pattern === "single-line") && result.lineIndex !== undefined) {
    const indices: number[] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      indices.push(positionToCellIndex(result.lineIndex, col));
    }
    return indices;
  }

  if ((result.pattern === "vertical" || result.pattern === "vertical-line") && result.lineIndex !== undefined) {
    const indices: number[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      indices.push(positionToCellIndex(row, result.lineIndex));
    }
    return indices;
  }

  if (result.pattern === "diagonal") {
    const indices: number[] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      indices.push(
        result.diagonal === "main"
          ? positionToCellIndex(i, i)
          : positionToCellIndex(i, GRID_SIZE - 1 - i),
      );
    }
    return indices;
  }

  if (result.pattern === "full-house" || result.pattern === "early-five") {
    return Array.from({ length: 25 }, (_, i) => i);
  }

  return [];
}

export function isCenterCell(index: number): boolean {
  return index === CENTER_INDEX;
}
