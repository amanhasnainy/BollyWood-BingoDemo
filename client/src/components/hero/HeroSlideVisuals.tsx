import { motion } from "framer-motion";
import { Check, Clock, Music2, Play, Users, Zap } from "lucide-react";
import type { HeroSlideVisual } from "./heroSlidesData";
import { LiveBingoCard, type LiveBingoCardProps } from "./LiveBingoCard";

const PLAYLISTS = [
  { emoji: "🪔", name: "Diwali Hits", songs: 75, rotate: -8, x: -20 },
  { emoji: "🎵", name: "Sangeet Special", songs: 75, rotate: 0, x: 0 },
  { emoji: "🥁", name: "Punjabi Beats", songs: 75, rotate: 8, x: 20 },
];

const CHAT_MESSAGES = [
  { user: "Asha", color: "#E8A93B", text: "Ready for number 77! 🎉" },
  { user: "Meera", color: "#C81D4A", text: "Almost got a full house!" },
  { user: "Ritu", color: "#0B6E64", text: "This room is so fun 🔥" },
];

function HeroPlaylistVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,77,126,0.07)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="animate-hero-float relative">
        <div className="relative overflow-hidden rounded-[22px] border border-bb-border bg-bb-elevated p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-bb-primary">Featured Playlists</span>
            <span className="flex items-center gap-1 rounded-full bg-bb-primary/5 px-2.5 py-1 text-[10px] font-bold text-bb-primary">
              <Music2 className="h-3 w-3" /> 75 Songs Each
            </span>
          </div>

          <div className="relative mx-auto mb-6 flex h-44 items-end justify-center">
            {PLAYLISTS.map((pl, index) => (
              <motion.div
                key={pl.name}
                animate={isActive ? { y: [0, -8, 0], rotate: pl.rotate } : { rotate: pl.rotate }}
                transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                className="absolute bottom-0 w-28 overflow-hidden rounded-2xl border border-bb-border bg-bb-elevated shadow-md sm:w-32"
                style={{ x: pl.x, zIndex: index === 1 ? 3 : index === 0 ? 2 : 1 }}
              >
                <div className="flex h-32 flex-col items-center justify-center border-b border-bb-border bg-bb-surface p-3">
                  <span className="text-4xl">{pl.emoji}</span>
                  <p className="mt-2 text-center text-[10px] font-bold text-bb-text">{pl.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-bb-border bg-bb-surface p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bb-primary text-xl text-white shadow-sm">
                🎵
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-bb-text">Sangeet Special</p>
                <p className="text-xs text-bb-muted">Now playing · Track 42</p>
              </div>
              <motion.button
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="bb-btn-primary flex h-10 w-10 items-center justify-center rounded-full p-0"
              >
                <Play className="h-4 w-4 fill-white text-white" />
              </motion.button>
            </div>
            <div className="mt-3 flex h-8 items-end justify-center gap-1">
              {Array.from({ length: 24 }, (_, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-bb-primary/40"
                  animate={isActive ? { height: [6, 12 + (i % 5) * 4, 6] } : { height: 6 }}
                  transition={{ duration: 0.8 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.04 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroWalletVisual({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle,rgba(232,185,49,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="animate-hero-float relative">
        <div className="relative overflow-hidden rounded-[22px] border border-bb-border bg-bb-elevated p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-gold">Star Wallet</p>
              <p className="mt-1 text-xs text-bb-muted">Your party currency</p>
            </div>
            <span className="rounded-full bg-bb-success/10 px-2.5 py-1 text-[10px] font-bold text-bb-success">
              +30 Bonus
            </span>
          </div>

          <div className="relative mt-6 text-center">
            <motion.div
              animate={isActive ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-flex items-baseline gap-2"
            >
              <span className="text-6xl font-black tabular-nums text-bb-text">30</span>
              <span className="text-lg font-semibold text-bb-gold">Stars</span>
            </motion.div>
            <p className="mt-1 text-xs text-bb-muted">Welcome bonus unlocked</p>
          </div>

          <div className="mt-6 grid gap-2.5">
            {[
              { label: "Welcome Bonus", value: "+30", icon: "🎁", highlight: true },
              { label: "Create Room", value: "10 ★", icon: "🏠", highlight: false },
              { label: "Join Room", value: "5 ★", icon: "🚪", highlight: false },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={false}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 8 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                  row.highlight ? "border border-bb-gold/25 bg-bb-gold/5" : "border border-bb-border bg-bb-surface"
                }`}
              >
                <span className="flex items-center gap-2 text-sm text-bb-muted">
                  <span>{row.icon}</span> {row.label}
                </span>
                <span className={`text-sm font-bold ${row.highlight ? "text-bb-gold" : "text-bb-text"}`}>
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroLobbyVisual({ isActive }: { isActive: boolean }) {
  const fillPercent = 40;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,77,126,0.07)_0%,transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div className="animate-hero-float relative">
        <div className="relative overflow-hidden rounded-[22px] border border-bb-border bg-bb-elevated p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bb-success/30 bg-bb-success/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-bb-success">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bb-success opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-bb-success" />
              </span>
              Live Now
            </span>
            <motion.span
              animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-1 text-xs font-bold text-bb-primary"
            >
              <Clock className="h-3.5 w-3.5" /> Starting in 0:42
            </motion.span>
          </div>

          <p className="mt-4 text-xl font-black text-bb-text">Diwali Kitty Brunch</p>
          <p className="mt-1 text-xs text-bb-muted">48 / 120 players · Sangeet theme</p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bb-surface">
            <motion.div
              className="h-full rounded-full bg-bb-primary"
              animate={isActive ? { width: [`${fillPercent}%`, `${fillPercent + 5}%`, `${fillPercent}%`] } : { width: `${fillPercent}%` }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex -space-x-2">
              {["A", "M", "R", "P", "N"].map((initial, i) => (
                <motion.span
                  key={initial}
                  initial={false}
                  animate={isActive ? { scale: [0, 1], opacity: [0, 1] } : {}}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bb-elevated bg-bb-primary text-xs font-bold text-white shadow-sm"
                >
                  {initial}
                </motion.span>
              ))}
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bb-elevated bg-bb-surface text-[10px] font-bold text-bb-muted">
                +43
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-bb-muted">
              <Users className="h-3.5 w-3.5 text-bb-primary" />
              Joining live
            </div>
          </div>

          <div className="mt-5 space-y-2 rounded-2xl border border-bb-border bg-bb-surface p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-bb-muted">
              <Zap className="h-3 w-3 text-bb-gold" /> Party Chat
            </p>
            {CHAT_MESSAGES.map((msg, i) => (
              <motion.p
                key={msg.user}
                initial={false}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="text-xs text-bb-text"
              >
                <span className="font-bold" style={{ color: msg.color }}>{msg.user}:</span> {msg.text}
              </motion.p>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-bb-primary/5 py-2.5">
            <Check className="h-4 w-4 text-bb-primary" />
            <span className="text-xs font-semibold text-bb-text">3 friends already in this room</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type HeroSlideVisualsProps = {
  visual: HeroSlideVisual;
  isActive: boolean;
  liveCard?: LiveBingoCardProps;
};

export function HeroSlideVisuals({ visual, isActive, liveCard }: HeroSlideVisualsProps) {
  if (visual === "bingo") {
    return <LiveBingoCard {...liveCard} />;
  }
  if (visual === "playlist") {
    return <HeroPlaylistVisual isActive={isActive} />;
  }
  if (visual === "wallet") {
    return <HeroWalletVisual isActive={isActive} />;
  }
  return <HeroLobbyVisual isActive={isActive} />;
}
