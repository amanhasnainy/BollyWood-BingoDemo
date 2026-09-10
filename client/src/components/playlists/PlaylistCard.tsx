import { motion } from "framer-motion";
import { Clock, Music2, Play } from "lucide-react";
import type { Playlist } from "./playlistsData";

type PlaylistCardProps = {
  playlist: Playlist;
  index: number;
  onPlay: (id: string) => void;
  onPreview: (id: string) => void;
};

export function PlaylistCard({ playlist, index, onPlay, onPreview }: PlaylistCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group"
    >
      <div className="overflow-hidden rounded-2xl border border-bb-border bg-bb-elevated shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="relative aspect-square border-b border-bb-border bg-bb-surface p-6">
          <div className="absolute inset-0 bg-bb-primary/[0.05]" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="text-5xl" aria-hidden="true">
              {playlist.emoji}
            </span>
            <div className="flex items-end justify-between gap-2">
              <p className="text-lg font-bold leading-tight text-bb-text">{playlist.name}</p>
              <motion.button
                type="button"
                onClick={() => onPlay(playlist.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Play ${playlist.name}`}
                data-testid={`button-play-playlist-${playlist.id}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bb-border bg-bb-elevated text-bb-primary opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100"
              >
                <Play className="h-5 w-5 fill-current" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-bb-muted">
            <span className="inline-flex items-center gap-1.5">
              <Music2 className="h-3.5 w-3.5 text-bb-primary" />
              {playlist.songCount} Songs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-bb-muted" />
              {playlist.duration}
            </span>
          </div>

          <div className="mt-4 flex gap-2">
            <motion.button
              type="button"
              onClick={() => onPlay(playlist.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`button-play-playlist-main-${playlist.id}`}
              className="bb-btn-primary flex flex-1 gap-1.5 px-3 py-2.5 text-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Play Playlist
            </motion.button>
            <motion.button
              type="button"
              onClick={() => onPreview(playlist.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`button-preview-playlist-${playlist.id}`}
              className="flex-1 rounded-xl border border-bb-border px-3 py-2.5 text-sm font-semibold text-bb-text transition-all hover:border-bb-primary/40 hover:text-bb-primary"
            >
              Preview
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
