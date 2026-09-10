const BINGO_NUMBERS = [7, 22, 42, 58, 77, 88];

const BALLS = BINGO_NUMBERS.map((number, index) => ({
  id: index,
  number,
  left: `${6 + index * 16}%`,
  top: `${18 + (index % 3) * 22}%`,
  size: index % 2 === 0 ? 56 : 48,
  delay: `${index * 0.9}s`,
  duration: `${5.5 + (index % 3) * 1.2}s`,
}));

export function CtaBingoBalls() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {BALLS.map((ball) => (
        <div
          key={ball.id}
          className="absolute flex animate-bingo-ball-float items-center justify-center rounded-full border border-bb-border bg-bb-elevated font-black text-bb-primary/15 shadow-sm"
          style={{
            left: ball.left,
            top: ball.top,
            width: ball.size,
            height: ball.size,
            fontSize: ball.size * 0.32,
            animationDelay: ball.delay,
            animationDuration: ball.duration,
          }}
        >
          {ball.number}
        </div>
      ))}
    </div>
  );
}
