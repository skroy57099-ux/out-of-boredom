"use client";

import { useState } from "react";

import CsvUploader from "@/components/BorePlay/CSVAnalyzer/CsvUploader";
import DatasetOverview from "@/components/BorePlay/CSVAnalyzer/DatasetOverview";
import DataQuality from "@/components/BorePlay/CSVAnalyzer/DataQuality";
import DataPreview from "@/components/BorePlay/CSVAnalyzer/DataPreview";
import ColumnExplorer from "@/components/BorePlay/CSVAnalyzer/ColumnExplorer";
import GoalSelector from "@/components/BorePlay/CSVAnalyzer/GoalSelector";
import GoalInsights from "@/components/BorePlay/CSVAnalyzer/GoalInsights";
import Recommendations from "@/components/BorePlay/CSVAnalyzer/Recommendations";
import CodeFixes from "@/components/BorePlay/CSVAnalyzer/CodeFixes";
import CSVVisualizations from "@/components/BorePlay/CSVAnalyzer/CSVVisualizations";
import DatasetComparison from "@/components/BorePlay/CSVAnalyzer/DatasetComparison";

import { analyzeCSV } from "@/components/BorePlay/CSVAnalyzer/csv-analysis";
import { interpretForGoal } from "@/components/BorePlay/CSVAnalyzer/csv-interpretation";
import { getRecommendations } from "@/components/BorePlay/CSVAnalyzer/csv-recommendations";

import type {
  AnalysisGoal,
  DatasetAnalysis,
  ParsedDataset,
} from "@/components/BorePlay/CSVAnalyzer/csv-types";

export default function CSVAnalyzerPage() {
  const [dataset, setDataset] =
    useState<ParsedDataset | null>(null);

  const [previousAnalysis, setPreviousAnalysis] =
    useState<DatasetAnalysis | null>(null);

  const [selectedGoal, setSelectedGoal] =
    useState<AnalysisGoal>("exploration");

  const handleDatasetLoaded = (
    data: ParsedDataset
  ) => {
    /*
     * If a dataset already exists, analyze it before
     * replacing it. This becomes our "before" dataset.
     */
    if (dataset) {
      const currentAnalysis = analyzeCSV(
        dataset.headers,
        dataset.rows
      );

      setPreviousAnalysis(currentAnalysis);
    }

    setDataset(data);
    setSelectedGoal("exploration");
  };

  const handleReset = () => {
    setDataset(null);
    setPreviousAnalysis(null);
    setSelectedGoal("exploration");
  };

  const analysis = dataset
    ? analyzeCSV(
        dataset.headers,
        dataset.rows
      )
    : null;

  const goalAnalysis = analysis
    ? interpretForGoal(
        analysis,
        selectedGoal
      )
    : null;

  const recommendations = analysis
    ? getRecommendations(
        analysis,
        selectedGoal
      )
    : [];

  return (
    <main className="min-h-screen bg-black text-white">
      {!dataset ? (
        <CsvUploader
          onDatasetLoaded={handleDatasetLoaded}
        />
      ) : (
        <div className="space-y-0">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                CSV Analyzer
              </h1>

              <p className="mt-1 text-sm text-white/50">
                {dataset.fileName}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-fit rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Upload another CSV
            </button>
          </div>

          {/* Dataset Overview */}
          {analysis && (
            <DatasetOverview
              dataset={dataset}
              analysis={analysis}
            />
          )}

          {/* Data Quality */}
          {analysis && (
            <DataQuality
              analysis={analysis}
            />
          )}

          {/* Goal Selector */}
          {analysis && (
            <GoalSelector
              selectedGoal={selectedGoal}
              onGoalChange={setSelectedGoal}
            />
          )}

          {/* Goal-Based Insights */}
          {goalAnalysis && (
            <GoalInsights
              result={goalAnalysis}
            />
          )}

          {/* Recommended Actions */}
          {analysis && (
            <Recommendations
              recommendations={recommendations}
            />
          )}

          {/* Python Fixes */}
          {analysis && (
            <CodeFixes
              analysis={analysis}
            />
          )}

          {/* Before / After Comparison */}
          {analysis && previousAnalysis && (
            <DatasetComparison
              before={previousAnalysis}
              after={analysis}
            />
          )}

          {/* Data Preview */}
          <DataPreview
            headers={dataset.headers}
            rows={dataset.rows}
          />

          {/* Column Explorer */}
          {analysis && (
            <ColumnExplorer
              columns={analysis.columnAnalysis}
            />
          )}

          {/* Visual Analysis */}
          {analysis && (
            <CSVVisualizations
              headers={dataset.headers}
              rows={dataset.rows}
              columns={analysis.columnAnalysis}
            />
          )}
        </div>
      )}
    </main>
  );
}