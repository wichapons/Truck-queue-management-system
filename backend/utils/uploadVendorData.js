const XLSX = require('xlsx');
const fs = require('fs');

// Step 1: Read the Excel file
const path = require('path');

const filePath = path.join(__dirname, 'Vender_EDI_CDS&SSP.xlsx');
const workbook = XLSX.readFile(filePath);

// Step 2: Convert the data to JSON format
const sheet_name_list = workbook.SheetNames;
let json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);

// Step 3: Iterate over the JSON array and create a new JSON file for all the records.
fs.writeFileSync('all_vendors_SSP.json', JSON.stringify(json_data, null, 2), 'utf-8');

console.log(json_data);

//send json_data to mongodb

