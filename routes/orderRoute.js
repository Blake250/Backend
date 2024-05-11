const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middleware/authMiddleWare")
const {createOrder, verifyFLWPayment, getOrder, singleOrder, updateOrderStatus, payWithStrip} = require("../controller/orderController")





router.post("/", protect, createOrder )
router.patch("/:id", protect,adminOnly,updateOrderStatus)
router.get("/", protect, getOrder)
router.get("/response", verifyFLWPayment)
router.get("/:id", protect, singleOrder)
router.post("/create-payment-intent",payWithStrip)








module.exports = router