import { Check } from "lucide-react";

const FEATURES = [
  "Live Multiplayer",
  "Real-time Caller",
  "Win Stars",
  "Secure Rooms",
] as const;

export function HeroFeatures() {
  return (
    <ul className="mt-10 grid gap-3 sm:grid-cols-2">
      {FEATURES.map((feature) => (
        <li
          key={feature}
          className="flex items-center gap-2.5 text-sm text-bb-muted"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bb-success/10 text-bb-success">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          {feature}
        </li>
      ))}
    </ul>
  );
}
