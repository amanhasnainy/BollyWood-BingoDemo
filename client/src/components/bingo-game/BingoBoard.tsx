import { useCallback, useState } from "react";
import { Maximize2 } from "lucide-react";
import { BINGO_GRID, INITIAL_MARKED } from "./bingoGameData";
import { BingoCell } from "./BingoCell";
import { PatternTracker } from "./PatternTracker";

const COLUMNS = ["B", "I", "N", "G", "O"] as const;

export function BingoBoard() {
  const [marked, setMarked] = useState<Set<string>>(() => new Set(INITIAL_MARKED));

  const toggleCell = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    if (BINGO_GRID[row][col] === "FREE") return;
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-bb-text">Your Bingo Ticket</h2>
          <p className="mt-0.5 text-xs text-bb-muted">
            Mark the called songs before everyone else.
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg p-1.5 text-bb-muted transition-colors hover:bg-bb-surface hover:text-bb-muted"
          aria-label="Expand ticket"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1.5 grid grid-cols-5 gap-1.5">
        {COLUMNS.map((letter) => (
          <div
            key={letter}
            className="flex aspect-square w-full items-center justify-center text-sm font-bold text-bb-primary"
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {BINGO_GRID.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            return (
              <BingoCell
                key={key}
                value={value}
                marked={marked.has(key)}
                onToggle={() => toggleCell(rowIndex, colIndex)}
              />
            );
          }),
        )}
      </div>

      <PatternTracker markedCount={marked.size} totalCount={25} />
    </div>
  );
}