"use client";

interface ChallengeProgressProps {
  current: number;
  total: number;
}

export default function ChallengeProgress({
  current,
  total,
}: ChallengeProgressProps) {
  return (
    <div className="flex items-center gap-3 text-sm">

      <span className="text-gray-400">
        Challenge {current} of {total}
      </span>

      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{
            width: `${(current / total) * 100}%`,
          }}
        />
      </div>

    </div>
  );
}