import * as xlsx from "xlsx";
import { DatabaseFactory } from "../database/database-factory";
import { Database } from "../database/database";
import { ClientConfig } from "pg";
import { ExcelUploadOptions } from "../utils/types";

export class ExcelToDB {
  private db: Database;

  constructor(dbConfig: string | ClientConfig) {
    this.db = DatabaseFactory.createDatabase(dbConfig);
  }

  public async uploadExcelFile({
    filePath,
    tableName,
    selectedColumns = [],
  }: ExcelUploadOptions): Promise<void> {
    try {
      const rowsToInsert: string[] = [];
      const columnNames: string[] = [];
      const isColumnMappingProvided = selectedColumns.length > 0;
      let hasProcessedHeader = false;

      await this.db.connect();

      const workbook: xlsx.WorkBook = xlsx.readFile(filePath);
      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: xlsx.WorkSheet = workbook.Sheets[firstSheetName];
      const sheetData: Record<string, string>[] = xlsx.utils.sheet_to_json(
        worksheet,
        { raw: true }
      );

      sheetData.forEach((row) => {
        const rowEntries = Object.entries(row);
        const rowValues: string[] = [];

        rowEntries.forEach(([columnName, cellValue]) => {
          if (isColumnMappingProvided && !selectedColumns.includes(columnName))
            return;
          if (!hasProcessedHeader) columnNames.push(columnName);
          rowValues.push(`'${cellValue}'`);
        });

        if (rowValues.length > 0) {
          rowsToInsert.push(`(${rowValues.join(", ")})`);
        }

        hasProcessedHeader = true;
      });

      const formattedData = rowsToInsert.join(", ");
      const formattedColumnNames = columnNames.join(", ");

      await this.db.insertData(tableName, formattedData, formattedColumnNames);
    } catch (error) {
      throw error;
    } finally {
      await this.db.closeConnection();
    }
  }
}
