"use client";

import { Database } from "lucide-react";

interface DatasetExplorerProps {
  onDatasetSelect?: (code: string) => void;
}

const columns = [
  "OrderID",
  "OrderDate",
  "CustomerID",
  "CustomerName",
  "ProductID",
  "ProductName",
  "Category",
  "Brand",
  "Quantity",
  "Rating",
  "Price",
  "State",
  "Country",
  "SellerID",
];

const amazonStarterCode = `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")
`;

export default function DatasetExplorer({
  onDatasetSelect,
}: DatasetExplorerProps) {
  const handleDatasetClick = () => {
    onDatasetSelect?.(amazonStarterCode);
  };

  return (
    <aside className="min-h-0 border-r border-white/10 bg-[#080B0F]">
      <div className="flex h-full flex-col">

        {/* Header */}
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Database
              size={18}
              className="text-cyan-400"
            />

            <span className="font-semibold text-white">
              Dataset
            </span>
          </div>
        </div>

        {/* Dataset Explorer */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">

          {/* Amazon Dataset */}
          <button
            type="button"
            onClick={handleDatasetClick}
            className="mb-4 w-full rounded-lg bg-cyan-500/10 px-3 py-3 text-left transition hover:bg-cyan-500/20"
          >
            <div className="text-sm font-medium text-cyan-400">
              Amazon Sample
            </div>

            <div className="mt-1 text-xs text-gray-500">
              Amazon_sample.csv
            </div>

            <div className="mt-2 text-[11px] text-gray-600">
              Click to load dataset
            </div>
          </button>

          {/* Columns */}
          <div className="space-y-1">
            {columns.map((column) => (
              <div
                key={column}
                className="rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
              >
                {column}
              </div>
            ))}

            <div className="px-3 py-2 text-xs text-gray-600">
              + more columns
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}