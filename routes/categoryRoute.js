
const express = require("express")
const router = express.Router()
//const categoryController = require("../controller/categoryController")
const   {createCategory, getCategories, deleteCategory} = require("../controller/categoryController")
const {protect, adminOnly} = require("../middleware/authMiddleWare")




//routes
router.post("/createCategory", protect, adminOnly,createCategory)
router.get("/getCategories", protect, adminOnly,getCategories )
router.delete("/:slug", protect, adminOnly, deleteCategory)








module.exports = router