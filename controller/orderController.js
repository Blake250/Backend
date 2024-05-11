const asyncHandler = require("express-async-handler")
const Order = require("../models/orderModel");

const stripe =  require('stripe')(process.env.STRIPE_SECRET_KEY)
const Product  = require('../models/productModel');
const sendEmail = require("../util/sendEmail");
const { orderSuccessEmail } = require("../emailTemplates/orderTemplates");
const { updateProductQuantity } = require("../util");
const uuid = require('uuid');
//const { response, request } = require("express");
const axios = require('axios')


const createOrder = asyncHandler(async(req, res)=>{
  const {
orderDate,
orderTime,
orderAmount,
orderStatus,
cartItems,
shippingAddresses,
paymentMethod,
coupon

  } = req.body

  // validation
   if(!cartItems || !orderStatus || !shippingAddresses || !paymentMethod){
    res.status(400)
    throw new Error("order data missing...")
   }

// create Order
const creatingOrder = await Order.create({
    user: req.user._id,
    orderDate,
orderTime,
orderAmount,
orderStatus,
cartItems,
shippingAddresses,
paymentMethod,
coupon


})
// updating the productQuantity field
 await updateProductQuantity(cartItems)

// send order Email to the user
const subject = 'new Order placed successfully - e-Shop'
const send_to = req.user?.email
const template = orderSuccessEmail(req.user?.name, cartItems)
reply_to = 'no_reply@gmail.com'

await sendEmail(subject, send_to, template, reply_to)




res.status(200).json({message: "order Created Successfully"})

}
)

//getOrder
const getOrder = asyncHandler(async(req,res)=>{
    let orders;
   if(req.user.role === "admin" ){
  orders = await Order.find().sort("-createdAt")
  return res.status(200).json(orders)

   }

   orders = await Order.find({user: req.user._id}).sort("-createdAt")
   return res.status(200).json(orders)
})




//getSingleOrder

const singleOrder = asyncHandler(async(req, res)=>{
    const orderId = req.params.id.trim()

  const orders = await Order.findById(orderId)
  

  if(!orders){
    res.status(404)
    throw new Error("No Order has been Found!")
  }

  if(req.user.role === "admin"){
    res.status(200).json(orders)
  }
  if(orders.user.toString() !== req.user._id.toString()){
    res.status(404)
    throw new Error("User Not Authorized To View This Order")
  }
  res.status(200).json(orders)
})



// updating the order status
const updateOrderStatus = asyncHandler(async(req, res)=>{
   const {orderStatus} = req.body
   const {id} = req.params
   const order = await Order.findById(id)

   if(!order){
      res.status(404)
      throw new Error("Order Not Found")
   }
   const newOrder = await Order.findOneAndUpdate(

 { _id:id},
   
   { orderStatus:orderStatus},
 
   {new:true,  runValidators:true }
   
   
   )
   res.status(200).json({message: "update was successful"})
})

// pay with Stripe
//orderAmount = calculateTotalPrice(products, items)


const calculateTotalPrice = (products, cartItems) => {
  let totalPrice = 0;

  cartItems?.forEach((cartItem) => {
    const product = products.find((product) =>{
    return  product?._id.toString() === cartItem?._id
    });

    if (product) {
      const quantity = cartItem?.cartQuantity;
      const price = parseFloat(product?.price);
      totalPrice += price * quantity;
    }
  });

  return totalPrice * 100;
};




const payWithStrip = asyncHandler(async (req, res) => {
  const { items, shipping, description, coupon,  } = req.body;
let orderAmount;
  //try {
    const products = await Product.find();

    orderAmount = calculateTotalPrice(products, items);



    if (coupon !== null && coupon?.name !== 'nil') {
  
  let totalAfterDiscount = orderAmount - (orderAmount * coupon?.discount) / 100
      if (!isNaN(totalAfterDiscount)) { // Check if the discounted amount is not NaN
          orderAmount = totalAfterDiscount;
      } else {
          // Handle the case where the discounted amount is NaN
          throw new Error('Discounted amount is NaN');
      }
  }
  

    console.log('Order amount:', orderAmount);

   const paymentIntent = await stripe.paymentIntents.create({
    amount:orderAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      description,
      shipping: {
        address: {
          line1: shipping?.line1,
          line2: shipping?.line2,
          city: shipping?.city,
          country: shipping?.country,
          postal_code: shipping?.postal_code,
        },
        name: shipping?.name,
        phone: shipping?.phone,
      },
      //receipt_email
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } 

 // catch (error) {
   // console.error('Error processing payment:', error);
   // res.status(500).send({ error: 'Error processing payment. Please try again.' });
 // }
//}

);

// VERIFY FLW PAYMENT
const verifyFLWPayment = asyncHandler(async(req, res)=>{
const {transaction_id} = req.query

// confirm transaction
const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`

await axios.get( url,{
 
  headers:{
    'Content-Type' : 'application/json',
    Accept: 'application/json',

   Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
  }
})

console.log(response.data)
const {tx_ref} = response.data.data
console.log(`here is the ${tx_ref}`)

const successURL = `${process.env.FRONTEND_URL}/checkout-wave?payment=successful&ref=${tx_ref}`

const failureURL = `${process.env.FRONTEND_URL}/checkout-wave?payment=failed`

if(req.query.status === 'successful'){
  res.redirect(successURL)
}
else{
  res.redirect(failureURL)
}
})





   module.exports ={  
    createOrder,
    getOrder,
    singleOrder,
    updateOrderStatus,
   payWithStrip,
   verifyFLWPayment,

  //calculateTotalPrice,

      }