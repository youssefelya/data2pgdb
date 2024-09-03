export interface ExcelUploadOptions {
  filePath: string;
  tableName: string;
  selectedColumns?: string[];
}

export interface CsvUploadOptions {
  filePath: string;
  tableName: string;
  selectedColumns?: string[];
  delimiter?: string;
}
