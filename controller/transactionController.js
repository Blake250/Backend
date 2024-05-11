const asyncHandler = require("express-async-handler")
const User = require("../models/userAuth")
const Transaction = require("../models/transactionModal")
const axios = require('axios')
const Order = require("../models/orderModel")
const { stripe } = require("../util")

//const stripe =  require('stripe')(process.env.STRIPE_SECRET_KEY)
require('dotenv').config()








const transferFund = asyncHandler(async(req,res)=>{
    // destructuring the  data from the req.body
 const {amount, sender, receiver, description, status} = req.body

// conducting validation 
if(!amount || !sender || !receiver){
    res.status(400)
    throw new Error('Please fill in all fields')
}

// sort for the sender
const user = await User.findOne({email:sender})

// a check if the sender's balance is sufficient for the transaction
if(user.balance < amount){
    res.status(400)
    throw new Error('insufficient balance')
}

// Decrease the sender's  balance
await User.findOneAndUpdate(
    {email : sender},
    { $inc : {balance : -amount  }    }
)

// increase the receiver's balance
await User.findOneAndUpdate(
    {email: receiver},
    {$inc : {balance : amount}}
)

 //  creating a user's transaction
 await Transaction.create(req.body)
 res.status(200).json({message: 'transaction successful'})
})

// verifying the receiver Account

const verifyAccount = asyncHandler(async(req, res)=>{

// checking if the receiver exist
const user = await User.findOne({email : req.body.receiver})

// if the user doesn't exist
if(!user){
    res.status(400)
    throw new Error('the receiver does not exist')
}
res.status(200).json({
  receiverName: user?.name,
  message:'Account verification Successful'

})

})


// getting  the user's transaction

const getTransactions = asyncHandler(async(req, res)=>{

  // viewers authorization
 // if(req.user.email !== req.body.email){
  //  res.status(400)
    //throw new Error('not authorized to view  transactions')
 // }



 const transactions = 
  await Transaction.find(
    {$or:[{sender:req.user.email}, {receiver:req.user.email } ]}
  ).sort({createdAt: - 1})
  .populate('sender')
  .populate('receiver')

res.status(200).json(transactions)
})






// deposit stripFund
const depositFundStripe = asyncHandler(async(req, res)=>{
  try{
  const {amount} = req.body
 
  //get the user
  const user = await User?.findById(req.user._id)

  //if the  User does not  exist create one
  if(!user.stripeCustomerId){
    const customer = await stripe.customers.create({
      email : user.email,
    })
    user.stripeCustomerId = customer.id
    await user.save()
  }

  // create Stripe session
  const session = await stripe.checkout.sessions.create({
   
    payment_method_types:['card'],
    mode:'payment',
  
  /*line_items: req.body.items.map(item =>{
   const storeItem = Order.get(item.id)

    return{
      price_data:{
      currency:'usd',
      product_data:{
        name:storeItem.name
      },
      unit_amount: Math.round(amount * 100 )
      },
      quantity:item.cartQuantity
    }
  }),*/
  
  
   line_items:[
        {
            price_data:{
                currency:'usd',
                product_data:{
                    name:'E-shop commerce website',
                    description:`make a payment of $${amount} to your E-shop commerce website`
                },
               unit_amount :amount * 100
            },
            quantity: 1
            
        }
    ],

    customer : user.stripeCustomerId,
    success_url: `${process.env.FRONTEND_URL}/wallet?payment=successful&amount=${amount} `,
    cancel_url: `${process.env.FRONTEND_URL}/wallet?payment=failed`,
  })
  return res.send({url: session.url})
}catch(err){
  res.status(500).json({message: err.message})
  
}
})








   //deposit funds vai stripe or flutter wave
   const depositFunds = (async(customer, data, source, description)=>{
    await Transaction.create({
        amount: source === 'stripe' ? data.amount_subtotal / 100 : data.amount_subtotal,
        sender:'self',
        receiver: customer.email,
        description,

        status : 'success'
      
    })
    await User.findOneAndUpdate(
      {email : customer.email},

      {$inc :{
       balance : source === 'stripe' ? data.amount_subtotal / 100 : data.amount_subtotal
      }}
    )

    
   })


// create a webhook
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
const webhook = asyncHandler(async(req,res)=>{
    const sig = request.headers['stripe-signature'];

let data;
let event;
let eventType;

try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('webhook verified')
  } catch (err) {
    console.log(`webhook error: ${err}`)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

data = event.data.object
eventType = event.type

if(eventType ===  'checkout.session.completed' ){
    stripe.customers.retrieve(data.message).then(async(customer)=>{
       
        // Deposit Funds into the customer account
        const description = 'stripe deposit'
        const source= 'stripe '
        depositFunds(customer, data, source, description)
    }).catch((err)=> console.log(err.message))
}

res.send().end()
})



// deposit With Flutter wave
const depositWithFlw = asyncHandler(async(req,res)=>{
    const {transaction_id, /*amount, customer*/} = req.query

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
const {tx_ref,amount, customer} = response.data.data
console.log(`here is the ${tx_ref}`)

const successURL = `${process.env.FRONTEND_URL}/wallet?payment=success`

const failureURL = `${process.env.FRONTEND_URL}/wallet?payment=failed`

if(req.query.status === 'successful'){
     // Deposit Funds into the customer account
     const description = 'Flutter wave deposit'
     const source= 'Flutter wave '
     const data = {
        amount_subtotal : amount
     }
     depositFunds(customer, data, source, description)
  res.redirect(successURL)
}
else{
  res.redirect(failureURL)
}
})






module.exports = {
    transferFund,
    verifyAccount,
 getTransactions,
    depositFundStripe,
    webhook,
    depositWithFlw,
   // transactions
}