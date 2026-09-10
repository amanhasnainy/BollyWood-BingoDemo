import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { StarWalletItem } from "./starWalletData";

type StarWalletCardProps = {
  item: StarWalletItem;
  index: number;
};

export function StarWalletCard({ item, index }: StarWalletCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      className="group"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-bb-border bg-bb-elevated p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-bb-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-bb-border bg-bb-surface text-3xl transition-transform duration-300 group-hover:scale-105">
            <span aria-hidden="true">{item.emoji}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-bb-gold/30 bg-bb-gold/10 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 fill-bb-gold text-bb-gold" />
            <span className="text-xs font-bold uppercase tracking-wide text-bb-gold">Stars</span>
          </div>
        </div>

        <h3 className="mt-6 text-lg font-bold text-bb-text">{item.title}</h3>

        <p className="mt-3 flex items-baseline gap-1.5">
          <span className="text-4xl font-black tabular-nums text-bb-gold">{item.stars}</span>
          <span className="text-sm font-semibold text-bb-muted">Stars</span>
        </p>

        <p className="mt-4 text-sm leading-relaxed text-bb-muted">{item.description}</p>
      </div>
    </motion.article>
  );
}
