"use client";

import { Bot } from "lucide-react";

interface BoreButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function BoreButton({
  isOpen,
  onClick,
}: BoreButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open BORE"
      className={`
        fixed
        bottom-6
        right-6
        z-50

        flex
        items-center
        justify-center

        h-16
        w-16

        rounded-full

        border
        border-cyan-500/30

        bg-slate-900/90
        backdrop-blur-md

        shadow-lg
        shadow-cyan-500/20

        transition-all
        duration-300

        hover:scale-110
        hover:border-cyan-400
        hover:shadow-cyan-400/40

        active:scale-95
      `}
    >
      {/* Online Indicator */}
      <span
        className="
          absolute
          top-2
          right-2

          h-3
          w-3

          rounded-full
          bg-emerald-400

          ring-2
          ring-slate-900
        "
      />

      <Bot
        size={28}
        className={`
          transition-transform
          duration-300
          ${isOpen ? "rotate-12" : ""}
        `}
      />
    </button>
  );
}
