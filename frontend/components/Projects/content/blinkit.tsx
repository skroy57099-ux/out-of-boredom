import {
  Target,
  Database,
  Cpu,
  BarChart3,
  Rocket,
} from "lucide-react";

import { Project } from "../types";

type Props = {
  project: Project;
};

export default function BlinkitContent({ project }: Props) {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10">

        {/* Heading */}

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white">
            Technical Overview
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-zinc-400">
            This project demonstrates an end-to-end retail analytics pipeline
            built using SQL Server, Python and Power BI. It includes data
            cleaning, exploratory data analysis, statistical testing,
            interactive dashboard development and business insight generation
            for Blinkit's retail dataset.
          </p>
        </div>

        {/* Objectives */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Target className="text-blue-400" size={20} />
            Objectives
          </h3>

          <ul className="space-y-3 text-zinc-300">
            <li>• Clean and prepare retail sales data for analysis.</li>
            <li>• Perform exploratory data analysis using Python.</li>
            <li>• Identify key sales and customer trends.</li>
            <li>• Build an interactive Power BI dashboard.</li>
            <li>• Generate actionable business insights for decision-making.</li>
          </ul>
        </div>

        {/* Dataset */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Database className="text-emerald-400" size={20} />
            Dataset
          </h3>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold text-white">
                Records
              </p>

              <p className="mt-2 text-zinc-400">
                8,523 Retail Transactions
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold text-white">
                Domain
              </p>

              <p className="mt-2 text-zinc-400">
                Grocery & Retail Analytics
              </p>
            </div>

          </div>
        </div>

        {/* Pipeline */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Cpu className="text-purple-400" size={20} />
            Analytics Pipeline
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "SQL Data Extraction",
              "Data Cleaning",
              "EDA",
              "Statistical Analysis",
              "Feature Engineering",
              "Power BI Dashboard",
              "Business Insights",
            ].map((step) => (
              <span
                key={step}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <BarChart3 className="text-orange-400" size={20} />
            Business Insights
          </h3>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-green-900/50 bg-green-500/10 p-6">
              <h4 className="font-semibold text-green-400">
                Sales Performance
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Identified revenue trends across outlet types, product
                categories and customer preferences.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-900/50 bg-blue-500/10 p-6">
              <h4 className="font-semibold text-blue-400">
                Interactive Dashboard
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Built dynamic Power BI dashboards with slicers and KPIs for
                real-time business exploration.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-900/50 bg-purple-500/10 p-6">
              <h4 className="font-semibold text-purple-400">
                Data-Driven Decisions
              </h4>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                Delivered insights that support inventory planning,
                outlet performance analysis and strategic decision-making.
              </p>
            </div>

          </div>
        </div>

        {/* Future */}

        <div className="mb-12">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold text-white">
            <Rocket className="text-pink-400" size={20} />
            Future Improvements
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "Sales Forecasting",
              "Customer Segmentation",
              "Market Basket Analysis",
              "Demand Prediction",
              "Automated ETL",
              "Cloud Deployment",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* GitHub */}

        <div className="border-t border-zinc-800 pt-8">

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            View Full Project on GitHub
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            The repository contains SQL scripts, Python notebooks, Power BI
            dashboard, data preprocessing pipeline and complete project
            documentation.
          </p>

        </div>

        {/* Footer */}

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center">

          <p className="text-sm text-zinc-500">
            Interested in the implementation details?
          </p>

          <p className="mt-3 text-zinc-400">
            The complete SQL workflow, Python analysis, Power BI dashboard,
            documentation and business insights are available on GitHub.
          </p>

        </div>

      </div>
    </section>
  );
}
