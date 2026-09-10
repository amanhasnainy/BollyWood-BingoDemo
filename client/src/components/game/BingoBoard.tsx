import { useState } from "react";
import { RefreshCw, Ticket, Star, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useBingoStore } from "@/stores/bingoStore";
import { BingoCell } from "./BingoCell";
import { cn } from "@/lib/utils";

const COLUMNS = ["B", "I", "N", "G", "O"] as const;

export function BingoBoard() {
  const gameState = useBingoStore((s) => s.gameState);
  const playerCards = useBingoStore((s) => s.playerCards);
  const activeTicketIndex = useBingoStore((s) => s.activeTicketIndex);
  const stars = useBingoStore((s) => s.stars);
  const winningCellIndices = useBingoStore((s) => s.winningCellIndices);
  const toggleCell = useBingoStore((s) => s.toggleCell);
  const regenerateCard = useBingoStore((s) => s.regenerateCard);
  const buyTicket = useBingoStore((s) => s.buyTicket);
  const setActiveTicketIndex = useBingoStore((s) => s.setActiveTicketIndex);
  const checkClaimWinner = useBingoStore((s) => s.checkClaimWinner);

  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  const isWaiting = gameState.status === "waiting";
  const playerCard = playerCards[activeTicketIndex] ?? playerCards[0];
  const winningSet = new Set(winningCellIndices);
  const calledSet = new Set(gameState.calledSongs);
  const currentId = gameState.currentSong?.id;

  const handleClaimCheck = () => {
    const result = checkClaimWinner();
    if (result) {
      setVerifyNotice(`🎉 BINGO WINVERIFIED! Pattern: ${result.label || result.pattern}`);
    } else {
      setVerifyNotice("No winning pattern matched yet on this ticket. Keep marking numbers!");
      setTimeout(() => setVerifyNotice(null), 4000);
    }
  };

  return (
    <div>
      {/* Ticket Header & Star Shop Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-bb-primary/10 text-bb-primary">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-bb-text">Bingo Tickets ({playerCards.length}/3)</h2>
            <p className="text-[11px] text-bb-muted">Tap numbers when called or buy up to 3 tickets</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-bb-gold/30 bg-bb-gold/10 px-2.5 py-1 text-xs font-bold text-bb-gold">
            <Star className="h-3.5 w-3.5 fill-bb-gold" />
            <span>{stars} ⭐</span>
          </div>

          {isWaiting && (
            <button
              type="button"
              onClick={regenerateCard}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-bb-border bg-bb-elevated px-2 py-1 text-[10px] font-semibold text-bb-muted shadow-sm transition-all hover:border-bb-primary/30 hover:text-bb-primary"
              title="Generate new card"
            >
              <RefreshCw className="h-3 w-3" />
              New Card
            </button>
          )}
        </div>
      </div>

      {/* Ticket Switcher Tabs */}
      <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1">
        {[0, 1, 2].map((idx) => {
          const exists = idx < playerCards.length;
          const isActive = idx === activeTicketIndex;

          if (exists) {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTicketIndex(idx)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
                  isActive
                    ? "border-bb-primary bg-bb-primary text-white shadow-md"
                    : "border-bb-border bg-bb-surface text-bb-muted hover:text-bb-text"
                )}
              >
                <Ticket className="h-3.5 w-3.5" />
                Ticket #{idx + 1}
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const bought = buyTicket();
                if (!bought && stars < 50) {
                  setVerifyNotice("Not enough stars! Each extra ticket costs 50 ⭐");
                  setTimeout(() => setVerifyNotice(null), 3000);
                }
              }}
              disabled={stars < 50}
              className={cn(
                "flex items-center gap-1 rounded-xl border border-dashed border-bb-border bg-bb-elevated/40 px-3 py-1.5 text-xs font-semibold transition-all",
                stars >= 50
                  ? "text-bb-primary hover:border-bb-primary hover:bg-bb-primary/10"
                  : "opacity-50 cursor-not-allowed text-bb-muted"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              Ticket #{idx + 1} (50 ⭐)
            </button>
          );
        })}
      </div>

      {/* Notice Banner */}
      {verifyNotice && (
        <div
          className={cn(
            "mb-2.5 flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold shadow-sm transition-all",
            verifyNotice.includes("🎉")
              ? "bg-bb-success/20 text-bb-success border border-bb-success/30"
              : "bg-bb-surface text-bb-text border border-bb-border"
          )}
        >
          {verifyNotice.includes("🎉") ? (
            <CheckCircle className="h-4 w-4 shrink-0 text-bb-success" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          <span>{verifyNotice}</span>
        </div>
      )}

      {/* 5x5 Grid */}
      <div className="rounded-xl bg-bb-surface p-2 shadow-inner border border-bb-border">
        <div className="mb-1.5 grid grid-cols-5 gap-1.5">
          {COLUMNS.map((letter) => (
            <div
              key={letter}
              className="flex h-6 items-center justify-center rounded-md bg-bb-primary text-xs font-extrabold text-white shadow-sm"
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {playerCard.cells.map((cell, index) => (
            <BingoCell
              key={`${index}-${cell.id}`}
              cell={cell}
              isWinning={winningSet.has(index)}
              isCalled={!cell.isFree && calledSet.has(cell.id)}
              isCurrent={!cell.isFree && cell.id === currentId}
              onToggle={() => toggleCell(index)}
            />
          ))}
        </div>
      </div>

      {/* Claim / Verify Win Button */}
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={handleClaimCheck}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8A93B] to-[#C81D4A] px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <CheckCircle className="h-4 w-4" />
          Check & Claim Bingo Win
        </button>
      </div>
    </div>
  );
}
