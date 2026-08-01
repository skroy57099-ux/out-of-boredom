"use client";

export default function BackgroundGlow() {
  return (
    <div
      className="
        absolute
        right-[8%]
        top-1/2
        -translate-y-1/2
        h-[500px]
        w-[500px]
        rounded-full
        blur-3xl
      "
      style={{
        background:
          "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.08) 35%, transparent 75%)",
      }}
    />
  );
}

