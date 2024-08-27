import { Client, ClientConfig } from "pg";
import { Database } from "./database";

export class PostgresDatabase implements Database {
  private client: Client;

  constructor(config: string | ClientConfig) {
    this.client = new Client(config);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async insertData(
    table: string,
    values: string,
    keys: string
  ): Promise<void> {
    await this.validateTableAndKeys(table, keys);
    const sql = `INSERT INTO "${table}" (${keys}) VALUES ${values} `;
    await this.client.query(sql);
  }

  private async validateTableAndKeys(
    table: string,
    keys: string
  ): Promise<void> {
    const tableExistsQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${table}'
        );
    `;
    const tableExistsResult = await this.client.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0].exists;

    if (!tableExists) {
      throw new Error(`Table "${table}" does not exist.`);
    }

    const keysArray = keys.split(",").map((k) => k.trim());
    const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}';
    `;
    const columnsResult = await this.client.query(columnsQuery);
    const tableColumns = columnsResult.rows.map((row) => row.column_name);

    const invalidKeys = keysArray.filter((key) => !tableColumns.includes(key));
    if (invalidKeys.length > 0) {
      throw new Error(
        `Invalid keys: ${invalidKeys.join(
          ", "
        )} are not columns in the table "${table}".`
      );
    }
  }

  public async closeConnection(): Promise<void> {
    await this.client.end();
  }
}
