import { useState } from "react";
import { ChevronDown, Check, Settings2, Lock } from "lucide-react";
import type { PatternGrid } from "@/types/bingo";
import { WINNING_PATTERNS } from "@/data/winningPatterns";
import { cn } from "@/lib/utils";
import { useBingoStore } from "@/stores/bingoStore";
import { useQuery } from "@tanstack/react-query";
import { getRoomByCode } from "@/global/roomsApi";
import { useAuth } from "@/global/authContext";

function getRoomCodeFromUrl(): string {
  try {
    const hash = window.location.hash || "";
    const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
    if ((parts[0] === "bingo-game" || parts[0] === "room") && parts[1]) {
      return parts[1];
    }
  } catch {
    // ignore
  }
  return "DIWALI77";
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

export function WinningPatternsCard() {
  const gameState = useBingoStore((s) => s.gameState);
  const toggleHostPattern = useBingoStore((s) => s.toggleHostPattern);
  const [activeCategoryTab, setActiveCategoryTab] = useState<"All" | "Standard" | "Custom Shape">("All");

  const { user } = useAuth();
  const roomCode = getRoomCodeFromUrl();

  const { data: room } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: () => getRoomByCode(roomCode),
    enabled: Boolean(roomCode),
  });

  const currentUserId = String(user?.id ?? localStorage.getItem("chat_user_id") ?? "");
  const isHost =
    Boolean(room?.hostId && room.hostId === currentUserId) ||
    Boolean(user?.handle && room?.hostName && user.handle === room.hostName) ||
    (!room?.hostId && (room?.hostName === "Host" || !room));

  const enabledPatterns = gameState.enabledPatterns ?? WINNING_PATTERNS.map((p) => p.id);

  const filteredPatterns = WINNING_PATTERNS.filter(
    (p) => activeCategoryTab === "All" || p.category === activeCategoryTab
  );

  const activeCount = WINNING_PATTERNS.filter((p) => enabledPatterns.includes(p.id)).length;

  return (
    <details className="group border-t border-bb-border" open>
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 marker:content-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-1.5">
          <Settings2 className="h-3.5 w-3.5 text-bb-primary" />
          <span className="text-xs font-semibold text-bb-text">Winning Patterns</span>
          <span className="rounded bg-bb-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-bb-primary">
            {activeCount}/{WINNING_PATTERNS.length} Active
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {!isHost && (
            <span className="flex items-center gap-1 rounded bg-bb-elevated px-1.5 py-0.5 text-[9px] font-semibold text-bb-muted">
              <Lock className="h-2.5 w-2.5" /> Read Only
            </span>
          )}
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-bb-muted">
            <span className="group-open:hidden font-semibold text-bb-primary">View</span>
            <span className="hidden group-open:inline">Hide</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </span>
        </div>
      </summary>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 px-3.5 pb-2">
        {(["All", "Standard", "Custom Shape"] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryTab(cat)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[10px] font-semibold transition-colors",
              activeCategoryTab === cat
                ? "bg-bb-primary text-white"
                : "bg-bb-elevated text-bb-muted hover:text-bb-text"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 px-3.5 pb-3">
        {filteredPatterns.map((pattern) => {
          const isEnabled = enabledPatterns.includes(pattern.id);

          if (!isHost) {
            // Read-Only Card for non-host players
            return (
              <div
                key={pattern.id}
                title={`Room Pattern: ${pattern.label} (${isEnabled ? "Active" : "Disabled"})`}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border p-2 text-left select-none cursor-default transition-all",
                  isEnabled
                    ? "border-bb-primary/30 bg-bb-surface shadow-sm opacity-100"
                    : "border-bb-border bg-bb-elevated/40 opacity-40"
                )}
              >
                <div className="flex w-full items-center justify-between px-0.5 mb-0.5">
                  <PatternMiniGrid dots={pattern.dots} activePattern={isEnabled} />
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold",
                      isEnabled
                        ? "bg-bb-primary text-white"
                        : "bg-bb-border text-bb-muted"
                    )}
                  >
                    {isEnabled ? <Check className="h-2.5 w-2.5" /> : "OFF"}
                  </span>
                </div>
                <span className="px-0.5 text-center text-[9px] font-bold leading-tight text-bb-text">
                  {pattern.label}
                </span>
              </div>
            );
          }

          // Interactive Control Card for Room Host
          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => toggleHostPattern(pattern.id)}
              title={`Host Action: Click to ${isEnabled ? "disable" : "enable"} ${pattern.label}`}
              className={cn(
                "group/card flex flex-col items-center gap-1 rounded-xl border p-2 text-left transition-all",
                isEnabled
                  ? "border-bb-primary/40 bg-bb-surface shadow-sm hover:border-bb-primary"
                  : "border-bb-border bg-bb-elevated/40 opacity-50 hover:opacity-90"
              )}
            >
              <div className="flex w-full items-center justify-between px-0.5 mb-0.5">
                <PatternMiniGrid dots={pattern.dots} activePattern={isEnabled} />
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold transition-colors",
                    isEnabled
                      ? "bg-bb-primary text-white"
                      : "bg-bb-border text-bb-muted"
                  )}
                >
                  {isEnabled ? <Check className="h-2.5 w-2.5" /> : "OFF"}
                </span>
              </div>
              <span className="px-0.5 text-center text-[9px] font-bold leading-tight text-bb-text">
                {pattern.label}
              </span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
