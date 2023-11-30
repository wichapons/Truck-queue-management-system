const express = require('express')
const router = express.Router()
const supplierController = require("../controllers/supplierController")

router.get("/:id", supplierController.getSupplierById);
router.post("/newMultipleSup", supplierController.createSupplier);
router.put("/:id", supplierController.updateSupplierById);
router.delete("/:id", supplierController.deleteSupplierById);

module.exports = router;