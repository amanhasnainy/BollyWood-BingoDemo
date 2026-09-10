import { motion } from "framer-motion";
import type { HowItWorksStep } from "./howItWorksData";

type HowItWorksStepCardProps = {
  step: HowItWorksStep;
  index: number;
};

export function HowItWorksStepCard({ step, index }: HowItWorksStepCardProps) {
  const { step: stepNum, emoji, title, description, tag } = step;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Step Number Oval Badge */}
      <span className="font-serif text-[11px] font-extrabold text-[#C58823] bg-[#FAF2E6] border border-[#E8D9C5] px-2.5 py-0.5 rounded-full w-fit mb-4">
        {stepNum}
      </span>

      {/* Sindoor Red Squircle Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C81D4A] text-white shadow-md shadow-[#C81D4A]/15 mb-4">
        <span className="text-2xl">{emoji}</span>
      </div>

      {/* Title & Description */}
      <h3 className="font-serif text-lg font-bold text-[#1B1330]">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-[#1B1330]/70 max-w-[250px]">{description}</p>

      {/* Bottom Tag Pill */}
      <div className="mt-auto pt-5">
        <span className="inline-flex items-center rounded-full border border-[#E8D9C5] bg-[#FAF2E6] px-3 py-1 text-[11px] font-bold text-[#C58823]">
          {tag}
        </span>
      </div>
    </motion.article>
  );
}
