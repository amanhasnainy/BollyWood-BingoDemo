import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlaylists } from "@/global/playlistsApi";
import { PlaylistCard } from "./PlaylistCard";
import { featuredPlaylists } from "./playlistsData";

export function FeaturedPlaylistsSection() {
  const { data: fetchedPlaylists } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
  });

  const playlistsToDisplay = useMemo(() => {
    if (!fetchedPlaylists || !fetchedPlaylists.length) {
      return featuredPlaylists;
    }
    return fetchedPlaylists.map((p, index) => {
      const match = featuredPlaylists.find(
        (f) =>
          f.id.toLowerCase() === (p.id || "").toLowerCase() ||
          f.name.toLowerCase() === (p.name || (p as any).title || "").toLowerCase()
      ) || featuredPlaylists[index % featuredPlaylists.length];

      let count = match.songCount;
      if (typeof p.songCount === "number") {
        count = p.songCount;
      } else if (typeof p.songCount === "string" && !isNaN(parseInt(p.songCount, 10))) {
        count = parseInt(p.songCount, 10);
      } else if (Array.isArray((p as any).songs)) {
        count = (p as any).songs.length;
      }

      return {
        id: p.id || match.id,
        emoji: p.emoji || match.emoji || "🎵",
        name: p.name || (p as any).title || match.name,
        songCount: count,
        duration: (p as any).duration || match.duration || "45 mins",
        tags: (p as any).tags || match.tags || ["Bollywood", "Hits"],
      };
    });
  }, [fetchedPlaylists]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="featured-playlists"
      className="bg-bb-bg px-5 py-24 sm:px-8 lg:px-12 lg:py-28"
      data-testid="section-featured-playlists"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-black tracking-tight text-bb-text sm:text-4xl">
            Featured Playlists
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-bb-muted">
            Choose your favorite playlist and start the fun.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {playlistsToDisplay.map((playlist, index) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              index={index}
              onPlay={() => scrollTo("live-rooms")}
              onPreview={() => scrollTo("live-rooms")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
