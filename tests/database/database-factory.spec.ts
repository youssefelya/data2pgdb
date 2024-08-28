import { DatabaseFactory } from "../../src/database/database-factory";
import { PostgresDatabase } from "../../src/database/postgres-database";

import { ClientConfig } from "pg";

// Mock the database classes
jest.mock("../../src/database/postgres-database");

describe("DatabaseFactory", () => {
  const config: ClientConfig = {
    user: "test",
    host: "localhost",
    database: "testdb",
    password: "password",
    port: 5432,
  };

  beforeEach(() => {
    // Reset the singleton instance before each test
    (DatabaseFactory as any).instance = null;
    jest.clearAllMocks();
  });

  it("should create a new PostgresDatabase instance when one does not exist", () => {
    const dbInstance = DatabaseFactory.createDatabase(config);

    expect(PostgresDatabase).toHaveBeenCalledTimes(1);
    expect(PostgresDatabase).toHaveBeenCalledWith(config);
    expect(dbInstance).toBeInstanceOf(PostgresDatabase);
  });

  it("should return the existing instance on subsequent calls", () => {
    const dbInstance1 = DatabaseFactory.createDatabase(config);
    const dbInstance2 = DatabaseFactory.createDatabase(config);

    expect(PostgresDatabase).toHaveBeenCalledTimes(1);
    expect(dbInstance1).toBe(dbInstance2); // Should be the same instance
  });

  it("should throw an error if the PostgresDatabase instance creation fails", () => {
    // Mock PostgresDatabase to throw an error
    (PostgresDatabase as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to create database");
    });

    expect(() => DatabaseFactory.createDatabase(config)).toThrow(
      `Failed to create database`
    );
  });
});
