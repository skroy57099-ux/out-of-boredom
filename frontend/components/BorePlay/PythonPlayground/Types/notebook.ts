export interface NotebookCell {
  id: string;
  code: string;
  output: string;
  error: string | null;
  executionTime: number;
  plots?: string[];
}

export interface Notebook {
  cells: NotebookCell[];
}