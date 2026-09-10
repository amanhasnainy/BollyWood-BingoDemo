import { useBingoGame } from "@/hooks/useBingoGame";

export function GameProgress() {
  const { markedCount, progressPercent, songsCalled, songsRemaining } = useBingoGame();

  const stats = [
    { label: "Marked", value: `${markedCount}/25`, accent: true },
    { label: "Called", value: songsCalled },
    { label: "Left", value: songsRemaining },
  ];

  return (
    <div className="border-t border-bb-border px-3.5 py-3">
      <div className="mb-2 flex gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col items-center rounded-lg bg-bb-surface py-1.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wide text-bb-muted">
              {stat.label}
            </span>
            <span
              className={`text-sm font-bold ${stat.accent ? "text-bb-primary" : "text-bb-text"}`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F0F0F0]">
          <div
            className="h-full rounded-full bg-bb-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="min-w-[2rem] text-right text-xs font-bold text-bb-primary">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
}
