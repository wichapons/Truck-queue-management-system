const express = require('express')
const router = express.Router()
const verifyAuthToken = require('../middlewares/verifyAuthToken')
const queueController = require("../controllers/queueController")

// user routes
router.use(verifyAuthToken.verifyIsLoggedIn) 
/*
router.get("/", orderController.getUserOrders)
router.get("/user/:id", orderController.getOrderWithUserData);
router.post("/", orderController.createOrder);
router.put("/paid/:id", orderController.updateOrderToPaid);
*/

// admin routes
//protect all routes below from non-admin access
router.use(verifyAuthToken.verifyIsAdmin) 

//GET REQUEST
router.get("/rtv",queueController.getRTVQueue);
router.get("/:productType", queueController.getAllQueue);


//POST REQUEST
router.post("/send-message/:id", queueController.sendLineNotification);
router.post("/create", queueController.createNewQueue);

//PUT REQUEST
router.put("/close/:id", queueController.checkIn);
router.put("/update-docknumber/:id", queueController.updateDockingNumber);
router.put("/checkout/:id",queueController.checkOut);

router.put("/rtv/checkin/:id",queueController.checkInRTV);
router.put("/rtv/checkout/:id",queueController.checkOutRTV);

//router.get("/analysis/:date", orderController.getOrderForAnalysis);


module.exports = router;