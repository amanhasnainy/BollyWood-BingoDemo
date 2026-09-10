import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarWalletPillProps = {
  stars?: number;
  onClick?: () => void;
  className?: string;
};

export function StarWalletPill({ stars = 30, onClick, className = "" }: StarWalletPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="navbar-star-wallet"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E8A93B]/50 bg-[#1B1330] px-4 text-xs font-semibold text-[#E8A93B] shadow-sm transition-colors hover:bg-white/5",
        className,
      )}
    >
      <Star className="h-3.5 w-3.5 fill-[#E8A93B] text-[#E8A93B]" />
      <span>{stars} Stars</span>
    </button>
  );
}
