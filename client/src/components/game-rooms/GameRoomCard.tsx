import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { GameRoom } from "./gameRoomsData";
import { getDisplayStatus } from "./gameRoomsData";

type GameRoomCardProps = {
  room: GameRoom;
  index: number;
  onJoin: (roomId: string) => void;
  onPreview: (roomId: string) => void;
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  live: {
    label: "LIVE",
    className: "bg-[#0B6E64] text-white",
  },
  playing: {
    label: "LIVE",
    className: "bg-[#0B6E64] text-white",
  },
  waiting: {
    label: "WAITING",
    className: "bg-[#E8A93B] text-white",
  },
  full: {
    label: "FULL",
    className: "bg-[#C81D4A] text-white",
  },
  finished: {
    label: "FINISHED",
    className: "bg-[#6E627C] text-white",
  },
};

export function GameRoomCard({ room, index, onJoin, onPreview }: GameRoomCardProps) {
  const displayStatus = getDisplayStatus(room) || "waiting";
  const statusStyle = STATUS_STYLES[displayStatus] ?? {
    label: String(displayStatus).toUpperCase(),
    className: "bg-[#6B7280] text-white",
  };
  const fillPercent = room.maxPlayers > 0 ? Math.min(100, Math.round((room.playerCount / room.maxPlayers) * 100)) : 0;
  const isFull = displayStatus === "full";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="group"
    >
      <div className="flex h-full flex-col rounded-2xl border border-bb-border bg-bb-elevated p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyle.className}`}
          >
            <span className="text-[8px]">●</span>
            {statusStyle.label}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bb-primary/10 text-lg">
            {room.emoji}
          </span>
        </div>

        <h3 className="mt-3 text-[15px] font-bold leading-snug text-bb-text">{room.name}</h3>

        <span className="mt-1.5 inline-block w-fit rounded-md bg-bb-primary/10 px-2 py-0.5 text-[11px] font-medium text-bb-primary">
          {room.theme}
        </span>

        <p className="mt-3 text-xs text-bb-muted">
          {room.playerCount} / {room.maxPlayers} Players
        </p>

        <div className="relative mt-2">
          <span className="absolute -top-4 right-0 text-[10px] font-medium text-bb-muted">
            {fillPercent}%
          </span>
          <div className="h-1.5 overflow-hidden rounded-full bg-bb-surface">
            <motion.div
              className="h-full rounded-full bg-bb-primary transition-all duration-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${fillPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.06 + 0.15, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 text-[11px] text-bb-muted">
          <span className="inline-flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-bb-gold text-bb-gold" />
            {room.entryFee} Stars Entry
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-bb-primary text-[8px] font-bold text-white">
                {room.hostInitials}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              Host: <span className="font-semibold text-bb-text">{room.hostName}</span>
            </span>
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <motion.button
            type="button"
            onClick={() => onJoin(room.id)}
            disabled={isFull}
            whileHover={isFull ? undefined : { scale: 1.02 }}
            whileTap={isFull ? undefined : { scale: 0.98 }}
            data-testid={`button-join-room-${room.id}`}
            className="flex-1 rounded-lg bg-bb-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-bb-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Join Now
          </motion.button>
          <motion.button
            type="button"
            onClick={() => onPreview(room.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid={`button-preview-room-${room.id}`}
            className="flex-1 rounded-lg border border-bb-primary bg-bb-elevated py-2 text-xs font-semibold text-bb-primary transition-colors hover:bg-bb-primary/10"
          >
            Preview
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
