import { Database } from "./database";
import { PostgresDatabase } from "./postgres-database";
import { ClientConfig } from "pg";

export class DatabaseFactory {
  private static instance: Database | null = null;

  private constructor() {}

  static createDatabase(config: string | ClientConfig): Database {
    if (!DatabaseFactory.instance) {
      DatabaseFactory.instance = new PostgresDatabase(config);

      if (!DatabaseFactory.instance) {
        throw new Error(`Unsupported database ${config}`);
      }
    }

    return DatabaseFactory.instance;
  }
}
