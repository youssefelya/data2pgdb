export interface Database {
  connect(): Promise<void>;
  insertData(table: string, values: string, keys: string): Promise<void>;
  closeConnection(): Promise<void>;
}
