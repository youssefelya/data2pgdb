# data2db

`data2db` is a powerful utility designed to simplify the process of uploading data from Excel files directly into your SQL Server or PostgreSQL database. With minimal setup, you can map Excel columns to database fields and insert the data efficiently. This tool is ideal for developers and data professionals who need a straightforward solution for data migration or regular data imports.

## Features

- **Excel to Database Integration:** Seamlessly upload data from Excel files into SQL Server or PostgreSQL databases.
- **Flexible Column Mapping:** Map Excel columns to database fields with ease, ensuring that your data is inserted accurately.
- **Simple Configuration:** Configure your database connection with just a few lines of code, supporting both SQL Server and PostgreSQL.
- **Error Handling:** Comprehensive error handling ensures that you are informed of any issues during the data upload process.

## Installation

To install `data2db`, use npm:

```bash
npm i data2db
```

## Usage

### Example: Uploading Excel Data to a Database

Here’s how to use `data2db` to upload data from an Excel file into your database:

```typescript
import { ExcelToDB } from "./index";

async function main() {
  // Database configuration
  const dbConfig = {
    type: "postgres" as "postgres" | "sqlserver", // or "sqlserver"
    config: {
      host: "",
      user: "",
      password: "",
      port: 5432,
    },
  };

  // Mapping between Excel columns and database fields
  const mapping = ["id", "name", "phone", "email"];

  // Create an instance of ExcelToDB with the database configuration
  const excelToDB = new ExcelToDB(dbConfig);

  try {
    // Upload the Excel data to the database
    console.log("Start file processing ");
    await excelToDB.uploadExcel("./.vscode/Book1.xlsx", "Employee", mapping);
    console.log("Upload complete");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function to test the code
main().catch(console.error);
```

### Parameters:

- **Database Configuration (`dbConfig`)**:
  - `type`: The type of database you are using, either `postgres` or `sqlserver`.
  - `config`: An object containing your database connection details such as `host`, `user`, `password`, and `port`.

- **Mapping (`mapping`)**:
  - An array of strings representing the mapping between Excel columns and the corresponding database fields. Ensure that the order of elements in this array matches the order of columns in your Excel file.

### Running the Code

To run the code, ensure you have an Excel file (e.g., `Book1.xlsx`) with columns corresponding to your database fields. Update the path to the Excel file and the database table name (`Employee` in this example). Execute your script using Node.js:

```bash
node main.js
```

### Output:

- The script will log messages indicating the start and completion of the file processing.
- If any errors occur during the process, they will be logged to the console.

## Supported Databases

- **SQL Server**
- **PostgreSQL**

## Future Enhancements

- **Additional Database Support:** Plans to add support for other databases such as MySQL and SQLite.
- **Enhanced File Support:** Future updates may include support for CSV and JSON files.
- **Bulk Operations:** Optimizing performance for large datasets through bulk insert operations.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/youssefelya/data2db).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
 