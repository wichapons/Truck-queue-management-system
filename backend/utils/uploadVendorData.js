const XLSX = require('xlsx');
const fs = require('fs');

// Step 1: Read the Excel file
const path = require('path');

const filePath = path.join(__dirname, 'Vender_EDI_CDS&SSP.xlsx');
const workbook = XLSX.readFile(filePath);

// Step 2: Convert the data to JSON format
const sheet_name_list = workbook.SheetNames;
let json_data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

// Step 3: Iterate over the JSON array and create a new JSON file for all the records.
//make key value to be lowercase
json_data = json_data.map((item) => {
  let newItem = {};
  Object.keys(item).forEach((key) => {
    newItem[key.toLowerCase()] = item[key];
  });
  return newItem;
});

fs.writeFileSync('all_vendors_CDS.json', JSON.stringify(json_data, null, 2), 'utf-8');

/*
// upload all_vendors_SSP.json to mongoDB

// Step 6: Upload the data to MongoDB
async function uploadDataToMongoDB() {
  try {
    await Supplier.insertMany(json_data);
    console.log('Data uploaded to MongoDB successfully');
  } catch (error) {
    console.error('Error uploading data to MongoDB:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

uploadDataToMongoDB(json_data)
*/

