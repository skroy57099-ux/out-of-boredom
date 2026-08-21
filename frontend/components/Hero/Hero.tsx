"use client";

import HeroBoreCard from "@/components/BORE/UI/HeroBoreCard";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroBackground from "../Background/HeroBackground";

export default function Hero() {
  return (
    <section
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden

        px-4
        py-16

        sm:px-6
        sm:py-20
      "
    >
      <HeroBackground />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-7xl

          flex-col
          items-center
          justify-center

          gap-12

          lg:flex-row
          lg:items-center
          lg:justify-between
          lg:gap-16
        "
      >
        {/* ==================================================
            HERO CONTENT
            ================================================== */}

        <div
          className="
            w-full
            max-w-3xl

            space-y-8

            text-center

            lg:text-left
            lg:space-y-10
          "
        >
          <HeroContent />

          <HeroButtons />
        </div>

        {/* ==================================================
            BORE HERO CARD
            ================================================== */}

        <div
          className="
            flex
            w-full
            justify-center

            lg:w-auto
            lg:shrink-0
          "
        >
          <HeroBoreCard />
        </div>
      </div>
    </section>
  );
}