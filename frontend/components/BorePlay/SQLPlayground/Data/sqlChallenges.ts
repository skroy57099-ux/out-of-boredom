export interface SQLChallenge {
  id: number;

  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";

  title: string;

  description: string;

  hint: string;

  expectedColumns: string[];

  solution: string;

  xp: number;
}

export const sqlChallenges: SQLChallenge[] = [
  {
    id: 1,
    difficulty: "Easy",
    title: "Show All Customers",
    description:
      "Display every column from the customers table.",
    hint:
      "Use SELECT *.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers;`,
    xp: 10,
  },

  {
    id: 2,
    difficulty: "Easy",
    title: "Customer Names",
    description:
      "Display only the customer name column.",
    hint:
      "Don't use SELECT *.",
    expectedColumns: [
      "name",
    ],
    solution: `SELECT name
FROM customers;`,
    xp: 10,
  },

  {
    id: 3,
    difficulty: "Easy",
    title: "Customers From Delhi",
    description:
      "Display every customer living in Delhi.",
    hint:
      "Use WHERE.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
WHERE city='Delhi';`,
    xp: 10,
  },

  {
    id: 4,
    difficulty: "Easy",
    title: "Customers Older Than 30",
    description:
      "Show customers whose age is greater than 30.",
    hint:
      "Use > operator.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
WHERE age > 30;`,
    xp: 10,
  },

  {
    id: 5,
    difficulty: "Easy",
    title: "Sort By Age",
    description:
      "Sort customers from youngest to oldest.",
    hint:
      "Use ORDER BY.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
ORDER BY age ASC;`,
    xp: 10,
  },

  {
    id: 6,
    difficulty: "Easy",
    title: "Oldest Customers",
    description:
      "Sort customers from oldest to youngest.",
    hint:
      "Use DESC.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
ORDER BY age DESC;`,
    xp: 10,
  },

  {
    id: 7,
    difficulty: "Easy",
    title: "First Five Customers",
    description:
      "Display only the first five customers.",
    hint:
      "Use LIMIT.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
LIMIT 5;`,
    xp: 15,
  },

  {
    id: 8,
    difficulty: "Easy",
    title: "Unique Cities",
    description:
      "Display every unique city.",
    hint:
      "Use DISTINCT.",
    expectedColumns: [
      "city",
    ],
    solution: `SELECT DISTINCT city
FROM customers;`,
    xp: 15,
  },

  {
    id: 9,
    difficulty: "Easy",
    title: "Customers Starting With A",
    description:
      "Display customers whose name starts with A.",
    hint:
      "Use LIKE.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
WHERE name LIKE 'A%';`,
    xp: 15,
  },

  {
    id: 10,
    difficulty: "Easy",
    title: "Age Between 25 and 35",
    description:
      "Display customers aged between 25 and 35.",
    hint:
      "Use BETWEEN.",
    expectedColumns: [
      "id",
      "name",
      "email",
      "city",
      "age",
      "gender",
      "joined_date",
    ],
    solution: `SELECT *
FROM customers
WHERE age BETWEEN 25 AND 35;`,
    xp: 20,
  },
];