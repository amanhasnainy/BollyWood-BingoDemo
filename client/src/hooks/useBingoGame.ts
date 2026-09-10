import { useMemo } from "react";
import { useBingoStore } from "@/stores/bingoStore";
import { getMarkedCount, getProgressPercent } from "@/utils/bingoEngine";

/**
 * Hook that exposes bingo game state and actions.
 * Thin wrapper over the Zustand store — ready to swap for Socket.IO sync later.
 */
export function useBingoGame() {
  const gameState = useBingoStore((s) => s.gameState);
  const playerCard = useBingoStore((s) => s.playerCard);
  const winner = useBingoStore((s) => s.winner);
  const winningCellIndices = useBingoStore((s) => s.winningCellIndices);

  const initGame = useBingoStore((s) => s.initGame);
  const fetchRoom = useBingoStore((s) => s.fetchRoom);
  const startGame = useBingoStore((s) => s.startGame);
  const callNextSong = useBingoStore((s) => s.callNextSong);
  const toggleCell = useBingoStore((s) => s.toggleCell);
  const regenerateCard = useBingoStore((s) => s.regenerateCard);
  const dismissWinner = useBingoStore((s) => s.dismissWinner);
  const resetGame = useBingoStore((s) => s.resetGame);

  const markedCount = useMemo(() => getMarkedCount(playerCard), [playerCard]);
  const progressPercent = useMemo(() => getProgressPercent(playerCard), [playerCard]);

  return {
    gameState,
    playerCard,
    winner,
    winningCellIndices,
    markedCount,
    progressPercent,
    songsCalled: gameState.calledSongs.length,
    songsRemaining: gameState.remainingSongs.length,
    isPlaying: gameState.status === "playing",
    isWaiting: gameState.status === "waiting",
    isFinished: gameState.status === "finished",
    initGame,
    fetchRoom,
    startGame,
    callNextSong,
    toggleCell,
    regenerateCard,
    dismissWinner,
    resetGame,
  };
}
