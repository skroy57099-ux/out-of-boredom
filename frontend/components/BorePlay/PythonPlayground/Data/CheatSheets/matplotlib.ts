const matplotlib = {
  id: "matplotlib",

  name: "Matplotlib",

  description: "Basic plotting commands.",

  sections: [
    {
      title: "Import",
      code: `import matplotlib.pyplot as plt`,
    },
    {
      title: "Line Plot",
      code: `plt.plot(x, y)`,
    },
    {
      title: "Bar Plot",
      code: `plt.bar(x, y)`,
    },
    {
      title: "Histogram",
      code: `plt.hist(data)`,
    },
    {
      title: "Show",
      code: `plt.show()`,
    },
  ],
};

export default matplotlib;