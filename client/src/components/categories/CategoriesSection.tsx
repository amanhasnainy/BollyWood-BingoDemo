import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlaylists } from "@/global/playlistsApi";
import { CategoryCard } from "./CategoryCard";
import { categories as defaultCategories, categoriesRowTwo as defaultCategoriesRowTwo } from "./categoriesData";

const FILTER_TABS = ["All Playlists", "Diwali", "Sangeet", "Bollywood", "Punjabi", "Ladies Club"];

export function CategoriesSection() {
  const [activeFilter, setActiveFilter] = useState("All Playlists");

  const { data: fetchedPlaylists } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
  });

  const allCategories = useMemo(() => {
    const fallbackCombined = [...defaultCategories, ...defaultCategoriesRowTwo];
    if (!fetchedPlaylists || !fetchedPlaylists.length) {
      return fallbackCombined;
    }

    return fetchedPlaylists.map((p, index) => {
      const match = fallbackCombined.find(
        (c) =>
          c.id.toLowerCase() === (p.id || "").toLowerCase() ||
          c.name.toLowerCase() === (p.name || (p as any).title || "").toLowerCase()
      ) || fallbackCombined[index % fallbackCombined.length];

      let formattedSongCount = match.songCount;
      if (p.songCount !== undefined && p.songCount !== null) {
        formattedSongCount = typeof p.songCount === "number" ? `${p.songCount} Songs` : String(p.songCount);
      } else if (Array.isArray((p as any).songs)) {
        formattedSongCount = `${(p as any).songs.length} Songs`;
      }

      return {
        id: p.id || match.id,
        emoji: p.emoji || match.emoji || "🎵",
        name: p.name || (p as any).title || match.name,
        songCount: formattedSongCount,
        badge: p.badge || match.badge || "Playlist Ready",
        filterTag: (p as any).filterTag || match.filterTag || "Bollywood",
        gradient: (p as any).gradient || match.gradient,
        Icon: (p as any).Icon || match.Icon,
      };
    });
  }, [fetchedPlaylists]);

  const filteredCategories = useMemo(() => {
    if (activeFilter === "All Playlists") {
      return allCategories;
    }
    return allCategories.filter(
      (cat) =>
        cat.filterTag?.toLowerCase() === activeFilter.toLowerCase() ||
        cat.name.toLowerCase().includes(activeFilter.toLowerCase()),
    );
  }, [allCategories, activeFilter]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const onViewPlaylist = () => scrollTo("live-rooms");

  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-[#FBF3E7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-[#1B1330]"
      data-testid="section-categories"
    >
      <div className="relative mx-auto max-w-[1350px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C81D4A]">
            SONG PLAYLISTS
          </span>

          <h2 className="mt-2 font-serif text-3xl font-extrabold text-[#1B1330] sm:text-4xl lg:text-5xl">
            Pick a playlist, press play
          </h2>

          <p className="mt-3 text-sm text-[#1B1330]/70 leading-relaxed max-w-lg mx-auto">
            Every playlist is a ready-made Bingo card generator — choose your vibe and jump straight into a room.
          </p>
        </div>

        {/* Filter Pills Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                data-testid={`filter-tab-${tab.toLowerCase().replace(/\s/g, "-")}`}
                className={
                  isActive
                    ? "rounded-full bg-[#1B1330] px-5 py-2 text-xs font-bold text-white shadow-sm transition-all"
                    : "rounded-full border border-[#EADBCC] bg-white px-5 py-2 text-xs font-semibold text-[#1B1330] transition-colors hover:bg-white/80"
                }
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Playlist Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              onViewPlaylist={onViewPlaylist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
