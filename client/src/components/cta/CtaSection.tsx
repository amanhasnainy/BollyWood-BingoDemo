import { motion } from "framer-motion";
import { Gamepad2, Star } from "lucide-react";
import { CtaBingoBalls } from "./CtaBingoBalls";
import { CtaConfetti } from "./CtaConfetti";

type CtaSectionProps = {
  onCreateRoom: () => void;
};

export function CtaSection({ onCreateRoom }: CtaSectionProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-bb-bg px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
      data-testid="section-cta"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,29,74,0.06),transparent)]"
        aria-hidden="true"
      />

      <CtaBingoBalls />
      <CtaConfetti />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <h2 className="text-3xl font-black leading-tight tracking-tight text-bb-text sm:text-4xl lg:text-5xl">
          Ready to Play{" "}
          <span className="text-bb-primary">
            Bollywood Bingo?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-md text-base text-bb-muted sm:text-lg">
          Create a room or join thousands of players online.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.button
            type="button"
            onClick={onCreateRoom}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-cta-create-room"
            className="bb-btn-primary min-h-12 w-full gap-2 px-8 text-sm sm:w-auto"
          >
            <Star className="h-4 w-4 fill-current" />
            Create Room
          </motion.button>

          <motion.button
            type="button"
            onClick={() => scrollTo("live-rooms")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-cta-join-room"
            className="bb-btn-ghost min-h-12 w-full gap-2 px-8 text-sm sm:w-auto"
          >
            <Gamepad2 className="h-4 w-4" />
            Join Live Room
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
