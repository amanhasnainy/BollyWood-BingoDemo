import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BingoCell as BingoCellType } from "@/types/bingo";

type BingoCellProps = {
  cell: BingoCellType;
  isWinning?: boolean;
  isCalled?: boolean;
  isCurrent?: boolean;
  onToggle: () => void;
};

export function BingoCell({
  cell,
  isWinning,
  isCalled,
  isCurrent,
  onToggle,
}: BingoCellProps) {
  const isFree = cell.isFree;
  const canToggle = isFree ? false : (cell.marked || Boolean(isCalled));

  return (
    <motion.button
      type="button"
      whileHover={canToggle && !isFree && !cell.marked ? { scale: 1.06 } : undefined}
      whileTap={canToggle && !isFree ? { scale: 0.92 } : undefined}
      onClick={canToggle ? onToggle : undefined}
      disabled={!canToggle}
      title={
        isFree
          ? "FREE"
          : !isCalled && !cell.marked
            ? `Number ${cell.id} has not been called yet`
            : `${cell.id} — ${cell.title}`
      }
      className={cn(
        "relative flex h-9 w-full items-center justify-center rounded-xl text-[11px] font-bold transition-all duration-200",
        isFree && "cursor-default bg-bb-gold text-bb-bg shadow-sm",
        !isFree &&
          !cell.marked &&
          !isCalled &&
          "cursor-not-allowed border border-bb-border/50 bg-bb-elevated/40 text-bb-muted/50 shadow-none opacity-60",
        !isFree &&
          !cell.marked &&
          isCalled &&
          "cursor-pointer border-2 border-bb-primary bg-bb-primary/10 text-bb-primary shadow-[0_0_0_2px_rgba(200,29,74,0.15)] hover:border-bb-primary hover:shadow-md",
        !isFree && cell.marked && "cursor-pointer bg-bb-primary text-white shadow-md",
        isCurrent && !cell.marked && "animate-pulse",
        isWinning && "ring-2 ring-bb-success ring-offset-1",
      )}
    >
      {isFree ? (
        <span className="text-[9px] font-extrabold tracking-wide">FREE</span>
      ) : (
        cell.id
      )}
    </motion.button>
  );
}
