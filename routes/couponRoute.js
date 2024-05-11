const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middleware/authMiddleWare")

const {createCoupon,getCoupon, getACoupon, deleteCoupon} = require("../controller/couponController")

router.post("/createCoupon", protect, adminOnly,createCoupon)
router.get("/getCoupon", protect, adminOnly,getCoupon)
router.get("/:couponName", protect, getACoupon)
router.delete("/:id", protect,adminOnly, deleteCoupon)












module.exports = router