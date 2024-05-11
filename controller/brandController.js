const asyncHandler = require("express-async-handler")

const Category = require("../models/categoryModel")
const Brand = require("../models/brandModel")
const slugify = require("slugify")






// create Brand
const createBrand = asyncHandler(async(req,res)=>{
  const {name,category} = req.body
  if(!name || !category){
    res.status(400)
    throw new Error("Please fill in all the fields")
  }

  const categoryExist = await Category.findOne({name:category})
 
  if(!categoryExist ){
     res.status(400)
     throw new Error("Parent category Not Found...")
  }
  const brandData = await Brand.create({

    name :name,
    slug:slugify(name),
    category :category

  })
  res.status(201).json(brandData)
})






//get All  Brands
const getBrands = asyncHandler(async(req,res)=>{
 const getAll = await Brand.find().sort("-createdAt")
 res.status(200).json(getAll)
})

//deleting a Brand
const deleteBrand = asyncHandler(async(req, res)=>{
const slug = req.params.slug.toLowerCase()
const brand = await Brand.findOneAndDelete({slug:slug})
if(!brand){
    res.status(400)
    throw new Error("category Not Found..")
}
res.status(200).json({message: "category was successfully deleted"})

})


module.exports = {
    createBrand,
    getBrands,
    deleteBrand,
}