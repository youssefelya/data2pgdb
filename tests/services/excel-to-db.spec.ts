import { ExcelToDB } from "../../src";
import * as xlsx from "xlsx";
import { DatabaseFactory } from "../../src/database/database-factory";
import { Database } from "../../src/database/database";

// Mock the DatabaseFactory to return a mocked Database instance
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

describe("ExcelToDB", () => {
  let mockDb: jest.Mocked<Database>;
  let excelToDB: ExcelToDB;

  beforeEach(() => {
    mockDb = {
      connect: jest.fn(),
      insertData: jest.fn(),
      closeConnection: jest.fn(),
    };

    (DatabaseFactory.createDatabase as jest.Mock).mockReturnValue(mockDb);

    const dbConfig = {
      host: "localhost",
      user: "sa",
      password: "password123",
      port: 5432,
    };

    excelToDB = new ExcelToDB(dbConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

    await excelToDB.uploadExcelFile("fakepath.xlsx", "test_table", []);

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

    await excelToDB.uploadExcelFile("fakepath.xlsx", "test_table", [
      "Column1",
      "Column2",
    ]);

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
      excelToDB.uploadExcelFile("fakepath.xlsx", "test_table")
    ).rejects.toThrow("Error reading file");

    expect(mockDb.connect).toHaveBeenCalled();
    expect(mockDb.closeConnection).toHaveBeenCalled();
  });
});
