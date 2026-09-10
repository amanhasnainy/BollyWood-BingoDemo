import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { apiClient } from "@/global/apiClient";
import { useLocation } from "wouter";
import { GameTopBar } from "./GameTopBar";
import { RoomInfoCard } from "./RoomInfoCard";
import { ChatPanel } from "./ChatPanel";
import { GamePlayPanel } from "@/components/game/GamePlayPanel";
import { ROOM_INFO } from "./bingoGameData";

export function GameLayout() {
  const [, setLocation] = useLocation();
  const [isLeaving, setIsLeaving] = useState(false);

  const roomCode = useMemo(() => {
    const hash = window.location.hash || "";
    const parts = hash.replace(/^#/, "").split("/").filter(Boolean);
    if (parts[0] === "bingo-game" && parts[1]) return parts[1];
    if (parts[0] === "room" && parts[1]) return parts[1];
    return ROOM_INFO.roomCode;
  }, []);

  const handleLeaveRoom = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    try {
      await apiClient.post(`/api/v1/rooms/${roomCode}/leave`);
      setLocation("/");
    } catch {
      setLocation("/");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bb-bg">
      <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 sm:py-5">
        <GameTopBar onLeaveRoom={handleLeaveRoom} />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 overflow-hidden rounded-[20px] border border-bb-border bg-bb-elevated shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-8.5rem)]">
            <section className="order-2 flex min-w-0 flex-1 flex-col lg:order-1">
              <RoomInfoCard />
              <ChatPanel />
            </section>

            <aside className="order-1 flex w-full flex-col border-b border-bb-border p-3 lg:order-2 lg:w-[min(100%,380px)] lg:shrink-0 lg:border-b-0 lg:border-l">
              <GamePlayPanel category={ROOM_INFO.category} />
            </aside>
          </div>
        </motion.main>
      </div>
    </div>
  );
}