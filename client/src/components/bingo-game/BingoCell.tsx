import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BingoCellProps = {
  value: number | "FREE";
  marked: boolean;
  onToggle: () => void;
};

export function BingoCell({ value, marked, onToggle }: BingoCellProps) {
  const isFree = value === "FREE";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onToggle}
      disabled={isFree}
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-[10px] text-[13px] font-semibold transition-colors duration-150",
        isFree && "cursor-default bg-bb-gold text-bb-text",
        !isFree && !marked && "border border-bb-border bg-bb-elevated text-bb-text hover:border-bb-primary/30 hover:bg-bb-surface",
        !isFree && marked && "border border-bb-primary bg-bb-primary text-white",
      )}
    >
      {value}
    </motion.button>
  );
}