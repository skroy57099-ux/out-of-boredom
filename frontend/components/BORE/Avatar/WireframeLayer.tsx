"use client";

export default function WireframeLayer() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <g
        stroke="#39ff14"
        strokeWidth="0.25"
        fill="none"
        opacity="0.35"
      >
        {/* forehead */}
        <path d="M30 12 L50 8 L70 12" />

        {/* eyes */}
        <path d="M30 35 L40 32 L50 35" />
        <path d="M50 35 L60 32 L70 35" />

        {/* nose */}
        <path d="M50 20 L48 55 L52 55 Z" />

        {/* cheeks */}
        <path d="M20 40 L30 60 L50 70" />
        <path d="M80 40 L70 60 L50 70" />

        {/* jaw */}
        <path d="M30 80 L50 92 L70 80" />
      </g>
    </svg>
  );
}