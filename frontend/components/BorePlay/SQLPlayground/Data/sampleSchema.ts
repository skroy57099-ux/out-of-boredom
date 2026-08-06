export const sampleSchema = {
  customers: {
    rows: 10,
    columns: [
      {
        name: "id",
        type: "INTEGER",
        primaryKey: true,
      },
      {
        name: "name",
        type: "VARCHAR(100)",
      },
      {
        name: "email",
        type: "VARCHAR(255)",
      },
      {
        name: "city",
        type: "VARCHAR(100)",
      },
      {
        name: "age",
        type: "INTEGER",
      },
      {
        name: "gender",
        type: "VARCHAR(20)",
      },
      {
        name: "joined_date",
        type: "DATE",
      },
    ],
  },

  orders: {
    rows: 20,
    columns: [
      {
        name: "order_id",
        type: "INTEGER",
        primaryKey: true,
      },
      {
        name: "customer_id",
        type: "INTEGER",
        foreignKey: true,
      },
      {
        name: "product_id",
        type: "INTEGER",
        foreignKey: true,
      },
      {
        name: "quantity",
        type: "INTEGER",
      },
      {
        name: "amount",
        type: "DECIMAL(10,2)",
      },
      {
        name: "status",
        type: "VARCHAR(30)",
      },
      {
        name: "order_date",
        type: "DATE",
      },
    ],
  },

  products: {
    rows: 10,
    columns: [
      {
        name: "product_id",
        type: "INTEGER",
        primaryKey: true,
      },
      {
        name: "name",
        type: "VARCHAR(120)",
      },
      {
        name: "category",
        type: "VARCHAR(100)",
      },
      {
        name: "price",
        type: "DECIMAL(10,2)",
      },
      {
        name: "stock",
        type: "INTEGER",
      },
    ],
  },

  employees: {
    rows: 10,
    columns: [
      {
        name: "id",
        type: "INTEGER",
        primaryKey: true,
      },
      {
        name: "name",
        type: "VARCHAR(100)",
      },
      {
        name: "department",
        type: "VARCHAR(80)",
      },
      {
        name: "salary",
        type: "DECIMAL(10,2)",
      },
      {
        name: "experience_years",
        type: "INTEGER",
      },
    ],
  },
};