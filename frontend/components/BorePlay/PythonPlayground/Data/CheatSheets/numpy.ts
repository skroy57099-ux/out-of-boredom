const numpy = {
  id: "numpy",

  name: "NumPy",

  description: "Core NumPy operations.",

  sections: [
    {
      title: "Import",
      code: `import numpy as np`,
    },
    {
      title: "Array",
      code: `arr = np.array([1,2,3])`,
    },
    {
      title: "Mean",
      code: `np.mean(arr)`,
    },
    {
      title: "Max",
      code: `np.max(arr)`,
    },
    {
      title: "Random",
      code: `np.random.randint(1,10,5)`,
    },
  ],
};

export default numpy;