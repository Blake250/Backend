
const asyncHandler = require("express-async-handler")
const stripe =  require('stripe')(process.env.STRIPE_SECRET_KEY)
const Product  = require('../models/productModel').default;
const sendEmail = require("../util/sendEmail");
const { orderSuccessEmail } = require("../emailTemplates/orderTemplates");
const { updateProductQuantity } = require("../util");
const uuid = require('uuid');
//const { response, request } = require("express");
const axios = require('axios');
const User = require("../models/userAuth");
const Transaction = require("../models/transactionModal");
const Order = require("../models/orderModel");
const mongoose = require('mongoose');


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
 //console.log(`here is the ${updateProductQuantity} info`)
// send order Email to the user
const subject = 'new Order placed successfully - e-Shop'
const send_to = req.user.email
const template = orderSuccessEmail(req.user.name, cartItems)
const reply_to = 'no_reply@gmail.com'

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
//const orderId = new mongoose.Types.ObjectId(req.params.id.trim()); 

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


// const calculateTotalPrice = (products, cartItems) => {
//   let totalPrice = 0;

//    // Ensure products is an array
//    if (!Array.isArray(products)) {
//     throw new Error('Products is not an array or is undefined');
//   }
//   cartItems?.forEach((cartItem) => {
//     const product = products && products?.find((product) =>{
//     return  product?._id.toString() === cartItem?._id
//     });

//     if (product) {
//       const quantity = cartItem?.cartQuantity;
//       const price = parseFloat(product?.price);
//       totalPrice += price * quantity;
//     }
//   });

//   return totalPrice ;
//   // return totalPrice  * 100;
// };


const calculateTotalPrice = (products, cartItems) => {
  let totalPrice = 0;

  // Ensure products is an array
  if (!Array.isArray(products)) {
    throw new Error('Products is not an array or is undefined');
  }

  cartItems?.forEach((cartItem) => {
    const product = products && products?.length > 1 && products.find((product) => product._id.toString() === cartItem._id);

    if (product) {
      const quantity = cartItem?.cartQuantity;
      const price = parseFloat(product?.price);
      totalPrice += price * quantity;
    }
  });

  return totalPrice ;
  //return totalPrice * 100;
};




const payWithStrip = asyncHandler(async (req, res) => {
  const { items, shipping, description, coupon,  } = req.body;
let orderAmount;
  //try {
    const products = await Product.find({});

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

   Authorization: Bearer `${process.env.FLW_SECRET_KEY}`
  }
})

console.log(response.data)
const {tx_ref} = response.data.data
console.log(`here is the ${tx_ref}`)

const successURL = `${process.env.FRONTEND_URL}/checkout-wave?payment=successful&ref=${tx_ref}`

const failureURL = `${process.env.FRONTEND_URL}/checkout-wave?payment=failed`

if(req.query.status === 'successful'){
 return  res.redirect(successURL)
}
else{
 return  res.redirect(failureURL)
}
})




// const payWithWallet = asyncHandler(async(req, res)=>{
//   const {items, cartItems, shippingAddresses, coupon} = req.body
 
//    const userID = req.user._id

//    if (!mongoose.isValidObjectId(userID)) {
//     return res.status(400).json({ err: 'Invalid user ID format.' });
//   }
//   const user = await User.findById( {userID : userID} )

//   if(!user){
//     res.status(400)
//     throw new Error( `no user was found` )
//   }

//  console.log(`the ${user} is a man`)


  

//   // if (!shippingAddresses || typeof shippingAddresses !== 'object' || !shippingAddresses.line1 || !shippingAddresses.city || !shippingAddresses.country) {
//   //   return res.status(400).json({ err: 'Please provide a valid shipping address' });
//   // }

 
//  if (!shippingAddresses || !Object.keys(shippingAddresses).length   ){
//   return  res.status(400).json({err: 'Please provide a valid shipping address'})
//   }
 


//   const product = await Product.find({})
//   const today = new Date()
// console.log(`the is the ${product}  information  details`)
 
//    let orderAmount;
//    orderAmount =  calculateTotalPrice(product, items)
//    console.log(`the is the ${orderAmount}  details`)


// if(coupon !== null  && coupon?.name !== "nil")
// //if(coupon && typeof coupon.discount === 'number')
// {
//     let totalAfterDiscount = orderAmount - (orderAmount * coupon?.discount) / 100


//     if(!isNaN(totalAfterDiscount)){
//     //  console.log(`the is the ${orderAmount}  payment`)
  
//  //return   
//  orderAmount = totalAfterDiscount
//     }
//     console.log(`the is the ${orderAmount}  payment`)

//   }
 

   
// // if(user.balance < orderAmount)

// if (Number(user.balance) < Number(orderAmount)){
//   //return res.status(400).json({message  :'insufficient balance'})
//   res.status(400)
//   throw new Error('insufficient balance...')
//  }

//  const userEmailData = user
//  if(!mongoose.isValidObjectId(userEmailData)){
//   res.status(400)
//   throw new Error(`no user email was found`)
//  }

// const userEmail = await user.findOne({userEmailData:userEmailData})



//    // create a transaction
//    const newTransaction = await Transaction.create({
//     amount:orderAmount,
//   //  sender:user.email
//     sender:userEmail,
//     receiver: 'E-shop store',
//     description:'payments for products',
//     status:'success'


//    })



//   //  if(!newTransaction){
//   //   console.log(`the transaction was unsuccessful...  `)
//   //  return  res.status(400).json({error: 'an problem occur in displaying the new balance'})
//   // }
//   // else{
//   //   res.status(400)
//   //   throw new error('no new transaction is made or  available')
//   // } 
  



// //decrease the sender's balance
//    const newBalance = await User.findOneAndUpdate({
//     email: userEmail
//    },

//    {$inc : {balance : -orderAmount}}
  
//   )
//   // if(!newBalance){
//   //   console.log(`there is no available balance `)
//   //  return  res.status(400).json({error: 'a problem occur in displaying the new balance'})
//   // } 
  
//   //  else{
//   //   //console.log(`Here is a balance of ${newBalance} created `)
//   //   res.status(400)
//   //   throw new error('no new balance is available')
//   // }

   

//   const newOrder = await Order.create({
//    //user :new mongoose.Types.ObjectId(user._id) ?  mongoose.Types.ObjectId(user._id) : user._id,
//    user:user._id,
//     orderDate: today.toDateString(),
//     orderTime:today.toLocaleTimeString(),
//     orderAmount:orderAmount,
//     orderStatus : 'Order Placed...',
//     cartItems,
//     shippingAddresses,
//     paymentMethod : 'E-Shop wallet',
//     coupon


// })
// // if(!newOrder){
  

// //   console.log(`This ${newOrder} has been  created`)
  
// //  return  res.status(400).json({err: 'no new order was created'})
  
// // }

// // else{
// // console.log(`This ${newOrder} has been  created`)
// // }


// // update product quantity
// await updateProductQuantity(cartItems)


// // send order Email to the user
// const subject = 'new Order placed successfully to  e-Shop'
// const send_to = user.email
// const template = orderSuccessEmail(user.name, cartItems)
// const reply_to = 'no_reply@gmail.com'



// await sendEmail(subject, send_to, template, reply_to )


// if(newTransaction && newBalance && newOrder){
//  return res.status(200).json({
//     message:'payment successful',
//     url: `${process.env.FRONTEND_URL}/checkout-success`
   
//   })
// }
// else{
//   throw new Error('something went wrong ..please try again later')
// }

// })








const payWithWallet = asyncHandler(async (req, res) => {
  const { items, cartItems, shippingAddresses, coupon } = req.body;
  const userID = req.user._id;

  // Check if userID is a valid ObjectId
  if (!mongoose.isValidObjectId(userID)) {
    return res.status(400).json({ err: 'Invalid user ID format.' });
  }

  // Find user by ID
  const user = await User.findById(userID);
  
  if (!user) {
    res.status(404);
    throw new Error('No user was found');
  }

  console.log(`The user ${user.email} is a man`);

  if (!shippingAddresses || !Object.keys(shippingAddresses).length) {
    return res.status(400).json({ err: 'Please provide a valid shipping address' });
  }

  const products = await Product.find({});
  const today = new Date();
  console.log(`Product information details: ${products}`);

  let orderAmount = calculateTotalPrice(products, items);
  console.log(`Order amount details: ${orderAmount}`);

  if (coupon !== null && coupon?.name !== 'nil') {
    let totalAfterDiscount = orderAmount - (orderAmount * coupon?.discount) / 100;

    if (!isNaN(totalAfterDiscount)) {
      orderAmount = totalAfterDiscount;
    }
    console.log(`Payment after discount: ${orderAmount}`);
  }

  if (Number(user.balance) < Number(orderAmount)) {
    res.status(400);
    throw new Error('Insufficient balance...');
  }

  // Create a transaction
  const newTransaction = await Transaction.create({
    amount: orderAmount,
    sender: user.email,
    receiver: 'E-shop store',
    description: 'Payments for products',
    status: 'success',
  });

  // Decrease the sender's balance
  const newBalance = await User.findOneAndUpdate(
    { email: user.email },
    { $inc: { balance: -orderAmount } },
    { new: true } // To return the updated document
  );

  // Create a new order
  const newOrder = await Order.create({
    user: user._id,
    orderDate: today.toDateString(),
    orderTime: today.toLocaleTimeString(),
    orderAmount: orderAmount,
    orderStatus: 'Order Placed...',
    cartItems,
    shippingAddresses,
    paymentMethod: 'E-Shop wallet',
    coupon,
  });

  // Update product quantity
  await updateProductQuantity(cartItems);

  // Send order email to the user
  const subject = 'New Order placed successfully to E-Shop';
  const send_to = user.email;
  const template = orderSuccessEmail(user.name, cartItems);
  const reply_to = 'no_reply@gmail.com';

  await sendEmail(subject, send_to, template, reply_to);

  if (newTransaction && newBalance && newOrder) {
    return res.status(200).json({
      message: 'Payment successful',
      url: `${process.env.FRONTEND_URL}/checkout-success`,
    });
  } else {
    throw new Error('Something went wrong ..please try again later');
  }
});









   module.exports ={  
    createOrder,
    getOrder,
    singleOrder,
    updateOrderStatus,
   payWithStrip,
   verifyFLWPayment,
   payWithWallet

  //calculateTotalPrice,

      }




















