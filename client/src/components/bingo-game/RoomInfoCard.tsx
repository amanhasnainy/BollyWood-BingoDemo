import { Copy, Users } from "lucide-react";
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

export function RoomInfoCard() {
  const roomCode = getRoomCodeFromUrl();
  const { data: room } = useQuery({
    queryKey: ["room", roomCode],
    queryFn: () => getRoomByCode(roomCode),
    enabled: Boolean(roomCode),
  });

  const title = room?.title ?? "Bingo Room";
  const code = room?.code ?? roomCode;
  const rawStatus = String(room?.status ?? "waiting");
  const playerIds: string[] = Array.isArray(room?.playerIds) ? room.playerIds : [];
  const playerCount = playerIds.length > 0 ? playerIds.length : (room?.playerCount ?? 1);
  const maxPlayers = room?.maxPlayers ?? 50;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-bb-border px-6 py-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "Live" ? "bg-bb-success" : "bg-[#F59E0B]"
          }`}
        />
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            status === "Live" ? "text-bb-success" : "text-[#F59E0B]"
          }`}
        >
          {status}
        </span>
      </div>

      <h1 className="text-[15px] font-semibold text-bb-text">{title}</h1>

      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(code)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-bb-surface px-2.5 py-1 text-xs font-medium text-bb-muted transition-colors hover:bg-[#EBEBEB]"
        title="Copy room code"
      >
        {code}
        <Copy className="h-3 w-3" />
      </button>

      <div className="ml-auto flex items-center gap-1.5 text-sm text-bb-muted">
        <Users className="h-4 w-4" />
        <span>
          <span className="font-semibold text-bb-text">{playerCount}</span>
          {" / "}
          {maxPlayers}
        </span>
      </div>
    </div>
  );
}