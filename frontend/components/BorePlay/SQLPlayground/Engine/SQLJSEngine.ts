import initSqlJs, { Database } from "sql.js";
import { sampleData } from "../Data/sampleData";

class SQLJSEngine {
  private db: Database | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized && this.db) {
      console.log("✅ SQL.js already initialized");
      return;
    }

    console.log("🚀 Initializing SQL.js...");

    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        const path = `/sqljs/${file}`;
        console.log("📦 Loading WASM:", path);
        return path;
      },
    });

    console.log("✅ SQL.js loaded");

    this.db = new SQL.Database();

    console.log("✅ Database created");

    await this.registerTables();

    this.initialized = true;

    console.log("🎉 SQL.js Ready");
  }

  private async registerTables() {
    if (!this.db) {
      throw new Error("Database not initialized.");
    }

    console.log("📚 Registering sample tables...");

    for (const [tableName, rows] of Object.entries(sampleData)) {
      if (rows.length === 0) continue;

      console.log(`➡ Creating table: ${tableName}`);

      const columns = Object.keys(rows[0]);

      const schema = columns
        .map((column) => `"${column}" TEXT`)
        .join(",");

      this.db.run(
        `CREATE TABLE "${tableName}" (${schema});`
      );

      const placeholders = columns
        .map(() => "?")
        .join(",");

      const stmt = this.db.prepare(
        `INSERT INTO "${tableName}" VALUES (${placeholders});`
      );

      for (const row of rows) {
        stmt.run(
          columns.map((column) =>
            row[column] == null
              ? null
              : String(row[column])
          )
        );
      }

      stmt.free();

      console.log(`✅ ${tableName} loaded (${rows.length} rows)`);
    }

    console.log("✅ All tables registered");
  }

  async runQuery(sql: string) {
    if (!this.db) {
      throw new Error("SQL.js has not been initialized.");
    }

    console.log("▶ Executing SQL:");
    console.log(sql);

    const result = this.db.exec(sql);

    if (result.length === 0) {
      console.log("⚠ Query returned no rows");
      return [];
    }

    const { columns, values } = result[0];

    const rows = values.map((valueRow) =>
      Object.fromEntries(
        columns.map((column, index) => [
          column,
          valueRow[index],
        ])
      )
    );

    console.log(`✅ Returned ${rows.length} rows`);

    return rows;
  }

  close() {
    if (!this.db) return;

    this.db.close();

    this.db = null;
    this.initialized = false;

    console.log("🛑 SQL.js closed");
  }
}

export default new SQLJSEngine();
