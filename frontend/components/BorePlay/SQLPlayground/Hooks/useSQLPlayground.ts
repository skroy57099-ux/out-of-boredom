"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import engine from "../Engine/SQLJSEngine";
import { SQLPlaygroundStore } from "../State/SQLPlaygroundStore";
import { sampleData } from "../Data/sampleData";

type TableName = keyof typeof sampleData;

type SQLMode = "practice" | "challenge";

export function useSQLPlayground(
  mode: SQLMode = "practice"
) {
  const storedState =
    SQLPlaygroundStore.getWorkspace(mode);

  const [query, setQueryState] =
    useState(storedState.query);

  const [history, setHistoryState] =
    useState(storedState.history);

  const [selectedTable, setSelectedTableState] =
    useState<TableName>(
      storedState.selectedTable
    );

  const [loading, setLoadingState] =
    useState(storedState.loading);

  const [result, setResultState] =
    useState(storedState.result);

  const [executionTime, setExecutionTimeState] =
    useState(storedState.executionTime);

  const [rowsReturned, setRowsReturnedState] =
    useState(storedState.rowsReturned);

  const [error, setErrorState] =
    useState(storedState.error);

  const setupPromise = useRef<
    Promise<void> | null
  >(null);

  /*
   * Persisted setters
   */

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);

      if (mode === "challenge") {
        const currentChallenge =
          SQLPlaygroundStore.challengeMeta
            .currentChallenge;

        SQLPlaygroundStore.setChallengeQuery(
          currentChallenge,
          value
        );
      } else {
        SQLPlaygroundStore.practice.query =
          value;
      }
    },
    [mode]
  );

  const setSelectedTable = useCallback(
    (value: TableName) => {
      setSelectedTableState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).selectedTable = value;
    },
    [mode]
  );

  const setLoading = useCallback(
    (value: boolean) => {
      setLoadingState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).loading = value;
    },
    [mode]
  );

  const setResult = useCallback(
    (
      value: Record<string, unknown>[]
    ) => {
      setResultState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).result = value;
    },
    [mode]
  );

  const setExecutionTime = useCallback(
    (value: number) => {
      setExecutionTimeState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).executionTime = value;
    },
    [mode]
  );

  const setRowsReturned = useCallback(
    (value: number) => {
      setRowsReturnedState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).rowsReturned = value;
    },
    [mode]
  );

  const setError = useCallback(
    (value: string | null) => {
      setErrorState(value);

      SQLPlaygroundStore.getWorkspace(
        mode
      ).error = value;
    },
    [mode]
  );

  const setHistory = useCallback(
    (
      value:
        | {
            query: string;
            time: string;
          }[]
        | ((
            prev: {
              query: string;
              time: string;
            }[]
          ) => {
            query: string;
            time: string;
          }[])
    ) => {
      setHistoryState((prev) => {
        const next =
          typeof value === "function"
            ? value(prev)
            : value;

        SQLPlaygroundStore.getWorkspace(
          mode
        ).history = next;

        return next;
      });
    },
    [mode]
  );

  /*
   * Initialize SQL.js once for this mounted hook.
   *
   * The engine itself remains unchanged.
   */

  useEffect(() => {
    setupPromise.current =
      engine.initialize();

    setupPromise.current.catch((err) => {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Initialization failed"
      );
    });
  }, [setError]);

  /*
   * Execute SQL
   */

  const runQuery = useCallback(async () => {
    setLoading(true);

    setError(null);

    try {
      if (setupPromise.current) {
        await setupPromise.current;
      }

      const start = performance.now();

      const rows =
        await engine.runQuery(query);

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
              item.query !==
              query.trim()
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
  }, [
    query,
    setLoading,
    setError,
    setHistory,
    setResult,
    setRowsReturned,
    setExecutionTime,
  ]);

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