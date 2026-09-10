import { useMemo, useState } from "react";
import { GameRoomCard } from "./GameRoomCard";
import { GameRoomFilters } from "./GameRoomFilters";
import { GameRoomHeader } from "./GameRoomHeader";
import { type CategoryFilter, type GameRoom, type StatusFilter } from "./gameRoomsData";

type GameRoomsSectionProps = {
  onCreateRoom: () => void;
  onJoinRoom: (roomCode: string) => void;
  rooms: GameRoom[];
};

export function GameRoomsSection({ onCreateRoom, onJoinRoom, rooms }: GameRoomsSectionProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesSearch =
        !query ||
        room.name.toLowerCase().includes(query) ||
        room.theme.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (statusFilter === "live") {
        if (room.status !== "live" || (room.maxPlayers > 0 && room.playerCount > room.maxPlayers)) return false;
      }
      if (statusFilter === "waiting") {
        if (room.status !== "waiting" || (room.maxPlayers > 0 && room.playerCount > room.maxPlayers)) return false;
      }
      if (categoryFilter !== "all" && room.category !== categoryFilter) return false;

      return true;
    });
  }, [statusFilter, categoryFilter, searchQuery]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="live-rooms"
      className="bg-bb-surface px-5 pb-16 pt-20 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24"
      data-testid="section-live-game-rooms"
    >
            <div className="mx-auto max-w-[1400px]">
        <GameRoomHeader onCreateRoom={onCreateRoom} />

        <div className="mt-8">
          <GameRoomFilters
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
            onStatusChange={setStatusFilter}
            onCategoryChange={setCategoryFilter}
            onSearchChange={setSearchQuery}
          />
        </div>

        {filteredRooms.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredRooms.map((room, index) => (
              <GameRoomCard
                key={room.id}
                room={room}
                index={index}
                onJoin={onJoinRoom}
                onPreview={() => scrollTo("live-rooms")}
              />
            ))}
          </div>
        ) : (
          <div
            className="mt-8 rounded-2xl border border-dashed border-bb-border bg-bb-elevated px-6 py-14 text-center"
            data-testid="empty-game-rooms"
          >
            <p className="text-base font-semibold text-bb-text">No rooms match your filters</p>
            <p className="mt-2 text-sm text-bb-muted">Try a different theme or clear your search.</p>
          </div>
        )}

        {filteredRooms.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => scrollTo("cta")}
              data-testid="button-view-all-rooms"
              className="rounded-full border border-bb-border bg-bb-elevated px-6 py-2.5 text-sm font-semibold text-bb-text shadow-sm transition-all hover:border-[#D1D5DB] hover:shadow-md"
            >
              View All Rooms →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
