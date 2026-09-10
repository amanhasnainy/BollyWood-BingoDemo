import type { PatternGrid } from "./bingoGameData";
import { WINNING_PATTERNS } from "./bingoGameData";
import { cn } from "@/lib/utils";

function PatternMiniGrid({ dots }: { dots: PatternGrid }) {
  return (
    <div className="grid grid-cols-5 gap-[2px]">
      {dots.map((row, r) =>
        row.map((active, c) => (
          <span
            key={`${r}-${c}`}
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              active ? "bg-bb-primary" : "bg-bb-border",
            )}
          />
        )),
      )}
    </div>
  );
}

export function WinningPatternsCard() {
  return (
    <div className="border-t border-bb-border pt-5">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-bb-text">Winning Patterns</h3>
        <button type="button" className="text-xs font-medium text-bb-primary hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {WINNING_PATTERNS.map((pattern) => (
          <div
            key={pattern.id}
            className="flex flex-col items-center gap-2 rounded-xl border border-bb-border py-3"
          >
            <PatternMiniGrid dots={pattern.dots} />
            <span className="px-1 text-center text-[10px] font-medium leading-tight text-bb-muted">
              {pattern.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}