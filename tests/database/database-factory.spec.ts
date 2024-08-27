import {
  DatabaseFactory,
  DatabaseConfig,
} from "../../src/database/database-factory";
import { PostgresDatabase } from "../../src/database/postgres-database";
import { SqlServerDatabase } from "../../src/database/sqlserver-database";

import { ClientConfig } from "pg";
import { config } from "mssql";

// Mock the database classes
jest.mock("../../src/database/postgres-database");
jest.mock("../../src/database/sqlserver-database");

describe("DatabaseFactory", () => {
  const postgresConfig: ClientConfig = {
    host: "localhost",
    user: "postgresUser",
    password: "password123",
    database: "testdb",
  };

  const sqlServerConfig: config = {
    user: "sqlserverUser",
    password: "password123",
    server: "localhost",
    database: "testdb",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a PostgresDatabase instance when type is "postgres"', () => {
    const dbConfig: DatabaseConfig = {
      type: "postgres",
      config: postgresConfig,
    };

    const dbInstance = DatabaseFactory.createDatabase(dbConfig);

    expect(PostgresDatabase).toHaveBeenCalledWith(postgresConfig);
    expect(dbInstance).toBeInstanceOf(PostgresDatabase);
  });

  it('should create a SqlServerDatabase instance when type is "sqlserver"', () => {
    const dbConfig: DatabaseConfig = {
      type: "sqlserver",
      config: sqlServerConfig,
    };

    const dbInstance = DatabaseFactory.createDatabase(dbConfig);

    expect(SqlServerDatabase).toHaveBeenCalledWith(sqlServerConfig);
    expect(dbInstance).toBeInstanceOf(SqlServerDatabase);
  });

  it("should throw an error for unsupported database type", () => {
    const dbConfig = {
      type: "unsupported" as "postgres", // Type casting to bypass TypeScript checks
      config: {},
    };

    expect(() => DatabaseFactory.createDatabase(dbConfig)).toThrow(
      "Unsupported database type: unsupported"
    );
  });
});
