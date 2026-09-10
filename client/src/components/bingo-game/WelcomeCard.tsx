import { Star, User, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRoomByCode } from "@/global/roomsApi";

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

export function WelcomeCard() {
  const roomCode = getRoomCodeFromUrl();
  const { data: room } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: () => getRoomByCode(roomCode),
    enabled: Boolean(roomCode),
  });

  const hostName = room?.hostName ?? "Host";
  const playerCount = room?.playerCount ?? 1;
  const maxPlayers = room?.maxPlayers ?? 50;

  const stats = [
    {
      label: "Players",
      value: `${playerCount} / ${maxPlayers}`,
      icon: Users,
      color: "text-bb-primary",
      bg: "bg-bb-primary/10",
    },
    {
      label: "Stars Prize",
      value: "200",
      icon: Star,
      color: "text-[#EAB308]",
      bg: "bg-[#FEFCE8]",
      fill: true,
    },
    {
      label: "Host",
      value: hostName,
      icon: User,
      color: "text-bb-primary",
      bg: "bg-bb-primary/10",
    },
  ];

  return (
    <div className="w-full max-w-[400px] rounded-2xl border border-bb-border bg-bb-elevated p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bb-primary/10">
          <Users className="h-6 w-6 text-bb-primary" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-bb-text">Welcome to {room?.title ?? "the Room"}!</h2>
        <p className="mt-1 text-sm text-bb-muted">The host ({hostName}) will start the game soon.</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl border border-bb-border px-1 py-3"
          >
            <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon
                className={`h-4 w-4 ${stat.color}`}
                fill={"fill" in stat && stat.fill ? "currentColor" : "none"}
              />
            </div>
            <p className="text-[10px] leading-none text-bb-muted">{stat.label}</p>
            <p className="mt-1.5 text-[11px] font-semibold leading-tight text-bb-text">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}