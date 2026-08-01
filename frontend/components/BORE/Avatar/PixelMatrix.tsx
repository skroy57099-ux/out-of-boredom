"use client";

interface PixelMatrixProps {
  rows: number;
  cols: number;
  pattern: boolean[][];
  pixelSize?: number;

  ledColor?: string;
  glowColor?: string;
}

export default function PixelMatrix({
  rows,
  cols,
  pattern,
  pixelSize = 6,

  ledColor = "#F8FCFF",
  glowColor = "#00D9FF",
}: PixelMatrixProps) {
  return (
    <div
      className="grid gap-[1px]"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
      }}
    >
      {pattern.flat().map((active, index) => (
        <div
          key={index}
          style={{
            width: pixelSize,
            height: pixelSize,

            borderRadius: 1,

            background: active ? ledColor : "rgba(255,255,255,.05)",

            boxShadow: active
              ? `
                0 0 2px ${glowColor},
                0 0 5px ${glowColor},
                0 0 10px ${glowColor}
              `
              : "none",

            opacity: active ? 1 : .08,

            transition:
              "background .15s ease, box-shadow .15s ease, opacity .15s ease",
          }}
        />
      ))}
    </div>
  );
}
