import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import { HeroSlide } from "./HeroSlide";
import { heroSlides } from "./heroSlidesData";
import type { LiveBingoCardProps } from "./LiveBingoCard";

const AUTOPLAY_DELAY_MS = 3000;

type HeroSectionProps = {
  liveCard?: LiveBingoCardProps;
};

export function HeroSection({ liveCard }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const directionRef = useRef<1 | -1>(1);

  const syncDirection = useCallback((swiper: SwiperType) => {
    const maxIndex = swiper.slides.length - 1;
    if (swiper.activeIndex >= maxIndex) directionRef.current = -1;
    else if (swiper.activeIndex <= 0) directionRef.current = 1;
  }, []);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.activeIndex);
      syncDirection(swiper);
    },
    [syncDirection],
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const swiper = swiperRef.current;
      if (!swiper || swiper.slides.length <= 1) return;

      const maxIndex = swiper.slides.length - 1;
      const currentIndex = swiper.activeIndex;

      if (directionRef.current === 1 && currentIndex >= maxIndex) {
        directionRef.current = -1;
      } else if (directionRef.current === -1 && currentIndex <= 0) {
        directionRef.current = 1;
      }

      if (directionRef.current === 1) swiper.slideNext();
      else swiper.slidePrev();
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="hero"
      className="relative bg-[#1B1330] text-white"
      data-testid="section-hero"
    >
      {/* Decorative Golden Bulb Dots Line with spacing below Navbar bottom border */}
      <div className="absolute top-0.8 left-0 right-0 z-20 flex w-full items-center justify-between overflow-hidden px-4 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="animate-bulb-twinkle h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8A93B]"
            style={{ animationDelay: `${(i % 6) * 0.35}s` }}
          />
        ))}
      </div>
      <Swiper
        modules={[Pagination]}
        speed={700}
        loop={false}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.activeIndex);
        }}
        onSlideChange={handleSlideChange}
        className="hero-swiper min-h-[90vh]"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <HeroSlide
              slide={slide}
              isActive={activeIndex === index}
              liveCard={slide.visual === "bingo" ? liveCard : undefined}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-pagination absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2" />
    </section>
  );
}
