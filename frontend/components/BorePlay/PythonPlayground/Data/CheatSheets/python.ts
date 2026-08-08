const python = {
  id: "python",

  name: "Python",

  description: "Python fundamentals for Data Analysis.",

  sections: [
    {
      title: "Variables",
      code: `name = "Shubham"
age = 25`,
    },
    {
      title: "Data Types",
      code: `text = "BORE"
number = 100
price = 99.9
is_active = True`,
    },
    {
      title: "If Else",
      code: `if age >= 18:
    print("Adult")
else:
    print("Minor")`,
    },
    {
      title: "Loop",
      code: `for i in range(5):
    print(i)`,
    },
    {
      title: "Function",
      code: `def greet(name):
    return f"Hello {name}"`,
    },
  ],
};

export default python;