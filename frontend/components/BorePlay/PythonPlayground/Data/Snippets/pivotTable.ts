const pivotTable = {
  id: "pivotTable",

  name: "Pivot Table",

  code: `pd.pivot_table(
    df,
    values="TotalAmount",
    index="Category",
    aggfunc="sum"
)
`,
};

export default pivotTable;