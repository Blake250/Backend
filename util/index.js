const Product = require("../models/productModel").default

const stripe =  require("stripe")(process.env.STRIPE_SECRET_KEY)





const updateProductQuantity = async(cartItems)=>{
  let bulkOption = cartItems && cartItems.length > 0 &&  cartItems.map((product)=>{
    return{
          updateOne:{
            filter :{_id : product._id},
            update:{
              $inc :{
                quantity : -product.cartQuantity,
                sold : +product.cartQuantity
              }
            }
          }
    }

    
  })

  await Product.bulkWrite(bulkOption, {})
}

module.exports = {
    
    updateProductQuantity,
    stripe
}