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
    console.log('triggered');
    const {sp_code,sp_name,tags} = req.body;
    const supplier = new Supplier();

    supplier.sp_code = sp_code;
    supplier.sp_name = sp_name;
    supplier.tags = tags

    console.log(supplier.sp_code,supplier.sp_name,supplier.tags );
    await supplier.save();
    res.status(201).json({ message: "A Supplier has been created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};


//create mutiple supplier with JSON format
const createMultipleSupplier = async (req, res, next) => {
  try {
    //use insertmany
    const supplierData = req.body;
    const supplier = new Supplier(supplierData);
    await supplier.insertMany();
    res.status(201).json({ message: "Suppliers have been created successfully" });
  } catch (error) {
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

module.exports = {
    createSupplier,
    createMultipleSupplier,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById,
    };