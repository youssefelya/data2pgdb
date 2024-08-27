import { ConnectionPool, config } from "mssql";
import { Database } from "./database";

export class SqlServerDatabase implements Database {
  private pool: ConnectionPool;

  constructor(
    configOrConnectionString: config | string,
    callback?: (err?: any) => void
  ) {
    if (typeof configOrConnectionString === "string") {
      this.pool = new ConnectionPool(configOrConnectionString, callback);
    } else {
      this.pool = new ConnectionPool(configOrConnectionString, callback);
    }
  }

  public async connect(): Promise<void> {
    await this.pool.connect();
  }

  public async insertData(
    table: string,
    values: string,
    keys: string
  ): Promise<void> {
    const sql = `INSERT INTO ${table} (${keys}) VALUES (${values})`;

    // await this.pool.request().query(sql);
  }

  public async closeConnection(): Promise<void> {
    await this.pool.close();
  }
}
