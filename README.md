
```markdown
# data2pgdb

`data2pgdb` is a powerful utility designed to simplify the process of uploading data from various file formats (Excel, CSV, and more) directly into your PostgreSQL database. With minimal setup, you can map columns from these files to database fields and insert the data efficiently. This tool is ideal for developers and data professionals who need a straightforward solution for data migration or regular data imports.

## Features

- **Multi-Format Data Integration:** Seamlessly upload data from Excel and CSV files into PostgreSQL databases. Future updates will include support for JSON files.
- **Flexible Column Mapping:** Map file columns to database fields with ease, ensuring that your data is inserted accurately.
- **Simple Configuration:** Configure your PostgreSQL database connection with just a few lines of code.
- **Error Handling:** Comprehensive error handling ensures that you are informed of any issues during the data upload process.

## Installation

To install `data2pgdb`, use npm:

```bash
npm i data2pgdb
```

## Usage

### Example: Uploading Excel or CSV Data to a PostgreSQL Database

Here’s how to use `data2pgdb` to upload data from an Excel or CSV file into your PostgreSQL database:

```typescript
import { DataImporter } from "data2pgdb"; 

async function main() {
  // Database configuration
  const dbConfig = {   
      host: "localhost",
      user: "your_username",
      password: "your_password",
      port: PORT,
      database: "your_database_name"
  };

  // Mapping between file columns and database fields
  const mapping = ["id", "name", "phone", "email"]; // Adjust to match your file and database table

  // Create an instance of DataImporter with the database configuration
  const dataImporter = new DataImporter(dbConfig);

  try {
    // Upload the Excel data to the database
    console.log("Start Excel file processing");
    await dataImporter.uploadExcelFile({
      filePath: "./path/to/excel.xlsx", 
      tableName: "TableName", 
      selectedColumns: mapping
    });
    console.log("Excel upload complete");

    // Upload the CSV data to the database
    console.log("Start CSV file processing");
    await dataImporter.uploadCsvFile({
      filePath: "./path/to/data.csv", 
      tableName: "TableName", 
      selectedColumns: mapping,
      delimiter: ","
    });
    console.log("CSV upload complete");

  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function to test the code
main().catch(console.error);
```

### Parameters

- **Mapping (`selectedColumns`)**:
  - An array of strings representing the mapping between file columns and the corresponding database fields. Ensure that the order of elements in this array matches the order of columns in your file.

- **File Path (`filePath`)**:
  - The path to the file (Excel or CSV) that you want to upload. Ensure that the file exists at the specified location.

- **Table Name (`tableName`)**:
  - The name of the table in your PostgreSQL database where the data should be inserted.

- **Delimiter (`delimiter`)** (for CSV files only):
  - The delimiter used in your CSV file (default is a comma `,`).

### Running the Code

To run the code, ensure you have files (e.g., `Book1.xlsx` and `data.csv`) with columns corresponding to your database fields. Update the paths to the files and the database table name (`TableName` in this example). Execute your script using Node.js:

```bash
node main.js
```

### Output:

- The script will log messages indicating the start and completion of the file processing.
- If any errors occur during the process, they will be logged to the console.

## Supported Databases

- **PostgreSQL** (Currently the only supported database)

## Future Enhancements

- **Additional File Support:** Future updates may include support for JSON files.
- **Bulk Operations:** Optimizing performance for large datasets through bulk insert operations.

## Deprecation Notice

- **ExcelToDB Class:** The `ExcelToDB` class is deprecated and will be removed in a future release. Please use the `DataImporter` class instead, which supports multiple file formats including Excel and CSV.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/youssefelya/data2pgdb).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
