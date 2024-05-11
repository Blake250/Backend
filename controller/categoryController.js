const asyncHandler = require("express-async-handler")
const Category = require("../models/categoryModel")
const slugify = require("slugify")


// creating a category
const createCategory = asyncHandler(async(req,res)=>{
  const {name} = req.body
  if(!name){
    res.status(400)
    throw new Error("No name of Such exist")
  }

  const categoryExist = await Category.findOne({name:name})
 
  if(categoryExist){
     res.status(400)
     throw new Error("category name already exist...")
  }
  const category = await Category.create({
    name:name,
    slug:slugify(name)

  })
  res.status(201).json(category)
})



//get categories
const getCategories = asyncHandler(async(req,res)=>{
 const getAll = await Category.find().sort("-createdAt")
 res.status(200).json(getAll)
})

//deleting a category
const deleteCategory = asyncHandler(async(req, res)=>{
const slug = req.params.slug.toLowerCase()
const category = await Category.findOneAndDelete({slug:slug})
if(!category){
    res.status(400)
    throw new Error("category Not Found..")
}
res.status(200).json({message: "category was successfully deleted"})

})


module.exports = {
    createCategory,
    getCategories,
    deleteCategory,
}