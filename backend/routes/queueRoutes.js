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

router.post("/send-message/:id", queueController.sendLineNotification);
router.get("/", queueController.getAllQueue);
router.post("/create", queueController.createNewQueue);
router.put("/close/:id", queueController.closeQueue);
router.put("/update-docknumber/:id", queueController.updateDockingNumber);
//router.get("/analysis/:date", orderController.getOrderForAnalysis);

module.exports = router