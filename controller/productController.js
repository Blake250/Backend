const asyncHandler = require("express-async-handler")

const Product = require("../models/productModel")



const createProduct = asyncHandler( async(req, res)=>{
    const {

        name,
        sku,
        category,
         brand,
        quantity,
         price,
         description,
         image, 
         regularPrice,
         color} = req.body
         if(!name || !sku || 
            !category || !brand 
            || !quantity || !price || 
            !description || !color){
                res.status(400);
                throw new Error("please fill in all the fields")
            }
         
          const productData =  await  Product.create({
                name,
                sku,
                category,
                 brand,
                quantity,
                 price,
                 description,
                 image, 
                 regularPrice,
                 color

            })
           
            res.status(201).json(productData)

   

})

//get a Product
const getProducts = asyncHandler(async(req,res)=>{
 const products =  await Product.find({}).sort("-createdAt")
 if(products ){
    return res.json(products)
 }
 res.status(500)
 throw new Error(`An error occur while fetching the data`)
})



//get a single  Product
const getSingleProduct = asyncHandler(async(req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product?.findById(productId);
        if (!product) {
            res.status(404)           
            throw new Error(`Product not found`)
            
        }
      return   res.json(product);
    }
     catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});






//delete A Product
const deleteSingleProduct = asyncHandler(async(req,res)=>{
    const productId = req.params.id

  const product =  await Product.findById(productId)
   if(!product){
    res.status(401)
    throw new Error("Product Not Found")
   }
   await Product.deleteOne({_id:productId})
   res.status(201).json({message: "product was successfully deleted"})
})


  
//updating a product 
const updateProduct = asyncHandler(async(req, res)=>{
    const productId = req.params.id
    const { 
        name,
       category,
        brand,
       quantity,
        price,
        description,
        image, 
        regularPrice,
        color} = req.body

    const product = await Product.findById(productId)
    if(!product){
        res.status(404)
        throw new Error(`Product Not Found`)
    }
    
 const updatedProduct =   await Product.findByIdAndUpdate({_id:productId},{
        name,
        category,
         brand,
        quantity,
         price,
         description,
         image, 
         regularPrice,
         color

    },
    {
        new:true,
        runValidators:true
    }
  
    
    )
    res.status(200).json(updatedProduct)
})

// review a product
const reviewProduct = asyncHandler(async(req,res)=>{
   const {star, review, reviewDate} = req.body
   const {id} = req.params
   if(!star || !review){
    res.status(404)
    throw new Error(`Please Enter at least a Star and  Review`)
   }
   const product = await Product.findById(id)

   if(!product){
    res.status(404)
    throw new Error("Product not found...")
   }
   product.ratings.push({
     star,
     review,
     reviewDate,
     name:req.user.name,
     userID: req.user._id

   })
   product.save()
   res.status(200).json({message: "product review has been added successfully"})
})


const deleteReview = asyncHandler(async(req,res)=>{
  const {userID} = req.body
  const {id} = req.params
  const product = await Product.findById(id)
  if(!product){
    res.status(404)
    throw new Error(`Product Not Found`)
  }

  const filteredItem = product.ratings.filter((rating)=> {
    return(
        rating.userID.toString() !== userID.toString()  
    )

  })
  product.ratings = filteredItem
  product.save()
  res.status(200).json({message: "product review has been deleted successfully"})
})



const updateReview = asyncHandler(async(req,res)=>{
   const {star, review, reviewDate, userID} = req.body
   const {id} = req.params
   const product = await Product.findById(id)
   if(!product){
    res.status(404)
    throw new Error("Product Not Found")
   }

   if(star < 1 || !review){
    res.status(400)
    throw new Error(`Please Enter at least a Star and  Review`)
   }
   if(req.user._id !== userID){
    res.status(404)
    throw new Error("Authorization not allowed")
   }
   const updatedReview = await Product.findOneAndUpdate({
    _id:product._id,
    "ratings.userID": mongoose.Types.ObjectId(userID)

   },
   {
    $set:{
        "ratings.$.star": star,
        "ratings.$.review" : review,
        "ratings.$.reviewDate":reviewDate
        
    }    
   }
   
   
   )
   if(updatedReview){
    res.status(200).json({message: "product review has been successfully updated"})
   }
   res.status(400).json({message: "An error occur while updating the review, please try again"})
})



module.exports ={
    createProduct,
    getProducts,
    getSingleProduct,
    deleteSingleProduct,
    updateProduct,
    reviewProduct,
    deleteReview,
    updateReview

}