/**
 * Pure bingo game engine — UI-agnostic, reusable for single-player and multiplayer.
 */
export {
  callNextSong,
  checkDiagonal,
  checkFullHouse,
  checkHorizontal,
  checkVertical,
  checkWinner,
  createInitialGameState,
  formatWinPattern,
  getMarkedCount,
  getProgressPercent,
  getWinningCellIndices,
  isCenterCell,
  markSong,
  startGame,
  toggleCellMark,
} from "./bingoEngine";

export {
  cellIndexToPosition,
  generateBingoCard,
  positionToCellIndex,
} from "./generateBingoCard";
