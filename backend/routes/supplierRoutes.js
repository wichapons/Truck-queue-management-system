const express = require('express')
const router = express.Router()
const supplierController = require("../controllers/supplierController")
const verifyAuthToken = require("../middlewares/verifyAuthToken")

router.use(verifyAuthToken.verifyIsLoggedIn) 
//protect all routes below from non-admin access
router.use(verifyAuthToken.verifyIsAdmin) 

router.get("/:id", supplierController.getSupplierById);
router.post("/newMultipleSup", supplierController.createMultipleSupplier);
router.put("/:id", supplierController.updateSupplierById);
router.delete("/:id", supplierController.deleteSupplierById);
router.post("/create",supplierController.createSupplier);
router.get('/search/:prefix', supplierController.searchSupplierByIdPrefix);

module.exports = router;