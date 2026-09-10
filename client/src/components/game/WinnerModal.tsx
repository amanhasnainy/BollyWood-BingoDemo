import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBingoGame } from "@/hooks/useBingoGame";
import { formatWinPattern } from "@/utils/bingoEngine";

export function WinnerModal() {
  const { winner, dismissWinner, resetGame } = useBingoGame();

  if (!winner) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && dismissWinner()}>
      <DialogContent className="max-w-sm rounded-2xl border-bb-border text-center">
        <DialogHeader className="items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-5xl"
          >
            🎉
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-bb-primary">BINGO!</DialogTitle>
          <DialogDescription className="text-base text-bb-muted">
            You completed a winning pattern:{" "}
            <span className="font-semibold text-bb-text">{formatWinPattern(winner)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              dismissWinner();
              resetGame();
            }}
            className="w-full rounded-xl bg-bb-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bb-primary-hover"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={dismissWinner}
            className="w-full rounded-xl border border-bb-border py-2.5 text-sm font-medium text-bb-muted transition-colors hover:bg-bb-surface"
          >
            Keep Playing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
