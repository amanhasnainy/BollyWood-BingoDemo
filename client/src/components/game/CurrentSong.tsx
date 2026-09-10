import { useState } from "react";
import { motion } from "framer-motion";
import { Play, SkipForward } from "lucide-react";
import { useBingoGame } from "@/hooks/useBingoGame";
import { useBingoStore } from "@/stores/bingoStore";
import { StartGamePatternModal } from "./StartGamePatternModal";

export function CurrentSong() {
  const { gameState, isPlaying, isWaiting, isFinished, callNextSong } =
    useBingoGame();

  const [isPatternModalOpen, setIsPatternModalOpen] = useState(false);

  const { currentSong } = gameState;
  const canCallNext = !isFinished && gameState.remainingSongs.length > 0;

  const handleStartClick = () => {
    if (isWaiting) {
      setIsPatternModalOpen(true);
    } else {
      callNextSong();
    }
  };

  const handleConfirmStart = (selectedPatterns: string[]) => {
    useBingoStore.getState().startGame(undefined, selectedPatterns);
  };

  return (
    <>
      <div className="border-b border-bb-border bg-bb-surface p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bb-primary opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-bb-primary" />
              </span>
            )}
            <p className="text-[11px] font-bold uppercase tracking-wider text-bb-primary">
              Now Playing
            </p>
          </div>
          {isWaiting && (
            <button
              type="button"
              onClick={handleStartClick}
              className="inline-flex items-center gap-1 rounded-full bg-bb-primary px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-bb-primary-hover hover:shadow-md"
            >
              <Play className="h-3 w-3 fill-white" />
              Start
            </button>
          )}
        </div>

        {currentSong ? (
          <div className="mt-2.5 flex items-center gap-3">
            <motion.div
              animate={{ boxShadow: ["0 0 0 0 rgba(200,29,74,0.3)", "0 0 0 8px rgba(200,29,74,0)", "0 0 0 0 rgba(200,29,74,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bb-primary text-lg font-bold text-white shadow-md"
            >
              {currentSong.id}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-bb-text">{currentSong.title}</p>
              {currentSong.artist && (
                <p className="truncate text-xs text-bb-muted">{currentSong.artist}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2.5 text-xs leading-relaxed text-bb-muted">
            {isWaiting
              ? "Hit Start, then call songs and mark your ticket."
              : isFinished
                ? "All 75 songs have been called."
                : "Ready for the next song…"}
          </p>
        )}

        <button
          type="button"
          onClick={handleStartClick}
          disabled={!isWaiting && !canCallNext}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-bb-primary py-2.5 text-xs font-bold text-white shadow-[0_2px_12px_rgba(200,29,74,0.35)] transition-all hover:bg-bb-primary-hover hover:shadow-[0_4px_16px_rgba(200,29,74,0.4)] disabled:bg-[#F3C4D0] disabled:text-bb-primary/60 disabled:shadow-none"
        >
          {isWaiting ? (
            <>
              <Play className="h-4 w-4 fill-white" />
              Start Game
            </>
          ) : (
            <>
              <SkipForward className="h-4 w-4" />
              Next Song
            </>
          )}
        </button>
      </div>

      <StartGamePatternModal
        isOpen={isPatternModalOpen}
        onClose={() => setIsPatternModalOpen(false)}
        onConfirmStart={handleConfirmStart}
      />
    </>
  );
}
