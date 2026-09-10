import { useState } from "react";
import { X, Play, Check, CheckSquare, Square, Settings2 } from "lucide-react";
import type { PatternGrid } from "@/types/bingo";
import { WINNING_PATTERNS } from "@/data/winningPatterns";
import { cn } from "@/lib/utils";

interface StartGamePatternModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStart: (selectedPatterns: string[]) => void;
}

function PatternMiniGrid({ dots, activePattern }: { dots: PatternGrid; activePattern: boolean }) {
  return (
    <div className="grid grid-cols-5 gap-[2px]">
      {dots.map((row, r) =>
        row.map((active, c) => (
          <span
            key={`${r}-${c}`}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors",
              active
                ? activePattern
                  ? "bg-bb-primary"
                  : "bg-bb-muted/40"
                : "bg-bb-border"
            )}
          />
        )),
      )}
    </div>
  );
}

export function StartGamePatternModal({
  isOpen,
  onClose,
  onConfirmStart,
}: StartGamePatternModalProps) {
  const allIds = WINNING_PATTERNS.map((p) => p.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(allIds);
  const [activeTab, setActiveTab] = useState<"All" | "Standard" | "Custom Shape">("All");

  if (!isOpen) return null;

  const togglePattern = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => setSelectedIds(allIds);
  const handleClearAll = () => setSelectedIds([]);

  const handleStart = () => {
    onConfirmStart(selectedIds.length > 0 ? selectedIds : allIds);
    onClose();
  };

  const filteredPatterns = WINNING_PATTERNS.filter(
    (p) => activeTab === "All" || p.category === activeTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-bb-border bg-bb-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-bb-border p-5 bg-bb-elevated">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bb-primary/10 text-bb-primary">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-bb-text">Select Winning Patterns</h3>
              <p className="text-xs text-bb-muted">Choose active winning rules before starting game</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-bb-muted hover:bg-bb-surface hover:text-bb-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar & Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bb-border px-5 py-3 bg-bb-surface">
          <div className="flex items-center gap-1.5">
            {(["All", "Standard", "Custom Shape"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeTab === cat
                    ? "bg-bb-primary text-white"
                    : "bg-bb-elevated text-bb-muted hover:text-bb-text"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1 rounded-lg border border-bb-border bg-bb-elevated px-2.5 py-1 text-xs font-medium text-bb-text hover:bg-bb-surface"
            >
              <CheckSquare className="h-3.5 w-3.5 text-bb-primary" />
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1 rounded-lg border border-bb-border bg-bb-elevated px-2.5 py-1 text-xs font-medium text-bb-muted hover:text-bb-text"
            >
              <Square className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Patterns Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredPatterns.map((pattern) => {
            const isSelected = selectedIds.includes(pattern.id);
            return (
              <button
                key={pattern.id}
                type="button"
                onClick={() => togglePattern(pattern.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 text-left transition-all",
                  isSelected
                    ? "border-bb-primary/50 bg-bb-primary/5 shadow-sm hover:border-bb-primary"
                    : "border-bb-border bg-bb-elevated/40 opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <PatternMiniGrid dots={pattern.dots} activePattern={isSelected} />
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold transition-colors",
                      isSelected
                        ? "bg-bb-primary text-white"
                        : "bg-bb-border text-bb-muted"
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : ""}
                  </span>
                </div>
                <span className="text-center text-xs font-bold text-bb-text">
                  {pattern.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between border-t border-bb-border p-4 bg-bb-elevated">
          <span className="text-xs font-semibold text-bb-muted">
            {selectedIds.length} patterns selected
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bb-border px-4 py-2 text-xs font-semibold text-bb-muted hover:bg-bb-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-full bg-bb-primary px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:bg-bb-primary-hover hover:scale-105"
            >
              <Play className="h-4 w-4 fill-white" />
              Start Game & Call Song
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
