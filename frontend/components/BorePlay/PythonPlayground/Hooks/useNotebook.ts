"use client";

import { useState } from "react";
import type { NotebookCell } from "../Types/notebook";

const defaultCell: NotebookCell = {
  id: crypto.randomUUID(),

  code: `print("Hello, BORE!")`,

  output: "",

  error: null,

  executionTime: 0,
};

export default function useNotebook() {
  const [cells, setCells] = useState<NotebookCell[]>([
    defaultCell,
  ]);

  const addCell = () => {
    setCells((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        code: "",
        output: "",
        error: null,
        executionTime: 0,
      },
    ]);
  };

  const updateCell = (
    id: string,
    updates: Partial<NotebookCell>
  ) => {
    setCells((prev) =>
      prev.map((cell) =>
        cell.id === id
          ? { ...cell, ...updates }
          : cell
      )
    );
  };

  return {
    cells,
    addCell,
    updateCell,
  };
}