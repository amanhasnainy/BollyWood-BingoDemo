import { useBingoGame } from "@/hooks/useBingoGame";

export function ProgressPanel() {
  const { songsCalled, songsRemaining, markedCount, progressPercent } = useBingoGame();

  const stats = [
    { label: "Songs Called", value: songsCalled },
    { label: "Remaining", value: songsRemaining },
    { label: "Marked Cells", value: markedCount },
    { label: "Progress", value: `${progressPercent}%` },
  ];

  return (
    <div className="rounded-2xl border border-bb-border bg-bb-elevated p-5">
      <h3 className="mb-3 text-sm font-semibold text-bb-text">Game Progress</h3>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-bb-border bg-bb-surface px-3 py-2.5"
          >
            <p className="text-[10px] font-medium text-bb-muted">{stat.label}</p>
            <p className="mt-0.5 text-lg font-bold text-bb-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-bb-muted">
          <span>Card Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
          <div
            className="h-full rounded-full bg-bb-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
