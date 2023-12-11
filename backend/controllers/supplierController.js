const Supplier = require("../models/SupplierModel");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

dotenv.config(); //import dotenv module

//create new supplier

const createSupplier = async (req, res, next) => {
  try {
    const {sp_code,sp_name,tags} = req.body;
    const supplier = new Supplier();
    supplier.sp_code = sp_code;
    supplier.sp_name = sp_name;
    supplier.tags = tags
    await supplier.save();
    res.status(201).json({ message: "A Supplier has been created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};


//insert many to mongodb (JSON file)
const createMultipleSupplier = async (req, res, next) => {
  try {
    const supplierData = req.body;
    // Use insertMany directly on the Supplier model
    await Supplier.insertMany(supplierData);
    res.status(201).json({ message: "Suppliers have been created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};


const createMultipleSupplierV2 = async (req, res, next) => {
  try {
    const newSupplierData = req.body;

    // Extract an array of unique sp_codes from the new suppliers
    const newSupplierCodes = newSupplierData.map((supplier) => supplier.sp_code);

    // Query the database to find existing suppliers with the same sp_codes
    const existingSuppliers = await Supplier.find({ sp_code: { $in: newSupplierCodes } });

    // Filter out the new suppliers that already exist in the database
    const uniqueNewSuppliers = newSupplierData.filter(
      (newSupplier) => !existingSuppliers.some((existingSupplier) => existingSupplier.sp_code === newSupplier.sp_code)
    );

    // Insert the unique new suppliers into the database
    await Supplier.insertMany(uniqueNewSuppliers);

    res.status(201).json({ message: "Suppliers have been created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};


//get supplier by id
const getSupplierById = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    
    // Use lean() to get a plain JavaScript object instead of a Mongoose document
    const supplier = await Supplier.findOne({"sp_code": supplierId}).lean();

    if (!supplier) {
      // If no supplier is found, send a 404 response
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error) {
    // Log the error for your reference
    console.error(error);

    // Send a user-friendly error message in the response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//update supplier by id
const updateSupplierById = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    const supplierData = req.body;
    const supplier = await Supplier.findByIdAndUpdate(supplierId, supplierData, {
      new: true,
    });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).send(error);
  }
};

//delete supplier by id
const deleteSupplierById = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    await Supplier.findByIdAndDelete(supplierId);
    res.status(200).json({ message: "Supplier has been deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

//search by supplier ID start with xxxx 
const searchSupplierByIdPrefix = async (req, res, next) => {
  try {
    const prefix = req.params.prefix; // Get the prefix from the request parameters

    // Use a regular expression to search for first 10 suppliers with IDs starting with the specified prefix
    const suppliers = await Supplier.find({ sp_code: new RegExp(`^${prefix}`) }).limit(10).lean();


    if (!suppliers || suppliers.length === 0) {
      // If no suppliers are found, send a 404 response
      return res.status(404).json({ error: 'No suppliers found with the specified prefix' });
    }
    //send only suppliers.sp code 
    const spCodes = suppliers.map((supplier) => supplier.sp_code);
    res.status(200).json(spCodes);

  } catch (error) {
    // Log the error for your reference
    console.error(error);

    // Send a user-friendly error message in the response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
    createSupplier,
    createMultipleSupplier,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById,
    searchSupplierByIdPrefix,
    };