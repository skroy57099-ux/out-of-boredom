"use client";

import PixelMatrix from "./PixelMatrix";
import { expressions } from "./avatarExpressions";

interface Props {
  expression: keyof typeof expressions;
}

export default function PixelExpression({
  expression,
}: Props) {

  const face = expressions[expression];

  return (
    <>
      {/* Left Eye */}

      <div className="absolute left-[15%] top-[36%]">
        <PixelMatrix
          rows={4}
          cols={8}
          pattern={face.leftEye}
        />
      </div>

      {/* Right Eye */}

      <div className="absolute right-[15%] top-[36%]">
        <PixelMatrix
          rows={4}
          cols={8}
          pattern={face.rightEye}
        />
      </div>

      {/* Mouth */}

      <div className="absolute left-1/2 -translate-x-1/2 top-[79%]">
        <PixelMatrix
          rows={3}
          cols={8}
          pattern={face.mouth}
        />
      </div>

    </>
  );
}
