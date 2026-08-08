"use client";

import { Plus } from "lucide-react";

interface ToolbarProps {
  addCell: () => void;
}

export default function Toolbar({
  addCell,
}: ToolbarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-white/10 bg-[#161B22] px-6">

      <h1 className="text-lg font-semibold text-white">
        Practice Mode
      </h1>

      <button
        onClick={addCell}
        className="flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
      >
        <Plus size={16} />

        New Cell
      </button>

    </div>
  );
}