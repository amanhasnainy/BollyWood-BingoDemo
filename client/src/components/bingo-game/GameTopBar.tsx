import { useState } from "react";
import { ArrowLeft, Music2, MessageSquareHeart } from "lucide-react";
import { useBingoGame } from "@/hooks/useBingoGame";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";

type GameTopBarProps = {
  onLeaveRoom: () => void;
};

export function GameTopBar({ onLeaveRoom }: GameTopBarProps) {
  const { gameState } = useBingoGame();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const currentSong = gameState.currentSong;
  const songTitle = currentSong?.title ?? "No Song Called";
  const songNumber = currentSong?.id ?? "--";

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onLeaveRoom}
          className="inline-flex items-center gap-2 rounded-xl border border-bb-border bg-bb-elevated px-4 py-2.5 text-sm font-medium text-bb-text transition-colors hover:bg-bb-surface"
        >
          <ArrowLeft className="h-4 w-4 text-bb-muted" />
          Leave Room
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-bb-primary/30 bg-bb-primary/10 px-3 py-1.5 text-xs font-semibold text-bb-primary transition-all hover:bg-bb-primary hover:text-white"
          >
            <MessageSquareHeart className="h-4 w-4" />
            Feedback
          </button>

          <div className="flex items-center gap-2 rounded-full border border-bb-border bg-bb-elevated px-4 py-2 text-sm font-medium text-bb-text shadow-sm">
            <Music2 className="h-4 w-4 text-bb-primary" />
            <span>{songTitle}</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-bb-primary bg-bb-elevated text-base font-bold text-bb-primary shadow-sm">
            {songNumber}
          </div>
        </div>
      </header>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}