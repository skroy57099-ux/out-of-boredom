export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

export interface SQLExecutionResult {
  rows: Record<string, unknown>[];
  executionTime: number;
}