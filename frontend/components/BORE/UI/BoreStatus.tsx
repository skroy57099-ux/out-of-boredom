"use client";

interface BoreStatusProps {
  status?: "online" | "thinking" | "searching" | "navigating";
}

export default function BoreStatus({
  status = "online",
}: BoreStatusProps) {
  const statusMap = {
    online: {
      label: "Online",
      color: "bg-emerald-400",
    },
    thinking: {
      label: "Thinking...",
      color: "bg-cyan-400 animate-pulse",
    },
    searching: {
      label: "Searching...",
      color: "bg-amber-400 animate-pulse",
    },
    navigating: {
      label: "Opening...",
      color: "bg-violet-400 animate-pulse",
    },
  };

  const current = statusMap[status];

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${current.color}`}
      />

      <span className="text-xs font-medium text-slate-400">
        {current.label}
      </span>
    </div>
  );
}
