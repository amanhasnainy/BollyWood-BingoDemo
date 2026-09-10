import { Play, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { HeroFeatures } from "./HeroFeatures";

type HeroContentProps = {
  onPlayClick: () => void;
  onWatchClick: () => void;
};

export function HeroContent({ onPlayClick, onWatchClick }: HeroContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-xl"
    >
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-bb-border bg-bb-elevated px-4 py-2 text-sm font-medium text-bb-muted shadow-sm">
        <span aria-hidden="true">🎵</span>
        First Multiplayer Bollywood Bingo
      </div>

      <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-bb-text sm:text-5xl lg:text-[3.25rem]">
        Play Bollywood Bingo
        <br />
        <span className="text-bb-primary">Live. Fun. Anywhere.</span>
      </h1>

      <p className="mt-5 max-w-md text-base leading-relaxed text-bb-muted sm:text-lg">
        Play Bollywood, Sangeet, Diwali and Kitty Party Bingo with friends across the world.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <motion.button
          type="button"
          onClick={onPlayClick}
          data-testid="button-hero-play"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="bb-btn-primary min-h-12 gap-2 px-7 text-sm"
        >
          <Play className="h-4 w-4 fill-current" />
          Play Free
        </motion.button>

        <motion.button
          type="button"
          onClick={onWatchClick}
          data-testid="button-hero-preview"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="bb-btn-ghost min-h-12 gap-2 px-7 text-sm"
        >
          <Radio className="h-4 w-4" />
          Watch Live Rooms
        </motion.button>
      </div>

      <HeroFeatures />
    </motion.div>
  );
}
