const pandas = {
  id: "pandas",

  name: "Pandas",

  description: "Most used pandas operations.",

  sections: [
    {
      title: "Read CSV",
      code: `df = pd.read_csv("Amazon_sample.csv")`,
    },
    {
      title: "Head",
      code: `df.head()`,
    },
    {
      title: "Info",
      code: `df.info()`,
    },
    {
      title: "Describe",
      code: `df.describe()`,
    },
    {
      title: "GroupBy",
      code: `df.groupby("Category")["TotalAmount"].sum()`,
    },
  ],
};

export default pandas;