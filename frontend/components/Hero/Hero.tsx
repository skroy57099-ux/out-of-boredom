"use client";
import HeroBoreCard from "@/components/BORE/UI/HeroBoreCard";
import HeroContent from "./HeroContent";
import HeroButtons from "./HeroButtons";
import HeroBackground from "../Background/HeroBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 py-16">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-20">

        <div className="max-w-3xl space-y-10">
          <HeroContent />
          <HeroButtons />
        </div>

        <HeroBoreCard />
      </div>
    </section>
  );
}
