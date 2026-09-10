import type { PatternGrid } from "@/types/bingo";

export interface PatternItem {
  id: string;
  label: string;
  category: "Standard" | "Custom Shape";
  dots: PatternGrid;
}

export const WINNING_PATTERNS: PatternItem[] = [
  // Standard Patterns
  { id: "single-line", label: "Single Line", category: "Standard", dots: patternRow(0) },
  { id: "vertical-line", label: "Vertical Line", category: "Standard", dots: patternCol(0) },
  { id: "diagonal", label: "Diagonal", category: "Standard", dots: patternDiagonal() },
  { id: "four-corners", label: "Four Corners", category: "Standard", dots: patternFourCorners() },
  { id: "x-pattern", label: "X Pattern", category: "Standard", dots: patternX() },
  { id: "plus-cross", label: "Plus / Cross", category: "Standard", dots: patternPlus() },
  { id: "full-house", label: "Full House", category: "Standard", dots: patternFullHouse() },

  // Custom Shapes
  { id: "pattern-t", label: "T Shape", category: "Custom Shape", dots: patternT() },
  { id: "pattern-l", label: "L Shape", category: "Custom Shape", dots: patternL() },
  { id: "pattern-u", label: "U Shape", category: "Custom Shape", dots: patternU() },
  { id: "pattern-h", label: "H Shape", category: "Custom Shape", dots: patternH() },
  { id: "pattern-z", label: "Z Shape", category: "Custom Shape", dots: patternZ() },
  { id: "pattern-box", label: "Box / Square", category: "Custom Shape", dots: patternBox() },
  { id: "pattern-diamond", label: "Diamond", category: "Custom Shape", dots: patternDiamond() },
];

function emptyGrid(): PatternGrid {
  return Array.from({ length: 5 }, () => Array(5).fill(false));
}

function patternRow(row: number): PatternGrid {
  const grid = emptyGrid();
  for (let c = 0; c < 5; c++) grid[row][c] = true;
  return grid;
}

function patternCol(col: number): PatternGrid {
  const grid = emptyGrid();
  for (let r = 0; r < 5; r++) grid[r][col] = true;
  return grid;
}

function patternDiagonal(): PatternGrid {
  const grid = emptyGrid();
  for (let i = 0; i < 5; i++) grid[i][i] = true;
  return grid;
}

function patternFourCorners(): PatternGrid {
  const grid = emptyGrid();
  grid[0][0] = true;
  grid[0][4] = true;
  grid[4][0] = true;
  grid[4][4] = true;
  return grid;
}

function patternX(): PatternGrid {
  const grid = emptyGrid();
  for (let i = 0; i < 5; i++) {
    grid[i][i] = true;
    grid[i][4 - i] = true;
  }
  return grid;
}

function patternPlus(): PatternGrid {
  const grid = emptyGrid();
  for (let i = 0; i < 5; i++) {
    grid[2][i] = true;
    grid[i][2] = true;
  }
  return grid;
}

function patternFullHouse(): PatternGrid {
  return Array.from({ length: 5 }, () => Array(5).fill(true));
}

function patternT(): PatternGrid {
  const grid = emptyGrid();
  for (let c = 0; c < 5; c++) grid[0][c] = true;
  for (let r = 0; r < 5; r++) grid[r][2] = true;
  return grid;
}

function patternL(): PatternGrid {
  const grid = emptyGrid();
  for (let r = 0; r < 5; r++) grid[r][0] = true;
  for (let c = 0; c < 5; c++) grid[4][c] = true;
  return grid;
}

function patternU(): PatternGrid {
  const grid = emptyGrid();
  for (let r = 0; r < 5; r++) {
    grid[r][0] = true;
    grid[r][4] = true;
  }
  for (let c = 0; c < 5; c++) grid[4][c] = true;
  return grid;
}

function patternH(): PatternGrid {
  const grid = emptyGrid();
  for (let r = 0; r < 5; r++) {
    grid[r][0] = true;
    grid[r][4] = true;
  }
  for (let c = 0; c < 5; c++) grid[2][c] = true;
  return grid;
}

function patternZ(): PatternGrid {
  const grid = emptyGrid();
  for (let c = 0; c < 5; c++) {
    grid[0][c] = true;
    grid[4][c] = true;
  }
  for (let i = 0; i < 5; i++) {
    grid[i][4 - i] = true;
  }
  return grid;
}

function patternBox(): PatternGrid {
  const grid = emptyGrid();
  for (let i = 0; i < 5; i++) {
    grid[0][i] = true;
    grid[4][i] = true;
    grid[i][0] = true;
    grid[i][4] = true;
  }
  return grid;
}

function patternDiamond(): PatternGrid {
  const grid = emptyGrid();
  grid[0][2] = true;
  grid[2][0] = true;
  grid[2][4] = true;
  grid[4][2] = true;
  return grid;
}
