"use client";

import { useState } from "react";

import type { NotebookCell } from "../Types/notebook";

import {
  getPracticeCells,
  setPracticeCells,
} from "../State/PythonPlaygroundStore";

function createNewCell(): NotebookCell {
  return {
    id: crypto.randomUUID(),

    code: "",

    output: "",

    error: null,

    executionTime: 0,

    plots: [],
  };
}

function createDefaultCell(): NotebookCell {
  return {
    id: crypto.randomUUID(),

    code: `print("Hello, BORE!")`,

    output: "",

    error: null,

    executionTime: 0,

    plots: [],
  };
}

export default function useNotebook() {
  const [cells, setCells] = useState<NotebookCell[]>(
    () => {
      const savedCells = getPracticeCells();

      if (savedCells && savedCells.length > 0) {
        return savedCells;
      }

      const initialCells = [
        createDefaultCell(),
      ];

      setPracticeCells(initialCells);

      return initialCells;
    }
  );

  const addCell = () => {
    setCells((prev) => {
      const updated = [
        ...prev,
        createNewCell(),
      ];

      setPracticeCells(updated);

      return updated;
    });
  };

  const updateCell = (
    id: string,
    updates: Partial<NotebookCell>
  ) => {
    setCells((prev) => {
      const updated = prev.map((cell) =>
        cell.id === id
          ? {
              ...cell,
              ...updates,
            }
          : cell
      );

      setPracticeCells(updated);

      return updated;
    });
  };

  return {
    cells,
    addCell,
    updateCell,
  };
}