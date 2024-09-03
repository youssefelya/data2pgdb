import { DataImporter } from "../../src/services/data-importer";
import * as xlsx from "xlsx";
import * as fs from "fs";
import { DatabaseFactory } from "../../src/database/database-factory";
import { Database } from "../../src/database/database";
import { EventEmitter } from "events";

jest.mock("../../src/database/database-factory", () => ({
  DatabaseFactory: {
    createDatabase: jest.fn(),
  },
}));

jest.mock("xlsx", () => ({
  readFile: jest.fn(),
  utils: {
    sheet_to_json: jest.fn(),
  },
}));

jest.mock("csv-parser", () => jest.fn(() => new EventEmitter()));

jest.mock("fs", () => ({
  createReadStream: jest.fn(),
}));

describe("DataImporter", () => {
  let mockDb: jest.Mocked<Database>;
  let dataImporter: DataImporter;
  let mockStream: EventEmitter;

  beforeEach(() => {
    mockDb = {
      connect: jest.fn(),
      insertData: jest.fn(),
      closeConnection: jest.fn(),
    } as jest.Mocked<Database>;

    (DatabaseFactory.createDatabase as jest.Mock).mockReturnValue(mockDb);

    const dbConfig = {
      host: "localhost",
      user: "sa",
      password: "password123",
      port: 5432,
    };

    dataImporter = new DataImporter(dbConfig);

    mockStream = new EventEmitter();

    (mockStream as any).pipe = jest.fn().mockReturnValue(mockStream);

    (fs.createReadStream as jest.Mock).mockReturnValue(mockStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadExcelFile", () => {
    it("should successfully upload Excel data to the database", async () => {
      const mockSheetData = [
        { Column1: "Value1", Column2: "Value2" },
        { Column1: "Value3", Column2: "Value4" },
      ];

      (xlsx.readFile as jest.Mock).mockReturnValue({
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: {} },
      } as xlsx.WorkBook);
      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockSheetData);

      await dataImporter.uploadExcelFile({
        filePath: "fakepath.xlsx",
        tableName: "test_table",
      });

      expect(mockDb.connect).toHaveBeenCalled();
      expect(mockDb.insertData).toHaveBeenCalledWith(
        "test_table",
        "('Value1', 'Value2'), ('Value3', 'Value4')",
        "Column1, Column2"
      );
      expect(mockDb.closeConnection).toHaveBeenCalled();
    });

    it("should skip unmapped columns when mapping is provided", async () => {
      const mockSheetData = [
        { Column1: "Value1", Column2: "Value2", Column3: "Value3" },
      ];

      (xlsx.readFile as jest.Mock).mockReturnValue({
        SheetNames: ["Sheet1"],
        Sheets: { Sheet1: {} },
      } as xlsx.WorkBook);
      (xlsx.utils.sheet_to_json as jest.Mock).mockReturnValue(mockSheetData);

      await dataImporter.uploadExcelFile({
        filePath: "fakepath.xlsx",
        tableName: "test_table",
        selectedColumns: ["Column1", "Column2"],
      });

      expect(mockDb.insertData).toHaveBeenCalledWith(
        "test_table",
        "('Value1', 'Value2')",
        "Column1, Column2"
      );
    });

    it("should handle errors during the upload process", async () => {
      (xlsx.readFile as jest.Mock).mockImplementation(() => {
        throw new Error("Error reading file");
      });

      await expect(
        dataImporter.uploadExcelFile({
          filePath: "fakepath.xlsx",
          tableName: "test_table",
        })
      ).rejects.toThrow("Error reading file");

      expect(mockDb.connect).toHaveBeenCalled();
      expect(mockDb.closeConnection).toHaveBeenCalled();
    });
  });

  describe("uploadCsvFile", () => {
    it("should successfully upload CSV data to the database", async () => {
      const mockCsvData = [
        { Column1: "Value1", Column2: "Value2" },
        { Column1: "Value3", Column2: "Value4" },
      ];

      // Simulate the CSV data stream
      setImmediate(() => {
        mockCsvData.forEach((row) => mockStream.emit("data", row));
        mockStream.emit("end");
      });

      await dataImporter.uploadCsvFile({
        filePath: "fakepath.csv",
        tableName: "test_table",
      });

      expect(mockDb.connect).toHaveBeenCalled();
      expect(mockDb.insertData).toHaveBeenCalledWith(
        "test_table",
        "('Value1', 'Value2'), ('Value3', 'Value4')",
        "Column1, Column2"
      );
      expect(mockDb.closeConnection).toHaveBeenCalled();
    });

    it("should handle errors during the upload process", async () => {
      const error = new Error("Error reading CSV file");

      mockStream.on("error", (err) => {
        expect(err).toEqual(error);
      });

      setImmediate(() => {
        mockStream.emit("error", error);
      });

      await expect(
        dataImporter.uploadCsvFile({
          filePath: "fakepath.csv",
          tableName: "test_table",
        })
      ).rejects.toThrow("Error reading CSV file");

      expect(mockDb.connect).toHaveBeenCalled();
      expect(mockDb.closeConnection).toHaveBeenCalled();
    });
  });
});
