const COLORS = ["#C81D4A", "#E8A93B", "#C81D4A", "#0B6E64"];

const CONFETTI = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${(index * 6.5) % 100}%`,
  top: `${(index * 9) % 60}%`,
  width: index % 2 === 0 ? 5 : 3,
  height: index % 2 === 0 ? 3 : 5,
  color: COLORS[index % COLORS.length],
  delay: `${(index % 8) * 0.6}s`,
  duration: `${4 + (index % 5) * 0.8}s`,
}));

export function CtaConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {CONFETTI.map((piece) => (
        <span
          key={piece.id}
          className="absolute animate-confetti-fall rounded-sm opacity-30"
          style={{
            left: piece.left,
            top: piece.top,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}
    </div>
  );
}
