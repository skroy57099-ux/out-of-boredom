"use client";

export default function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div className="crt-scanlines" />
      </div>

      {/* Screen Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl bg-lime-400/5 mix-blend-screen" />

      {/* Screen Vignette */}
      <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_100px_rgba(0,0,0,0.65)]" />

      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none crt-noise opacity-20" />
    </>
  );
}
