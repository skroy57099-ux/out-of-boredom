import { getPyodide } from "./pyodide";

export interface PythonResult {
  output: string;
  error: string | null;
  executionTime: number;
  plots: string[];
}

export async function runPython(
  code: string
): Promise<PythonResult> {
  const pyodide = getPyodide();

  if (!pyodide) {
    throw new Error("Python runtime is not initialized.");
  }

  const start = performance.now();

  try {
    let output = "";

    /*
     * Configure Matplotlib for notebook-style rendering.
     *
     * Agg renders figures in memory instead of opening
     * its own browser figure window.
     */
    await pyodide.runPythonAsync(`
import matplotlib
matplotlib.use("Agg", force=True)
`);

    /*
     * Capture normal stdout.
     */
    pyodide.setStdout({
      batched: (text: string) => {
        output += text + "\n";
      },
    });

    /*
     * Run user's Python code.
     */
    const result = await pyodide.runPythonAsync(code);

    /*
     * Capture returned Python expressions such as:
     *
     *     df.head()
     *     df.describe()
     *
     * before collecting Matplotlib figures.
     */
    if (
      result !== undefined &&
      result !== null
    ) {
      output += String(result);
    }

    /*
     * Release Python proxy when possible.
     */
    if (
      result &&
      typeof result.destroy === "function"
    ) {
      result.destroy();
    }

    /*
     * Convert all currently open Matplotlib figures
     * into PNG data URLs.
     */
    const plotsJson = await pyodide.runPythonAsync(`
import io
import base64
import json
import matplotlib.pyplot as plt

_plots = []

for _fig_num in plt.get_fignums():
    _fig = plt.figure(_fig_num)

    _buffer = io.BytesIO()

    _fig.savefig(
        _buffer,
        format="png",
        bbox_inches="tight",
        dpi=120
    )

    _buffer.seek(0)

    _encoded = base64.b64encode(
        _buffer.read()
    ).decode("ascii")

    _plots.append(
        "data:image/png;base64," + _encoded
    )

    plt.close(_fig)

json.dumps(_plots)
`);

    const plots: string[] =
      plotsJson
        ? JSON.parse(String(plotsJson))
        : [];

    return {
      output,
      error: null,
      plots,
      executionTime:
        performance.now() - start,
    };

  } catch (error) {
    return {
      output: "",
      error:
        error instanceof Error
          ? error.message
          : String(error),
      plots: [],
      executionTime:
        performance.now() - start,
    };
  }
}