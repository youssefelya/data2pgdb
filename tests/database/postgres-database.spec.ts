import { Client, QueryResult } from "pg";
import { PostgresDatabase } from "../../src/database/postgres-database";

// Define a custom mock type for the query method
type MockQuery = jest.Mock<Promise<QueryResult<any>>, [string, any?]>;

jest.mock("pg", () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      query: jest.fn() as MockQuery,
      end: jest.fn(),
    })),
  };
});

describe("PostgresDatabase", () => {
  let db: PostgresDatabase;
  let mockClient: jest.Mocked<Client>;

  beforeEach(() => {
    db = new PostgresDatabase({});
    mockClient = (db as any).client as jest.Mocked<Client>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("connect", () => {
    it("should connect to the database", async () => {
      await db.connect();
      expect(mockClient.connect).toHaveBeenCalled();
    });
  });

  describe("insertData", () => {
    it("should insert data into the specified table", async () => {
      // Mock the response for table existence and columns check
      (mockClient.query as any)
        .mockResolvedValueOnce({ rows: [{ exists: true }] } as QueryResult<{
          exists: boolean;
        }>)
        .mockResolvedValueOnce({
          rows: [{ column_name: "id" }, { column_name: "name" }],
        } as QueryResult<{ column_name: string }>);

      const table = "test_table";
      const keys = "id, name";
      const values = "(1, 'test')";

      await db.insertData(table, values, keys);

      expect(mockClient.query).toHaveBeenCalledWith(
        `INSERT INTO "${table}" (${keys}) VALUES ${values} `
      );
    });

    it("should throw an error if the table does not exist", async () => {
      // Mock the response to simulate a non-existent table
      (mockClient.query as unknown as QueryResult as any).mockResolvedValueOnce(
        {
          rows: [{ exists: false }],
        } as unknown as QueryResult<{ exists: boolean }>
      );

      const table = "non_existing_table";
      const keys = "id, name";
      const values = "(1, 'test')";

      await expect(db.insertData(table, values, keys)).rejects.toThrow(
        `Table "${table}" does not exist.`
      );
    });

    it("should throw an error if keys are not valid columns in the table", async () => {
      // Mock the response for table existence and invalid columns check
      (mockClient.query as any)
        .mockResolvedValueOnce({
          rows: [{ exists: true }],
        } as QueryResult<{ exists: boolean }>)
        .mockResolvedValueOnce({
          rows: [{ column_name: "id" }, { column_name: "age" }],
        } as QueryResult<{ column_name: string }>);

      const table = "test_table";
      const keys = "id, name"; // 'name' is not a valid column in the mocked response
      const values = "(1, 'test')";

      await expect(db.insertData(table, values, keys)).rejects.toThrow(
        `Invalid keys: name are not columns in the table "${table}".`
      );
    });
  });

  describe("closeConnection", () => {
    it("should close the database connection", async () => {
      await db.closeConnection();
      expect(mockClient.end).toHaveBeenCalled();
    });
  });
});
