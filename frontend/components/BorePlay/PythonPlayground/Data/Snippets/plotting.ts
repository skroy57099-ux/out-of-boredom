const plotting = {
  id: "plotting",

  name: "Plot",

  code: `import matplotlib.pyplot as plt

df.groupby("Category")["TotalAmount"].sum().plot(
    kind="bar",
    figsize=(8,5)
)

plt.show()
`,
};

export default plotting;