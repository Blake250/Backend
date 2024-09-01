const express = require("express")
const router = express.Router()
const {
    createProduct, getProducts, 
    getSingleProduct,deleteSingleProduct,
    updateProduct, reviewProduct,updateReview,
    deleteReview} = require("../controller/productController")
const {protect, adminOnly} = require("../middleware/authMiddleWare")




router.post("/", protect,adminOnly, createProduct)
router.get("/", getProducts)
router.get("/:id", getSingleProduct)
//router.get("/:id",protect, adminOnly, getSingleProduct)
router.delete("/:id",protect, adminOnly, deleteSingleProduct)
router.patch("/:id",protect, adminOnly, updateProduct)
router.patch("/review/:id", protect,reviewProduct)
router.patch("/deleteReview/:id", protect,deleteReview)
router.patch("/updateReview/:id", protect,updateReview)



module.exports = router
 
