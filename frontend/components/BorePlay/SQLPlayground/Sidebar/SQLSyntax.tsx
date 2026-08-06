"use client";

const syntax = [
  {
    title: "SELECT",
    description: "Retrieve data from one or more tables.",
    example: `SELECT *
FROM customers;`,
  },
  {
    title: "WHERE",
    description: "Filter rows using conditions.",
    example: `SELECT *
FROM customers
WHERE city = 'Delhi';`,
  },
  {
    title: "ORDER BY",
    description: "Sort rows in ascending or descending order.",
    example: `SELECT *
FROM customers
ORDER BY age DESC;`,
  },
  {
    title: "GROUP BY",
    description: "Group rows before applying aggregate functions.",
    example: `SELECT city,
COUNT(*)
FROM customers
GROUP BY city;`,
  },
  {
    title: "HAVING",
    description: "Filter grouped results.",
    example: `SELECT city,
COUNT(*)
FROM customers
GROUP BY city
HAVING COUNT(*) > 1;`,
  },
  {
    title: "JOIN",
    description: "Combine rows from multiple tables.",
    example: `SELECT c.name,
o.amount
FROM customers c
JOIN orders o
ON c.id = o.customer_id;`,
  },
  {
    title: "CTE",
    description: "Create temporary named query blocks.",
    example: `WITH delhi AS (
SELECT *
FROM customers
WHERE city='Delhi'
)
SELECT *
FROM delhi;`,
  },
  {
    title: "Window Function",
    description: "Perform calculations across related rows.",
    example: `SELECT name,
ROW_NUMBER()
OVER(ORDER BY age)
FROM customers;`,
  },
  {
    title: "LIMIT",
    description: "Limit returned rows.",
    example: `SELECT *
FROM customers
LIMIT 5;`,
  },
];

export default function SQLSyntax() {
  return (
    <div className="space-y-6 p-5">

      {syntax.map((item) => (

        <div
          key={item.title}
          className="
            rounded-xl
            border
            border-white/10
            bg-black/20
            p-4
          "
        >

          <h3
            className="
              text-sm
              font-semibold
              text-primary
            "
          >
            {item.title}
          </h3>

          <p
            className="
              mt-2
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            {item.description}
          </p>

          <pre
            className="
              mt-4
              overflow-x-auto
              rounded-lg
              bg-[#111827]
              p-3
              font-mono
              text-xs
              leading-6
            "
          >
            <code>{item.example}</code>
          </pre>

        </div>

      ))}

    </div>
  );
}
