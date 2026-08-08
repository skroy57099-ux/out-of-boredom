declare global {
  interface Window {
    loadPyodide: (config: {
      indexURL: string;
    }) => Promise<any>;
  }
}

let pyodide: any = null;

async function waitForPyodide() {
  while (
    typeof window !== "undefined" &&
    !window.loadPyodide
  ) {
    await new Promise((resolve) =>
      setTimeout(resolve, 100)
    );
  }
}

export async function initializePyodide() {
  if (pyodide) {
    return pyodide;
  }

  console.log("⏳ Waiting for Pyodide...");

  await waitForPyodide();

  console.log("✅ Script Loaded");

  pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/",
  });

  console.log("✅ Runtime Loaded");

  await pyodide.loadPackage([
    "micropip",
    "numpy",
    "pandas",
    "matplotlib",
  ]);

  console.log("✅ Packages Loaded");

  const response = await fetch(
    "/datasets/Amazon_sample.csv"
  );

  const csv = await response.text();

  pyodide.FS.writeFile(
    "Amazon_sample.csv",
    csv
  );

  console.log("✅ Dataset Loaded");

  return pyodide;
}

export function getPyodide() {
  return pyodide;
}