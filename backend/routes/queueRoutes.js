const express = require('express')
const router = express.Router()
const verifyAuthToken = require('../middlewares/verifyAuthToken')
const queueController = require("../controllers/queueController")
/*
// user routes
router.use(verifyAuthToken.verifyIsLoggedIn) 
router.get("/", orderController.getUserOrders)
router.get("/user/:id", orderController.getOrderWithUserData);
router.post("/", orderController.createOrder);
router.put("/paid/:id", orderController.updateOrderToPaid);
*/

// admin routes
//router.use(verifyAuthToken.verifyIsAdmin)
router.post("/send-message/:id", queueController.sendLineNotification);
//router.put("/delivered/:id", orderController.updateOrderToDelivered);
//router.get("/admin", orderController.getAllOrdersAdmin);
//router.get("/analysis/:date", orderController.getOrderForAnalysis);

module.exports = router