import { useEffect, useState } from "react";
import { apiClient } from "@/global/apiClient";
import { Navbar } from "@/components/navbar/Navbar";
import { LiveBingoCard } from "@/components/hero/LiveBingoCard";

type RoomData = {
  id?: number;
  code?: string;
  title?: string;
  theme?: string;
  status?: string;
  hostName?: string;
  playerCount?: number;
  maxPlayers?: number;
  calledNumbers?: number[];
};

export default function Room() {
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const code = (() => {
    try {
      const hash = window.location.hash || "";
      const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
      if (parts[0] === "room" && parts[1]) return parts[1];
    } catch (e) {
      return undefined;
    }
    return undefined;
  })();

  useEffect(() => {
    if (!code) {
      setError("No room code in URL.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiClient.get(`/api/v1/rooms/${code}`);
        if (!mounted) return;
        setRoom(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? (err?.message ?? "Could not load room."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [code]);

  if (loading) return <div className="p-8">Opening room…</div>;

  if (error)
    return (
      <div className="p-8">
        <p className="mb-4 text-red-500">{error}</p>
        <button className="btn" onClick={() => (window.location.hash = "#/")}>Back to rooms</button>
      </div>
    );

  if (!room)
    return (
      <div className="p-8">
        <p>Room not found.</p>
        <button className="btn" onClick={() => (window.location.hash = "#/")}>Back to rooms</button>
      </div>
    );

  const lastCall = room.calledNumbers?.at(-1);
  const recentCalls = room.calledNumbers?.slice(-5).reverse() ?? [];

  return (
    <main className="min-h-screen bg-bb-bg text-bb-text">
      <Navbar />
      <section className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <LiveBingoCard
            roomTitle={room.title}
            playerCount={room.playerCount}
            maxPlayers={room.maxPlayers}
            currentNumber={lastCall}
            recentNumbers={recentCalls}
            callerLine={`Host ${room.hostName ?? "Host"} is calling the filmi numbers.`}
          />

          <div className="rounded-2xl border border-bb-border bg-bb-elevated p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-bb-text">Room: {room.title}</h2>
            <p className="text-sm text-bb-muted">Code: {room.code}</p>
            <p className="mt-4 text-bb-text">Theme: {room.theme}</p>
            <p className="mt-2 text-bb-text">Host: {room.hostName}</p>
            <div className="mt-6">
              <button
                className="rounded-lg bg-bb-primary px-4 py-2 text-white hover:bg-bb-primary-hover font-semibold transition-colors"
                onClick={() => (window.location.hash = "#/")}
              >
                Leave room
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
