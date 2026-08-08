export type PythonDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert"
  | "Master";

export interface PythonChallenge {
  id: string;
  title: string;
  difficulty: PythonDifficulty;
  xp: number;
  description: string;
  dataset: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
}

const starter = `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

# Write your solution below
`;

export const pythonChallenges: PythonChallenge[] = [

  // ============================================================
  // BEGINNER 01-10
  // ============================================================

  {
    id: "amazon-001",
    title: "Find the Top 5 Products",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Find the 5 products with the highest total quantity sold.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby(), sum(), sort_values(), and head().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("ProductName")["Quantity"].sum().sort_values(
    ascending=False
).head(5)
`,
  },

  {
    id: "amazon-002",
    title: "Average Rating by Category",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Calculate the average rating for each product category and sort it from highest to lowest.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby(), mean(), and sort_values().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("Category")["Rating"].mean().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-003",
    title: "Select Product Columns",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display only the ProductName, Category, Brand, and Price columns.",
    dataset: "Amazon_sample.csv",
    hint:
      "Select multiple columns using a list.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[["ProductName", "Category", "Brand", "Price"]]
`,
  },

  {
    id: "amazon-004",
    title: "Find Expensive Products",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Find all products with a Price greater than 1000.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use boolean filtering with the Price column.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df["Price"] > 1000]
`,
  },

  {
    id: "amazon-005",
    title: "Top Rated Products",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display the 10 products with the highest ratings.",
    dataset: "Amazon_sample.csv",
    hint:
      "Sort Rating descending and use head().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.sort_values(
    "Rating",
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-006",
    title: "Total Quantity Sold",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Calculate the total quantity of products sold across the entire dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use sum() on Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Quantity"].sum()
`,
  },

  {
    id: "amazon-007",
    title: "Average Product Price",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Calculate the average product price in the dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use mean() on Price.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Price"].mean()
`,
  },

  {
    id: "amazon-008",
    title: "Count Products by Category",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Count how many records belong to each product category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Try value_counts().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Category"].value_counts()
`,
  },

  {
    id: "amazon-009",
    title: "Filter High Rated Products",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Find all products with a rating of 4.5 or higher.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use boolean filtering.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df["Rating"] >= 4.5]
`,
  },

  {
    id: "amazon-010",
    title: "Highest Priced Products",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display the 10 most expensive products.",
    dataset: "Amazon_sample.csv",
    hint:
      "Sort Price in descending order.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.sort_values(
    "Price",
    ascending=False
).head(10)
`,
  },

  // ============================================================
  // INTERMEDIATE 11-20
  // ============================================================

  {
    id: "amazon-011",
    title: "Category Revenue",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Calculate total revenue for each category using Price multiplied by Quantity.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create a revenue column first, then group by Category.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("Category")["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-012",
    title: "Average Price by Brand",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Calculate the average product price for every brand.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Brand and calculate mean Price.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("Brand")["Price"].mean().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-013",
    title: "Sales by State",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Calculate the total quantity sold in each state.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group State and sum Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("State")["Quantity"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-014",
    title: "Revenue by Brand",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Calculate total revenue generated by each brand.",
    dataset: "Amazon_sample.csv",
    hint:
      "Revenue = Price × Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("Brand")["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-015",
    title: "Category Performance",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "For every category, calculate total quantity and average rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby().agg().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("Category").agg(
    TotalQuantity=("Quantity", "sum"),
    AverageRating=("Rating", "mean")
).sort_values(
    "TotalQuantity",
    ascending=False
)
`,
  },

  {
    id: "amazon-016",
    title: "High Value Orders",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Create an OrderValue column using Price × Quantity and display orders worth more than 5000.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create a calculated column and filter it.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderValue"] = df["Price"] * df["Quantity"]

df[df["OrderValue"] > 5000]
`,
  },

  {
    id: "amazon-017",
    title: "Best Category by Rating",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find the category with the highest average rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Category, calculate mean Rating, sort, and select the first row.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("Category")["Rating"].mean().sort_values(
    ascending=False
).head(1)
`,
  },

  {
    id: "amazon-018",
    title: "Quantity Statistics",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Calculate the minimum, maximum, and average quantity sold.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use agg() with min, max, and mean.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Quantity"].agg(
    ["min", "max", "mean"]
)
`,
  },

  {
    id: "amazon-019",
    title: "Brand Quantity Ranking",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Rank brands by their total quantity sold.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Brand and sum Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("Brand")["Quantity"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-020",
    title: "High Rated Expensive Products",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find products with a rating of at least 4.5 and a price above 1000.",
    dataset: "Amazon_sample.csv",
    hint:
      "Combine two boolean conditions using &.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[
    (df["Rating"] >= 4.5)
    & (df["Price"] > 1000)
]
`,
  },

  // ============================================================
  // ADVANCED 21-30
  // ============================================================

  {
    id: "amazon-021",
    title: "Revenue by State",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate total revenue for every state and return the top 10 states.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue, group by State, sum, sort, and head.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("State")["Revenue"].sum().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-022",
    title: "Category Revenue Share",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate each category's total revenue and its percentage contribution to overall revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Calculate category revenue first, then divide by total revenue.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

result = df.groupby("Category")["Revenue"].sum().to_frame()

result["RevenueShare"] = (
    result["Revenue"] / result["Revenue"].sum()
) * 100

result.sort_values(
    "Revenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-023",
    title: "Customer Spending",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate total spending for every customer and display the top 10 customers.",
    dataset: "Amazon_sample.csv",
    hint:
      "Revenue is Price × Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("CustomerID")["Revenue"].sum().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-024",
    title: "Brand Category Performance",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate total revenue for each Brand and Category combination.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by two columns.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby(
    ["Brand", "Category"]
)["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-025",
    title: "Top Product per Category",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Find the product with the highest total quantity sold within each category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Aggregate by Category and ProductName, then use groupby().idxmax().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

sales = (
    df.groupby(
        ["Category", "ProductName"]
    )["Quantity"]
    .sum()
    .reset_index()
)

sales.loc[
    sales.groupby("Category")["Quantity"].idxmax()
]
`,
  },

  {
    id: "amazon-026",
    title: "Monthly Revenue",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Convert OrderDate to datetime and calculate total revenue for each month.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use pd.to_datetime() and group by the month period.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby(
    df["OrderDate"].dt.to_period("M")
)["Revenue"].sum()
`,
  },

  {
    id: "amazon-027",
    title: "Monthly Order Count",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Find the number of orders placed in each month.",
    dataset: "Amazon_sample.csv",
    hint:
      "Convert OrderDate and group by month.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df.groupby(
    df["OrderDate"].dt.to_period("M")
)["OrderID"].count()
`,
  },

  {
    id: "amazon-028",
    title: "Customer Order Frequency",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Find the customers who placed the most orders.",
    dataset: "Amazon_sample.csv",
    hint:
      "Count OrderID for every CustomerID.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby("CustomerID")["OrderID"].count().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-029",
    title: "Average Order Value",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the average order value across the dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create OrderValue using Price × Quantity and calculate mean.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderValue"] = df["Price"] * df["Quantity"]

df["OrderValue"].mean()
`,
  },

  {
    id: "amazon-030",
    title: "State Category Revenue",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate total revenue for every State and Category combination.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by State and Category.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby(
    ["State", "Category"]
)["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  // ============================================================
  // EXPERT 31-40
  // ============================================================

  {
    id: "amazon-031",
    title: "Top Customer per State",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the customer with the highest total spending in every state.",
    dataset: "Amazon_sample.csv",
    hint:
      "Aggregate by State and CustomerID, then use idxmax().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

sales = (
    df.groupby(
        ["State", "CustomerID"]
    )["Revenue"]
    .sum()
    .reset_index()
)

sales.loc[
    sales.groupby("State")["Revenue"].idxmax()
]
`,
  },

  {
    id: "amazon-032",
    title: "Top Brand per Category",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the brand generating the highest revenue in every category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Category and Brand first.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

sales = (
    df.groupby(
        ["Category", "Brand"]
    )["Revenue"]
    .sum()
    .reset_index()
)

sales.loc[
    sales.groupby("Category")["Revenue"].idxmax()
]
`,
  },

  {
    id: "amazon-033",
    title: "Daily Revenue",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate total revenue generated on each order date.",
    dataset: "Amazon_sample.csv",
    hint:
      "Convert OrderDate to datetime and group by date.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("OrderDate")["Revenue"].sum().sort_index()
`,
  },

  {
    id: "amazon-034",
    title: "Highest Revenue Day",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the date with the highest total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Aggregate revenue by date and use idxmax().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

daily = df.groupby("OrderDate")["Revenue"].sum()

daily.loc[[daily.idxmax()]]
`,
  },

  {
    id: "amazon-035",
    title: "Customer Average Order Value",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate the average order value for every customer and return the top 10.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create OrderValue and group by CustomerID.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderValue"] = df["Price"] * df["Quantity"]

df.groupby("CustomerID")["OrderValue"].mean().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-036",
    title: "Product Revenue Ranking",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate total revenue for every product and assign a descending rank.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use rank(method='dense', ascending=False).",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

result = df.groupby(
    "ProductName"
)["Revenue"].sum().to_frame()

result["Rank"] = result["Revenue"].rank(
    method="dense",
    ascending=False
)

result.sort_values("Rank")
`,
  },

  {
    id: "amazon-037",
    title: "Category Revenue Statistics",
    difficulty: "Expert",
    xp: 40,
    description:
      "For each category calculate total revenue, average revenue per row, and total quantity.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby().agg() with multiple named aggregations.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("Category").agg(
    TotalRevenue=("Revenue", "sum"),
    AverageRevenue=("Revenue", "mean"),
    TotalQuantity=("Quantity", "sum")
).sort_values(
    "TotalRevenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-038",
    title: "Monthly Revenue Growth",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate monthly revenue and the percentage change from the previous month.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use pct_change() after calculating monthly revenue.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

monthly = df.groupby(
    df["OrderDate"].dt.to_period("M")
)["Revenue"].sum().to_frame()

monthly["Growth"] = monthly["Revenue"].pct_change() * 100

monthly
`,
  },

  {
    id: "amazon-039",
    title: "Running Revenue",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate daily revenue and the cumulative revenue over time.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use cumsum() after sorting by date.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

daily = df.groupby(
    "OrderDate"
)["Revenue"].sum().sort_index().to_frame()

daily["CumulativeRevenue"] = daily["Revenue"].cumsum()

daily
`,
  },

  {
    id: "amazon-040",
    title: "High Value Customer Segmentation",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate customer revenue and classify customers with revenue above 10000 as High Value, otherwise Regular.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use np.where() or a lambda function.",
    starterCode: `import pandas as pd
import numpy as np

df = pd.read_csv("Amazon_sample.csv")

# Write your solution below
`,
    solutionCode: `import pandas as pd
import numpy as np

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

customers = df.groupby(
    "CustomerID"
)["Revenue"].sum().to_frame()

customers["Segment"] = np.where(
    customers["Revenue"] > 10000,
    "High Value",
    "Regular"
)

customers
`,
  },

  // ============================================================
  // MASTER 41-50
  // ============================================================

  {
    id: "amazon-041",
    title: "Top 3 Products per Category",
    difficulty: "Master",
    xp: 50,
    description:
      "Find the top 3 products by total quantity sold within every category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Aggregate first, then use groupby().head(3) after sorting.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

sales = (
    df.groupby(
        ["Category", "ProductName"]
    )["Quantity"]
    .sum()
    .reset_index()
)

sales.sort_values(
    ["Category", "Quantity"],
    ascending=[True, False]
).groupby(
    "Category"
).head(3)
`,
  },

  {
    id: "amazon-042",
    title: "Customer Revenue Ranking",
    difficulty: "Master",
    xp: 50,
    description:
      "Calculate total customer revenue and assign each customer a descending revenue rank.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby(), sum(), and rank().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

customers = df.groupby(
    "CustomerID"
)["Revenue"].sum().to_frame()

customers["Rank"] = customers["Revenue"].rank(
    method="dense",
    ascending=False
)

customers.sort_values("Rank")
`,
  },

  {
    id: "amazon-043",
    title: "Best Selling Product by Month",
    difficulty: "Master",
    xp: 50,
    description:
      "Find the product with the highest total quantity sold in each month.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create a month column, aggregate by month and product, then use idxmax().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Month"] = df["OrderDate"].dt.to_period("M")

sales = (
    df.groupby(
        ["Month", "ProductName"]
    )["Quantity"]
    .sum()
    .reset_index()
)

sales.loc[
    sales.groupby("Month")["Quantity"].idxmax()
]
`,
  },

  {
    id: "amazon-044",
    title: "State Revenue Contribution",
    difficulty: "Master",
    xp: 50,
    description:
      "Calculate total revenue for each state and its percentage contribution to total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Calculate state revenue and divide by the overall revenue.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

states = df.groupby(
    "State"
)["Revenue"].sum().to_frame()

states["RevenueShare"] = (
    states["Revenue"] / states["Revenue"].sum()
) * 100

states.sort_values(
    "Revenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-045",
    title: "Category Leader by State",
    difficulty: "Master",
    xp: 50,
    description:
      "For every state, find the category generating the highest revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Aggregate by State and Category, then find the maximum within each State.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

sales = (
    df.groupby(
        ["State", "Category"]
    )["Revenue"]
    .sum()
    .reset_index()
)

sales.loc[
    sales.groupby("State")["Revenue"].idxmax()
]
`,
  },

  {
    id: "amazon-046",
    title: "Monthly Category Revenue",
    difficulty: "Master",
    xp: 50,
    description:
      "Calculate monthly revenue for every product category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use Period-based grouping with Category.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderDate"] = pd.to_datetime(
    df["OrderDate"]
)

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby(
    [
        df["OrderDate"].dt.to_period("M"),
        "Category"
    ]
)["Revenue"].sum()
`,
  },

  {
    id: "amazon-047",
    title: "Customer Lifetime Revenue",
    difficulty: "Master",
    xp: 50,
    description:
      "Calculate total lifetime revenue for every customer and return the top 20 customers.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group revenue by CustomerID and sort descending.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby(
    "CustomerID"
)["Revenue"].sum().sort_values(
    ascending=False
).head(20)
`,
  },

  {
    id: "amazon-048",
    title: "Revenue vs Quantity by Brand",
    difficulty: "Master",
    xp: 50,
    description:
      "For every brand calculate total quantity sold, total revenue, and average selling price.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use multiple aggregations in groupby().agg().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df.groupby("Brand").agg(
    TotalQuantity=("Quantity", "sum"),
    TotalRevenue=("Revenue", "sum"),
    AveragePrice=("Price", "mean")
).sort_values(
    "TotalRevenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-049",
    title: "Identify Best Performing Category",
    difficulty: "Master",
    xp: 50,
    description:
      "Determine the category with the highest total revenue, highest quantity sold, and highest average rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create a category summary using multiple aggregations.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

summary = df.groupby("Category").agg(
    TotalRevenue=("Revenue", "sum"),
    TotalQuantity=("Quantity", "sum"),
    AverageRating=("Rating", "mean")
)

summary
`,
  },

  {
    id: "amazon-050",
    title: "Build a Complete Sales Summary",
    difficulty: "Master",
    xp: 50,
    description:
      "Build a category-level sales summary containing total orders, total quantity, total revenue, average order value, and average rating. Sort the result by total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue first, then combine several aggregations with groupby().agg().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

summary = df.groupby("Category").agg(
    TotalOrders=("OrderID", "count"),
    TotalQuantity=("Quantity", "sum"),
    TotalRevenue=("Revenue", "sum"),
    AverageOrderValue=("Revenue", "mean"),
    AverageRating=("Rating", "mean")
)

summary.sort_values(
    "TotalRevenue",
    ascending=False
)
`,
  },
];