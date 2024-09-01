const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middleware/authMiddleWare")
const {createOrder, verifyFLWPayment, getOrder, singleOrder, updateOrderStatus, payWithStrip, payWithWallet} = require("../controller/orderController")





router.post("/", protect, createOrder )

router.get("/", protect, getOrder)
router.get("/response", verifyFLWPayment)
router.get("/", protect, getOrder)
router.post("/payViaWallet", protect, payWithWallet)
router.post("/create-payment-intent",payWithStrip)
router.patch("/:id", protect,adminOnly,updateOrderStatus)
router.get("/:id", protect, singleOrder)








module.exports = router