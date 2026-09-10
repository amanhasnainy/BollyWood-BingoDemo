const PARTICLES = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${12 + ((index * 23) % 76)}%`,
  size: index % 3 === 0 ? 120 : index % 3 === 1 ? 80 : 60,
  delay: `${(index % 6) * 1.2}s`,
  duration: `${10 + (index % 5) * 1.5}s`,
  color: index % 2 === 0 ? "rgba(255,77,126,0.06)" : "rgba(255,77,126,0.04)",
}));

export function HeroParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full blur-3xl animate-particle-drift"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
