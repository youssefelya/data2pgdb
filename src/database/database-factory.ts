import { Database } from "./database";
import { PostgresDatabase } from "./postgres-database";
import { ClientConfig } from "pg";
import { config } from "mssql";
import { SqlServerDatabase } from "./sqlserver-database";

export interface DatabaseConfig {
  type: "postgres" | "sqlserver";
  config: string | ClientConfig | config;
}

export class DatabaseFactory {
  private static readonly databaseMap: {
    [key in DatabaseConfig["type"]]: (config: any) => Database;
  } = {
    postgres: (config) => new PostgresDatabase(config as string | ClientConfig),
    sqlserver: (config) => new SqlServerDatabase(config as string | config),
  };

  static createDatabase(dbConfig: DatabaseConfig): Database {
    const createDatabase = this.databaseMap[dbConfig.type];

    if (!createDatabase) {
      throw new Error(`Unsupported database type: ${dbConfig.type}`);
    }

    return createDatabase(dbConfig.config);
  }
}
