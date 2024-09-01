const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
 
},
orderDate:{
    type: String,
    required:[true, "Please Enter An Order Date"],
    trim:true,
},
orderTime:{
    type: String,
    required:[true, "Please Enter An order date"],
    trim:true,
},


orderAmount:{
  //  type: Number,
    type: String,
 required:[true, "Please Enter an  Amount"],
 trim:true,
},

orderStatus:{
    type:String,
 required:[true, "Please Enter an Order Status"],
 trim:true,
},
paymentMethod:{
    type:String,

 trim:true,
},

cartItems:{
 type:[Object],
 required:[true ],

},

shippingAddresses:{
    type:Object,
 required:[true, "Please Enter an Order or Amount"],

},
coupon:{
    type:Object,
 required:[true, "Please enter your coupon code"],
 trim:true,
 default:{
    name:"nil"
 }
},

},

{
    timestamp:true,
}


)

const Order = mongoose.model("order", orderSchema)

module.exports = Order