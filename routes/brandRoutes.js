const express = require("express")
const router = express.Router()
const {protect, adminOnly} = require("../middleware/authMiddleWare")
const   {createBrand, getBrands, deleteBrand} = require("../controller/brandController")



//routes
router.post("/createBrand", protect, adminOnly,createBrand)
router.get("/getBrands", protect, adminOnly,getBrands )
router.delete("/:slug", protect, adminOnly, deleteBrand)




module.exports = router
