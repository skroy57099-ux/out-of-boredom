"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import engine from "../Engine/SQLJSEngine";
import { sampleData } from "../Data/sampleData";

type TableName = keyof typeof sampleData;

export function useSQLPlayground() {
  const [query, setQuery] = useState(`SELECT *
FROM customers
WHERE city = 'Delhi';`);

  const [history, setHistory] = useState<
    {
      query: string;
      time: string;
    }[]
  >([]);

  const [selectedTable, setSelectedTable] =
    useState<TableName>("customers");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<
    Record<string, unknown>[]
  >([]);

  const [executionTime, setExecutionTime] =
    useState(0);

  const [rowsReturned, setRowsReturned] =
    useState(0);

  const [error, setError] =
    useState<string | null>(null);

  const setupPromise = useRef<
    Promise<void> | null
  >(null);

  // Initialize SQL.js once

  useEffect(() => {
    setupPromise.current = engine.initialize();

    setupPromise.current.catch((err) => {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Initialization failed"
      );
    });
  }, []);

  // Execute SQL

  const runQuery = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      if (setupPromise.current) {
        await setupPromise.current;
      }

      const start = performance.now();

      const rows = await engine.runQuery(query);

      setHistory((prev) =>
        [
          {
            query: query.trim(),
            time: new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          },

          ...prev.filter(
            (item) =>
              item.query !== query.trim()
          ),
        ].slice(0, 20)
      );

      setResult(rows);

      setRowsReturned(rows.length);

      setExecutionTime(
        Math.round(
          performance.now() - start
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Query failed"
      );

      setResult([]);

      setRowsReturned(0);

      setExecutionTime(0);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return {
    query,
    setQuery,

    selectedTable,
    setSelectedTable,

    loading,
    setLoading,

    result,
    setResult,

    executionTime,
    setExecutionTime,

    rowsReturned,
    setRowsReturned,

    history,
    setHistory,

    error,
    setError,

    runQuery,
  };
}