import { motion } from "framer-motion";
import { Users } from "lucide-react";

export type LiveBingoCardProps = {
  roomTitle?: string;
  theme?: string;
  hostName?: string;
  playerCount?: number;
  maxPlayers?: number;
  currentNumber?: number;
  recentNumbers?: number[];
  callerLine?: string;
};

const DEFAULT_RECENT = [77, 63, 58, 44, 39];

const MINI_GRID = [
  [4, null, 16, null, 31, null, 58, null, 77],
  [null, 9, null, 22, 39, 44, null, 63, null],
  [2, null, 19, null, 36, null, 61, null, 88],
];

const CALLED_NUMBERS = new Set([4, 9, 16, 22, 31, 39, 44, 58, 63, 77]);

export function LiveBingoCard({
  roomTitle = "Mehendi Ki Raat",
  theme = "Sangeet Night",
  hostName = "Ritu",
  playerCount = 24,
  maxPlayers = 40,
  currentNumber = 24,
}: LiveBingoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg lg:mx-0"
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(200,29,74,0.15)_0%,transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="animate-hero-float relative flex items-stretch rounded-3xl shadow-2xl">
        {/* Top & Bottom Circular Perforation Notches */}
        <span className="absolute -top-3.5 right-[84px] z-20 h-7 w-7 rounded-full bg-[#1B1330] sm:right-[100px]" aria-hidden="true" />
        <span className="absolute -bottom-3.5 right-[84px] z-20 h-7 w-7 rounded-full bg-[#1B1330] sm:right-[100px]" aria-hidden="true" />

        {/* Main White Ticket Card Body */}
        <div className="relative z-10 flex-1 rounded-l-3xl bg-[#FFFDF9] p-6 text-[#1B1330] sm:p-7">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C81D4A]">
            ROOM · LIVE
          </span>

          <h2 className="mt-1 font-serif text-2xl font-bold leading-tight text-[#1B1330] sm:text-3xl">
            {roomTitle}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-[#1B1330]/60">
            {theme} · Host {hostName}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-5xl font-black text-[#1B1330] tabular-nums sm:text-6xl">
              {playerCount}
            </span>
            <span className="text-sm font-bold text-[#1B1330]/50">/{maxPlayers} seated</span>
          </div>

          <div className="mt-6 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-[#F3E5D4] bg-[#FDF6ED] px-4 py-2.5 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[#1B1330]">
                <span>🎵</span> Now playing
              </span>
              <span className="font-bold text-[#E8A93B]">Tip Tip Barsa</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#F3E5D4] bg-[#FDF6ED] px-4 py-2.5 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[#1B1330]">
                <span>🎟</span> Entry
              </span>
              <span className="font-bold text-[#E8A93B]">5★</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#F3E5D4] bg-[#FDF6ED] px-4 py-2.5 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[#1B1330]">
                <span>⏱</span> Next call
              </span>
              <span className="font-bold text-[#E8A93B]">0:14</span>
            </div>
          </div>
        </div>

        {/* Vertical Dotted Perforation Line */}
        <div className="relative z-10 w-0 border-r-2 border-dashed border-[#EADBCC]" />

        {/* Right Red Ticket Stub */}
        <div className="relative z-10 flex w-24 flex-col items-center justify-between bg-[#C81D4A] px-2 py-6 text-white rounded-r-3xl sm:w-28">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-white/90 uppercase [writing-mode:vertical-lr] rotate-180">
            ROOM 01
          </span>
          <span className="font-serif text-3xl font-black text-[#E8A93B] sm:text-4xl">
            {playerCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
