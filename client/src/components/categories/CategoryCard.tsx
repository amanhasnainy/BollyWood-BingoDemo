import { motion } from "framer-motion";
import { Check, Play } from "lucide-react";
import type { Category } from "./categoriesData";

type CategoryCardProps = {
  category: Category;
  index: number;
  onViewPlaylist: () => void;
  onPlayBingo?: () => void;
};

export function CategoryCard({ category, index, onViewPlaylist }: CategoryCardProps) {
  const { emoji, name, songCount, badge, gradient, Icon } = category;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className="group"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#EADBCC]/60 bg-white shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
        {/* Top Header Banner with Theme Gradient */}
        <div className={`relative h-44 sm:h-48 overflow-hidden rounded-t-3xl bg-gradient-to-b ${gradient || "from-[#8C1B3E] via-[#A81B43] to-[#C81D4A]"} p-4 flex flex-col justify-between`}>
          {/* Top Right Circular Badge */}
          <div className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1B1330] shadow-md">
            <Icon className="h-4 w-4 text-[#1B1330]" strokeWidth={2.25} />
          </div>

          {/* Center 3D Music Note / Emoji */}
          <div className="relative flex h-full items-center justify-center">
            <span className="text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
              {emoji || "🎵"}
            </span>
          </div>

          {/* Bottom Right Decorative Note */}
          <span className="absolute bottom-2.5 right-3 text-xs text-white/40 font-mono" aria-hidden="true">♪</span>
        </div>

        {/* Bottom Card Content */}
        <div className="flex flex-1 flex-col p-5 bg-white text-[#1B1330]">
          <h3 className="font-serif text-lg font-bold leading-tight text-[#1B1330]">{name}</h3>
          <p className="mt-0.5 text-xs font-medium text-[#1B1330]/50">{songCount}</p>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#0B6E64]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0B6E64] text-white">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
            </span>
            <span>{badge || "Playlist Ready"}</span>
          </div>

          <button
            type="button"
            onClick={onViewPlaylist}
            data-testid={`button-view-playlist-${category.id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#C81D4A] py-3 text-xs font-bold text-white shadow-md shadow-[#C81D4A]/20 transition-all hover:bg-[#A6153B] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>View Playlist</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
