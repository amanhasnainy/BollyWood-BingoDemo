type PatternTrackerProps = {
  markedCount: number;
  totalCount: number;
};

export function PatternTracker({ markedCount, totalCount }: PatternTrackerProps) {
  const pct = Math.round((markedCount / totalCount) * 100);

  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-bb-muted">
          {markedCount} / {totalCount} Marked
        </span>
        <span className="text-xs font-medium text-bb-muted">{pct}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#F0F0F0]">
        <div
          className="h-full rounded-full bg-bb-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}