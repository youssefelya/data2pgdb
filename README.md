
# data2pgdb

`data2pgdb` is a powerful utility designed to simplify the process of uploading data from Excel files directly into your PostgreSQL database. With minimal setup, you can map Excel columns to database fields and insert the data efficiently. This tool is ideal for developers and data professionals who need a straightforward solution for data migration or regular data imports.

## Features

- **Excel to PostgreSQL Integration:** Seamlessly upload data from Excel files into PostgreSQL databases.
- **Flexible Column Mapping:** Map Excel columns to database fields with ease, ensuring that your data is inserted accurately.
- **Simple Configuration:** Configure your PostgreSQL database connection with just a few lines of code.
- **Error Handling:** Comprehensive error handling ensures that you are informed of any issues during the data upload process.

## Installation

To install `data2pgdb`, use npm:

```bash
npm i data2pgdb
```

## Usage

### Example: Uploading Excel Data to a PostgreSQL Database

Here’s how to use `data2pgdb` to upload data from an Excel file into your PostgreSQL database:

```typescript
import { ExcelToDB } from "data2pgdb"; 

async function main() {
  // Database configuration
  const dbConfig = {   
      host: "localhost",
      user: "your_username",
      password: "your_password",
      port: PORT,
      database: "your_database_name"
  
  };

  // Mapping between Excel columns and database fields
  const mapping = ["id", "name", "phone", "email"]; // Adjust to match your Excel file and database table

  // Create an instance of ExcelToDB with the database configuration
  const excelToDB = new ExcelToDB(dbConfig);

  try {
    // Upload the Excel data to the database
    console.log("Start file processing ");
    await excelToDB.uploadExcelFile("./path/to/excel.xlsx", "TableName", mapping); // Update with the correct path to your Excel file
    console.log("Upload complete");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function to test the code
main().catch(console.error);
```

### Parameters:


- **Mapping (`mapping`)**:
  - An array of strings representing the mapping between Excel columns and the corresponding database fields. Ensure that the order of elements in this array matches the order of columns in your Excel file.

- **File Path (`filePath`)**:
  - The path to the Excel file that you want to upload. Ensure that the file exists at the specified location.

- **Table Name (`tableName`)**:
  - The name of the table in your PostgreSQL database where the data should be inserted.

### Running the Code

To run the code, ensure you have an Excel file (e.g., `Book1.xlsx`) with columns corresponding to your database fields. Update the path to the Excel file and the database table name (`Employee` in this example). Execute your script using Node.js:

```bash
node main.js
```

### Output:

- The script will log messages indicating the start and completion of the file processing.
- If any errors occur during the process, they will be logged to the console.

## Supported Databases

- **PostgreSQL** (Currently the only supported database)

## Future Enhancements

- **Additional File Support:** Future updates may include support for CSV and JSON files.
- **Bulk Operations:** Optimizing performance for large datasets through bulk insert operations.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/youssefelya/data2pgdb).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

 