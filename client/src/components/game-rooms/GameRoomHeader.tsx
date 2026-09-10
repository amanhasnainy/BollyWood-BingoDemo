import { motion } from "framer-motion";
import { Gamepad2, Plus } from "lucide-react";

type GameRoomHeaderProps = {
  onCreateRoom: () => void;
};

export function GameRoomHeader({ onCreateRoom }: GameRoomHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bb-primary/10 text-bb-primary">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-bb-text sm:text-[1.75rem]">
            Live Game Rooms
          </h2>
        </div>
        <p className="mt-2 max-w-xl text-sm text-bb-muted sm:text-[15px]">
          Join an existing room or create your own and play with players worldwide.
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onCreateRoom}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="button-create-room"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-bb-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-bb-primary-hover"
      >
        <Plus className="h-4 w-4" />
        Create Room (10 Stars)
      </motion.button>
    </div>
  );
}
