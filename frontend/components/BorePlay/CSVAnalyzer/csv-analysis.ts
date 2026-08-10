import type {
  CSVRow,
  ColumnAnalysis,
  ColumnType,
  DatasetAnalysis,
  NumericStatistics,
  ColumnValueFrequency,
} from "./csv-types";

function isMissing(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

function isNumericValue(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  // Preserve values such as 00123 as text.
  if (/^0\d+$/.test(trimmed)) {
    return false;
  }

  const number = Number(trimmed);

  return Number.isFinite(number);
}

function isDateValue(value: string): boolean {
  const trimmed = value.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    return true;
  }

  // DD-MM-YYYY / DD/MM/YYYY
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(trimmed)) {
    return true;
  }

  return false;
}

function inferColumnType(values: string[]): ColumnType {
  const nonMissingValues = values.filter(
    (value) => !isMissing(value)
  );

  if (nonMissingValues.length === 0) {
    return "text";
  }

  const numericCount = nonMissingValues.filter(
    isNumericValue
  ).length;

  if (numericCount === nonMissingValues.length) {
    return "number";
  }

  const dateCount = nonMissingValues.filter(
    isDateValue
  ).length;

  if (dateCount === nonMissingValues.length) {
    return "date";
  }

  return "text";
}

function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort(
    (a, b) => a - b
  );

  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (
      (sorted[middle - 1] + sorted[middle]) / 2
    );
  }

  return sorted[middle];
}

function calculateStandardDeviation(
  values: number[]
): number {
  if (values.length === 0) {
    return 0;
  }

  const mean =
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  const squaredDifferences = values.map(
    (value) =>
      Math.pow(value - mean, 2)
  );

  const variance =
    squaredDifferences.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  return Math.sqrt(variance);
}

function calculateNumericStatistics(
  values: string[]
): NumericStatistics {
  const numbers = values
    .filter((value) => !isMissing(value))
    .map((value) => Number(value))
    .filter((value) =>
      Number.isFinite(value)
    );

  if (numbers.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      standardDeviation: 0,
    };
  }

  const mean =
    numbers.reduce(
      (sum, value) => sum + value,
      0
    ) / numbers.length;

  return {
    count: numbers.length,
    mean,
    median: calculateMedian(numbers),
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    standardDeviation:
      calculateStandardDeviation(numbers),
  };
}

function calculateTopValues(
  values: string[]
): ColumnValueFrequency[] {
  const nonMissingValues = values.filter(
    (value) => !isMissing(value)
  );

  if (nonMissingValues.length === 0) {
    return [];
  }

  const frequencyMap = new Map<
    string,
    number
  >();

  for (const value of nonMissingValues) {
    frequencyMap.set(
      value,
      (frequencyMap.get(value) ?? 0) + 1
    );
  }

  return Array.from(
    frequencyMap.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([value, count]) => ({
      value,
      count,
      percentage:
        (count / nonMissingValues.length) *
        100,
    }));
}

function calculateDateRange(
  values: string[]
): {
  earliest: string;
  latest: string;
} | undefined {
  const dates = values
    .filter((value) => !isMissing(value))
    .filter(isDateValue)
    .map((value) => {
      const parts = value
        .trim()
        .split(/[-/]/)
        .map(Number);

      if (parts.length !== 3) {
        return null;
      }

      let date: Date;

      // YYYY-MM-DD
      if (
        /^\d{4}-\d{1,2}-\d{1,2}$/.test(
          value.trim()
        )
      ) {
        date = new Date(
          parts[0],
          parts[1] - 1,
          parts[2]
        );
      } else {
        // DD-MM-YYYY / DD/MM/YYYY
        date = new Date(
          parts[2],
          parts[1] - 1,
          parts[0]
        );
      }

      if (Number.isNaN(date.getTime())) {
        return null;
      }

      return date;
    })
    .filter(
      (date): date is Date =>
        date !== null
    );

  if (dates.length === 0) {
    return undefined;
  }

  const timestamps = dates.map(
    (date) => date.getTime()
  );

  const earliest = new Date(
    Math.min(...timestamps)
  );

  const latest = new Date(
    Math.max(...timestamps)
  );

  const formatDate = (date: Date) =>
    date.toISOString().slice(0, 10);

  return {
    earliest: formatDate(earliest),
    latest: formatDate(latest),
  };
}

function createColumnAnalysis(
  headers: string[],
  rows: CSVRow[]
): ColumnAnalysis[] {
  return headers.map((header) => {
    const values = rows.map(
      (row) => row[header] ?? ""
    );

    const nullCount = values.filter(
      isMissing
    ).length;

    const nonMissingValues = values.filter(
      (value) => !isMissing(value)
    );

    const uniqueValues = new Set(
      nonMissingValues
    ).size;

    const type = inferColumnType(values);

    const uniquePercentage =
      rows.length > 0
        ? (uniqueValues / rows.length) * 100
        : 0;

    const columnAnalysis: ColumnAnalysis = {
      name: header,
      type,

      nullCount,

      nullPercentage:
        rows.length > 0
          ? (nullCount / rows.length) *
            100
          : 0,

      uniqueValues,

      uniquePercentage,

      totalValues: rows.length,
    };

    if (type === "number") {
      columnAnalysis.statistics =
        calculateNumericStatistics(
          values
        );
    }

    if (type === "text") {
      columnAnalysis.topValues =
        calculateTopValues(values);
    }

    if (type === "date") {
      columnAnalysis.dateRange =
        calculateDateRange(values);
    }

    return columnAnalysis;
  });
}

function countDuplicateRows(
  headers: string[],
  rows: CSVRow[]
): number {
  const seen = new Set<string>();
  let duplicates = 0;

  for (const row of rows) {
    const rowKey = JSON.stringify(
      headers.map(
        (header) => row[header] ?? ""
      )
    );

    if (seen.has(rowKey)) {
      duplicates++;
    } else {
      seen.add(rowKey);
    }
  }

  return duplicates;
}

export function analyzeCSV(
  headers: string[],
  rows: CSVRow[]
): DatasetAnalysis {
  const totalRows = rows.length;
  const totalColumns = headers.length;
  const totalCells =
    totalRows * totalColumns;

  const columnAnalysis =
    createColumnAnalysis(
      headers,
      rows
    );

  const missingCells =
    columnAnalysis.reduce(
      (total, column) =>
        total + column.nullCount,
      0
    );

  const rowsWithMissingValues =
    rows.filter((row) =>
      headers.some((header) =>
        isMissing(row[header])
      )
    ).length;

  const duplicateRows =
    countDuplicateRows(
      headers,
      rows
    );

  const columnsWithMissingValues =
    columnAnalysis.filter(
      (column) =>
        column.nullCount > 0
    ).length;

  return {
    rows: totalRows,
    columns: totalColumns,
    totalCells,

    missingCells,

    missingCellPercentage:
      totalCells > 0
        ? (missingCells / totalCells) *
          100
        : 0,

    rowsWithMissingValues,

    rowsWithMissingValuesPercentage:
      totalRows > 0
        ? (rowsWithMissingValues /
            totalRows) *
          100
        : 0,

    duplicateRows,

    duplicateRowsPercentage:
      totalRows > 0
        ? (duplicateRows / totalRows) *
          100
        : 0,

    columnsWithMissingValues,

    columnAnalysis,
  };
}