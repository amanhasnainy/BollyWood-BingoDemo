import { HowItWorksStepCard } from "./HowItWorksStepCard";
import { howItWorksSteps } from "./howItWorksData";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[#FBF3E7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-[#1B1330]"
      data-testid="section-how-it-works"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#C81D4A]">
            EASY TO PLAY
          </span>

          <h2 className="mt-2 font-serif text-3xl font-extrabold leading-tight text-[#1B1330] sm:text-4xl lg:text-5xl">
            Four steps to your first full house
          </h2>

          <p className="mt-3 text-sm text-[#1B1330]/70 leading-relaxed max-w-md mx-auto">
            From sign-up to shouting &quot;Bingo!&quot; in under a minute.
          </p>
        </div>

        {/* Filmstrip / Dashed Line Track */}
        <div className="my-10 flex w-full items-center justify-between overflow-hidden opacity-90" aria-hidden="true">
          {Array.from({ length: 44 }).map((_, i) => (
            <span key={i} className="h-3.5 w-1.5 shrink-0 rounded-[2px] bg-[#1B1330]" />
          ))}
        </div>

        {/* 4 Columns Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {howItWorksSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col h-full ${
                index > 0 ? "lg:border-l lg:border-[#E8D9C5] lg:pl-8" : ""
              } ${index < howItWorksSteps.length - 1 ? "lg:pr-8" : ""}`}
            >
              <HowItWorksStepCard step={step} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
