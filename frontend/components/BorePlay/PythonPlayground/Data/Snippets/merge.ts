const merge = {
  id: "merge",

  name: "Merge",

  code: `merged_df = df1.merge(
    df2,
    on="CustomerID",
    how="inner"
)

merged_df.head()
`,
};

export default merge;