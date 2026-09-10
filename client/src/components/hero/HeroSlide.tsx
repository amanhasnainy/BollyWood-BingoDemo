import { motion } from "framer-motion";
import { HeroParticles } from "./HeroParticles";
import type { HeroSlideData } from "./heroSlidesData";
import { HeroSlideVisuals } from "./HeroSlideVisuals";
import type { LiveBingoCardProps } from "./LiveBingoCard";

type HeroSlideProps = {
  slide: HeroSlideData;
  isActive: boolean;
  liveCard?: LiveBingoCardProps;
};

export function HeroSlide({ slide, isActive, liveCard }: HeroSlideProps) {
  const scrollTo = (target: string) => {
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative flex h-full min-h-[85vh] items-center overflow-hidden bg-[#1B1330] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(200,29,74,0.12),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(232,169,59,0.08),transparent_45%)]"
        aria-hidden="true"
      />
      {slide.visual !== "bingo" && <HeroParticles />}

      <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-16">
        <div className="order-1 lg:order-none">
          <motion.div
            initial={false}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8A93B]/40 bg-[#1B1330] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#E8A93B] shadow-sm">
              💃 {slide.badge.replace(/^[^a-zA-Z0-9]+/, "").trim() || "SANGEET NIGHT"}
            </span>

            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.12] text-white sm:text-5xl lg:text-[3.6rem]">
              Grab a seat at <br />
              <span className="font-serif italic text-[#E8A93B]">
                {slide.visual === "bingo" ? (liveCard?.roomTitle ? `${liveCard.roomTitle}.` : "Mehendi Ki Raat.") : `${slide.headingLine2}.`}
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
              {slide.visual === "bingo"
                ? `${liveCard?.theme ?? "90s Bollywood classics"}, hosted live by ${liveCard?.hostName ?? "Ritu"}. ${liveCard?.playerCount ?? 24} players already on the floor — the next full house could be yours.`
                : slide.description}
            </p>

            <motion.div
              initial={false}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.button
                type="button"
                onClick={() => scrollTo(slide.buttons[0]?.target ?? "live-rooms")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`hero-button-${slide.id}-primary`}
                className="rounded-full bg-[#C81D4A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C81D4A]/25 transition-transform hover:scale-105 active:scale-95"
              >
                {slide.buttons[0]?.label ?? "Join This Room"}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => scrollTo(slide.buttons[1]?.target ?? "live-rooms")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`hero-button-${slide.id}-secondary`}
                className="rounded-full border border-white/25 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
              >
                {slide.buttons[1]?.label ?? "Browse All Rooms"}
              </motion.button>
            </motion.div>

            {/* 3-Column Stats Footer Row */}
            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 pt-4">
              <div>
                <p className="font-serif text-2xl font-black text-[#E8A93B] sm:text-3xl">
                  {liveCard?.playerCount ?? 24}/{liveCard?.maxPlayers ?? 40}
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">Players seated</p>
              </div>

              <div>
                <p className="font-serif text-2xl font-black text-[#E8A93B] sm:text-3xl">
                  {liveCard?.hostName ?? "Ritu"}
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">Tonight's host</p>
              </div>

              <div>
                <p className="font-serif text-2xl font-black text-[#E8A93B] sm:text-3xl">
                  5★
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">To join</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="order-2 lg:order-none">
          <motion.div
            initial={false}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 32 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <HeroSlideVisuals visual={slide.visual} isActive={isActive} liveCard={liveCard} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
