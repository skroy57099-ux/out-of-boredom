"use client";

import Image from "next/image";

import PixelExpression from "./PixelExpression";
import CRTOverlay from "./CRTOverlay";

import { useAvatarController } from "../Avatar/hooks/useAvatarController";

import styles from "./avatar.module.css";

interface BoreAvatarProps {
  size?: "sm" | "md" | "lg";
}

export default function BoreAvatar({
  size = "md",
}: BoreAvatarProps) {
  const { animation, expression } = useAvatarController();

  return (
    <div
      className={`
        ${styles.avatar}
        ${styles[size]}
        ${animation ? styles[animation] : ""}
      `}
    >
      {/* Soft Glow */}
      <div
        className="
          absolute
          inset-0
          -z-10
          rounded-full
          bg-cyan-400/10
          blur-3xl
          scale-90
        "
      />

      {/* Skull */}
      <Image
        src="/bore/bore-face-00.png"
        alt="BORE"
        fill
        priority
         className="
          object-contain
          pointer-events-none
          select-none
          relative
          z-10
        "
      />

      {/* LED Face */}
      <PixelExpression expression={expression} />

      {/* CRT Screen */}
      <CRTOverlay />
    </div>
  );
}
