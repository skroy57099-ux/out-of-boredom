const readCsv = {
  id: "readCsv",

  name: "Read CSV",

  code: `import pandas as pd

df = pd.read_csv("Amazon_sample.csv")

df.head()
`,
};

export default readCsv;