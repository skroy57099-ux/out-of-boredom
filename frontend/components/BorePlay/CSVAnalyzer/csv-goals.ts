import type { GoalOption } from "./csv-types";

export const CSV_GOALS: GoalOption[] = [
  {
    id: "exploration",
    title: "Explore the data",
    description:
      "Understand the structure, patterns, and general characteristics of the dataset.",
  },
  {
    id: "reporting",
    title: "Build reports or dashboards",
    description:
      "Prepare the dataset for reporting, visualization, and business analysis.",
  },
  {
    id: "prediction",
    title: "Build a prediction / ML model",
    description:
      "Inspect the dataset before using it for machine learning or predictive analysis.",
  },
  {
    id: "merging",
    title: "Merge or join datasets",
    description:
      "Check the dataset before using it with another table or data source.",
  },
];