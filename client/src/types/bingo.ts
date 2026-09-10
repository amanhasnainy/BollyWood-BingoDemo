export interface Song {
  id: number; // 1-75
  title: string;
  artist?: string;
  category: string;
}

export interface BingoCell {
  id: number;
  title: string;
  marked: boolean;
  isFree?: boolean;
}

export interface PlayerCard {
  cells: BingoCell[];
}

export type GameStatus = "waiting" | "playing" | "finished";

export interface GameState {
  category: string;
  calledSongs: number[];
  remainingSongs: number[];
  currentSong: Song | null;
  status: GameStatus;
  enabledPatterns?: string[];
}

export type WinPattern =
  | "horizontal"
  | "vertical"
  | "diagonal"
  | "full-house"
  | "early-five"
  | "top-line"
  | "middle-line"
  | "bottom-line"
  | "four-corners"
  | "single-line"
  | "vertical-line"
  | "x-pattern"
  | "plus-cross"
  | "pattern-t"
  | "pattern-l"
  | "pattern-u"
  | "pattern-h"
  | "pattern-z"
  | "pattern-box"
  | "pattern-diamond";

export interface WinResult {
  pattern: WinPattern;
  label?: string;
  /** Row index for horizontal, column index for vertical */
  lineIndex?: number;
  /** Which diagonal for diagonal wins */
  diagonal?: "main" | "anti";
}

export const GRID_SIZE = 5;
export const CENTER_INDEX = 12;
export const TOTAL_CELLS = 25;

export type PatternGrid = boolean[][];
