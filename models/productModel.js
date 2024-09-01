const mongoose = require("mongoose")







const productSchema = new mongoose.Schema ({

name:{
    type: String,
    required : [true, "Please Enter a name"],
    trim : true,
},
sku:{
    type:String,
    required:true,
    default:"sku",
    trim:true,
},
category:{
    type:String,
    required:[true, "Please Enter a Category"],
    trim:true

},
brand:{
    type:String,
    required:[true, "Please Enter A brand"],
    trim:true
},
color:{
    type:String,
    required:[true, "Please Add A Color"],
    trim:true,
    default:"As seen"

},
quantity:{
    type:Number,
    required:[true, "Please enter a quantity"],
    

},
sold:{
    type:Number,
    default:0,
    trim:true

},
regularPrice:{
    type:Number,
    trim:true
},
price:{
type:Number,
required:[true, "Please Add  A Price"],
trim:true
},

description:{
 type:String,
 trim:true,
 required:[true, "Please Add A description"]
},

image:{
 type:[String]
},

ratings:{
    type:[Object]
}
},


{
    timeStamps:true
},
)




const Product = mongoose.model("product", productSchema)

module.exports = Product