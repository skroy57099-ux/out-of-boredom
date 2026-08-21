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

const plottingStarter = `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

# Write your solution below
`;

export const pythonChallenges: PythonChallenge[] = [

  // ============================================================
  // BEGINNER 01-10
  // EXPLORE THE DATASET
  // ============================================================

  {
    id: "amazon-001",
    title: "View the First 5 Orders",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display the first 5 rows of the Amazon dataset to inspect the data.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use the head() method.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.head()
`,
  },

  {
    id: "amazon-002",
    title: "View the Last 5 Orders",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display the last 5 rows of the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use the tail() method.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.tail()
`,
  },

  {
    id: "amazon-003",
    title: "Inspect the Dataset",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Inspect the structure, column names, data types, and non-null information of the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use info().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.info()
`,
  },

  {
    id: "amazon-004",
    title: "Describe the Dataset",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Generate descriptive statistics for the numerical columns in the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use describe().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.describe()
`,
  },

  {
    id: "amazon-005",
    title: "Find Dataset Dimensions",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Find the number of rows and columns in the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use the shape attribute.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.shape
`,
  },

  {
    id: "amazon-006",
    title: "Display Column Names",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display all column names available in the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use the columns attribute.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.columns
`,
  },

  {
    id: "amazon-007",
    title: "Inspect Product Names",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display the ProductName column from the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      'Select the column using df["ProductName"].',
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["ProductName"]
`,
  },

  {
    id: "amazon-008",
    title: "Select Product Details",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Display only ProductName, Category, Brand, and Price.",
    dataset: "Amazon_sample.csv",
    hint:
      "Select multiple columns using a list.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[[
    "ProductName",
    "Category",
    "Brand",
    "Price"
]]
`,
  },

  {
    id: "amazon-009",
    title: "Explore Product Categories",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Find all unique product categories in the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use unique() on the Category column.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Category"].unique()
`,
  },

  {
    id: "amazon-010",
    title: "Count Orders by Category",
    difficulty: "Beginner",
    xp: 10,
    description:
      "Count how many records belong to each product category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use value_counts().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Category"].value_counts()
`,
  },

  // ============================================================
  // INTERMEDIATE 11-20
  // FILTERING + CLEANING
  // ============================================================

  {
    id: "amazon-011",
    title: "Find Highly Rated Products",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find all products with a Rating of 4.5 or higher.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use boolean filtering with the Rating column.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df["Rating"] >= 4.5]
`,
  },

  {
    id: "amazon-012",
    title: "Find Expensive Products",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find all records where Price is greater than 1000.",
    dataset: "Amazon_sample.csv",
    hint:
      "Filter the Price column using a comparison.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df["Price"] > 1000]
`,
  },

  {
    id: "amazon-013",
    title: "Filter by Category",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Filter the dataset to show only records belonging to the first available category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Store the first unique Category value and use it for filtering.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

category = df["Category"].dropna().iloc[0]

df[df["Category"] == category]
`,
  },

  {
    id: "amazon-014",
    title: "Find High Quantity Orders",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find orders where Quantity is greater than 5.",
    dataset: "Amazon_sample.csv",
    hint:
      "Filter using the Quantity column.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df["Quantity"] > 5]
`,
  },

  {
    id: "amazon-015",
    title: "Sort Products by Price",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Sort the Amazon dataset from the most expensive product to the least expensive.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use sort_values() with ascending=False.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.sort_values(
    "Price",
    ascending=False
)
`,
  },

  {
    id: "amazon-016",
    title: "Check Missing Values",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Find the number of missing values in every column.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use isnull() followed by sum().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.isnull().sum()
`,
  },

  {
    id: "amazon-017",
    title: "Find Rows with Missing Data",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Display all rows containing at least one missing value.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use isnull().any(axis=1).",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df[df.isnull().any(axis=1)]
`,
  },

  {
    id: "amazon-018",
    title: "Remove Duplicate Orders",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Remove duplicate rows from the Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use drop_duplicates().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.drop_duplicates()
`,
  },

  {
    id: "amazon-019",
    title: "Fill Missing Values",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Replace missing values in the Rating column with the average rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Calculate the Rating mean and use fillna().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Rating"] = df["Rating"].fillna(
    df["Rating"].mean()
)

df
`,
  },

  {
    id: "amazon-020",
    title: "Replace Missing Category Labels",
    difficulty: "Intermediate",
    xp: 20,
    description:
      "Replace missing values in the Category column with the label 'Unknown'.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use fillna() on the Category column.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Category"] = df["Category"].fillna(
    "Unknown"
)

df
`,
  },

  // ============================================================
  // ADVANCED 21-30
  // TRANSFORMATION + AGGREGATION
  // ============================================================

  {
    id: "amazon-021",
    title: "Calculate Total Revenue",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Create a Revenue column by multiplying Price by Quantity.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create a new column using Price × Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = df["Price"] * df["Quantity"]

df
`,
  },

  {
    id: "amazon-022",
    title: "Calculate Total Revenue",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the total revenue generated across the entire Amazon dataset.",
    dataset: "Amazon_sample.csv",
    hint:
      "Multiply Price by Quantity and then use sum().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

(df["Price"] * df["Quantity"]).sum()
`,
  },

  {
    id: "amazon-023",
    title: "Average Product Price",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the average product price.",
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
    id: "amazon-024",
    title: "Total Quantity Sold",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the total quantity of products sold across all records.",
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
    id: "amazon-025",
    title: "Average Rating by Category",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the average Rating for every Category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby() and mean().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "Category"
)["Rating"].mean()
`,
  },

  {
    id: "amazon-026",
    title: "Quantity Sold by Category",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the total Quantity sold for every Category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Category and sum Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "Category"
)["Quantity"].sum()
`,
  },

  {
    id: "amazon-027",
    title: "Revenue by Category",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate total revenue generated by each product Category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue first, then group by Category.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "Category"
)["Revenue"].sum()
`,
  },

  {
    id: "amazon-028",
    title: "Average Price by Brand",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate the average Price for every Brand.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Brand and calculate mean Price.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "Brand"
)["Price"].mean()
`,
  },

  {
    id: "amazon-029",
    title: "Sort Categories by Revenue",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Calculate category revenue and sort the categories from highest to lowest revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby(), sum(), and sort_values().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "Category"
)["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-030",
    title: "Top 5 Products by Quantity",
    difficulty: "Advanced",
    xp: 30,
    description:
      "Find the 5 products with the highest total quantity sold.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by ProductName, sum Quantity, sort descending, and use head(5).",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "ProductName"
)["Quantity"].sum().sort_values(
    ascending=False
).head(5)
`,
  },

  // ============================================================
  // EXPERT 31-40
  // DEEPER DATA ANALYSIS
  // ============================================================

  {
    id: "amazon-031",
    title: "Top 10 Products by Revenue",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the 10 products generating the highest total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Revenue is Price × Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "ProductName"
)["Revenue"].sum().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-032",
    title: "Revenue by State",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate total revenue generated in every State and return the top 10 states.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue, group by State, sum, sort, and use head(10).",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "State"
)["Revenue"].sum().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-033",
    title: "Quantity Sold by Brand",
    difficulty: "Expert",
    xp: 40,
    description:
      "Rank brands by their total quantity sold.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Brand and sum Quantity.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "Brand"
)["Quantity"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-034",
    title: "Customer Spending",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate total spending for every CustomerID and return the top 10 customers.",
    dataset: "Amazon_sample.csv",
    hint:
      "Revenue is Price × Quantity. Group Revenue by CustomerID.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "CustomerID"
)["Revenue"].sum().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-035",
    title: "Revenue by Brand",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate total revenue for every Brand and sort the results from highest to lowest.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue and group it by Brand.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby(
    "Brand"
)["Revenue"].sum().sort_values(
    ascending=False
)
`,
  },

  {
    id: "amazon-036",
    title: "Category Performance Summary",
    difficulty: "Expert",
    xp: 40,
    description:
      "For every Category, calculate total Quantity, total Revenue, and average Rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby().agg() with multiple aggregations.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

df.groupby("Category").agg(
    TotalQuantity=("Quantity", "sum"),
    TotalRevenue=("Revenue", "sum"),
    AverageRating=("Rating", "mean")
)
`,
  },

  {
    id: "amazon-037",
    title: "Top Product in Each Category",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the product with the highest total quantity sold within each Category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group by Category and ProductName first, then find the maximum within each category.",
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
    id: "amazon-038",
    title: "Customer Order Frequency",
    difficulty: "Expert",
    xp: 40,
    description:
      "Find the 10 customers with the highest number of orders.",
    dataset: "Amazon_sample.csv",
    hint:
      "Count OrderID for every CustomerID.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.groupby(
    "CustomerID"
)["OrderID"].count().sort_values(
    ascending=False
).head(10)
`,
  },

  {
    id: "amazon-039",
    title: "Average Order Value",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate the average order value using Price × Quantity.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create OrderValue and calculate its mean.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["OrderValue"] = (
    df["Price"] * df["Quantity"]
)

df["OrderValue"].mean()
`,
  },

  {
    id: "amazon-040",
    title: "Revenue Share by Category",
    difficulty: "Expert",
    xp: 40,
    description:
      "Calculate each category's percentage contribution to total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Calculate category revenue and divide it by total category revenue.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

category_revenue = (
    df.groupby("Category")["Revenue"]
    .sum()
)

revenue_share = (
    category_revenue /
    category_revenue.sum()
) * 100

revenue_share.sort_values(
    ascending=False
)
`,
  },

  // ============================================================
  // MASTER 41-50
  // VISUALIZATION + COMPLETE ANALYSIS
  // ============================================================

  {
    id: "amazon-041",
    title: "Chart Revenue by Category",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a bar chart showing total revenue for each product category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group revenue by Category and use plot(kind='bar').",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

revenue = (
    df.groupby("Category")["Revenue"]
    .sum()
    .sort_values(ascending=False)
)

revenue.plot(
    kind="bar",
    title="Revenue by Category"
)

plt.xlabel("Category")
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-042",
    title: "Plot Price Distribution",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a histogram showing the distribution of product prices.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use plt.hist() with the Price column.",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

plt.hist(
    df["Price"].dropna(),
    bins=20
)

plt.title("Product Price Distribution")
plt.xlabel("Price")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-043",
    title: "Plot Rating Distribution",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a histogram showing how product ratings are distributed.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use plt.hist() with Rating.",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

plt.hist(
    df["Rating"].dropna(),
    bins=10
)

plt.title("Rating Distribution")
plt.xlabel("Rating")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-044",
    title: "Chart Quantity by Category",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a bar chart showing total quantity sold for each category.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group Quantity by Category and plot the result as a bar chart.",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

quantity = (
    df.groupby("Category")["Quantity"]
    .sum()
    .sort_values(ascending=False)
)

quantity.plot(
    kind="bar",
    title="Quantity Sold by Category"
)

plt.xlabel("Category")
plt.ylabel("Quantity")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-045",
    title: "Top 10 Products Chart",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a bar chart showing the top 10 products by total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Calculate product revenue, sort descending, and select the top 10.",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

top_products = (
    df.groupby("ProductName")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

top_products.plot(
    kind="bar",
    title="Top 10 Products by Revenue"
)

plt.xlabel("Product")
plt.ylabel("Revenue")
plt.xticks(rotation=45, ha="right")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-046",
    title: "Price vs Rating",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a scatter plot comparing product Price and Rating.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use plt.scatter() with Price on the x-axis and Rating on the y-axis.",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

plot_data = df[
    ["Price", "Rating"]
].dropna()

plt.scatter(
    plot_data["Price"],
    plot_data["Rating"]
)

plt.title("Price vs Rating")
plt.xlabel("Price")
plt.ylabel("Rating")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-047",
    title: "Revenue by State Chart",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a bar chart showing the top 10 states by total revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Group revenue by State, sort descending, and use head(10).",
    starterCode: plottingStarter,
    solutionCode: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

state_revenue = (
    df.groupby("State")["Revenue"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
)

state_revenue.plot(
    kind="bar",
    title="Top 10 States by Revenue"
)

plt.xlabel("State")
plt.ylabel("Revenue")
plt.tight_layout()
plt.show()
`,
  },

  {
    id: "amazon-048",
    title: "Analyze Brand Performance",
    difficulty: "Master",
    xp: 50,
    description:
      "Create a brand-level summary containing total quantity sold, total revenue, and average rating. Sort brands by revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use Revenue = Price × Quantity and groupby().agg().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

brand_summary = df.groupby("Brand").agg(
    TotalQuantity=("Quantity", "sum"),
    TotalRevenue=("Revenue", "sum"),
    AverageRating=("Rating", "mean")
)

brand_summary.sort_values(
    "TotalRevenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-049",
    title: "Compare Category Performance",
    difficulty: "Master",
    xp: 50,
    description:
      "Build a category-level analysis containing total quantity, total revenue, average price, and average rating. Sort the categories by revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Use groupby().agg() with multiple calculations.",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

category_summary = df.groupby("Category").agg(
    TotalQuantity=("Quantity", "sum"),
    TotalRevenue=("Revenue", "sum"),
    AveragePrice=("Price", "mean"),
    AverageRating=("Rating", "mean")
)

category_summary.sort_values(
    "TotalRevenue",
    ascending=False
)
`,
  },

  {
    id: "amazon-050",
    title: "Complete Amazon Sales Analysis",
    difficulty: "Master",
    xp: 50,
    description:
      "Perform a complete sales analysis of the Amazon dataset. Create a category-level summary containing total orders, total quantity, total revenue, average order value, and average rating, then sort the categories by revenue.",
    dataset: "Amazon_sample.csv",
    hint:
      "Create Revenue first, then combine several aggregations using groupby().agg().",
    starterCode: starter,
    solutionCode: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df["Revenue"] = (
    df["Price"] * df["Quantity"]
)

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