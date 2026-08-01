"use client";

import BackgroundGrid from "./BackgroundGrid";
import BackgroundGlow from "./BackgroundGlow";
import BackgroundParticles from "./BackgroundParticles";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <BackgroundGrid />
      <BackgroundGlow />
      <BackgroundParticles />
    </div>
  );
}