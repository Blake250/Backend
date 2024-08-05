const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
//const {Object} = mongoose.Schema

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter a valid name"]
    },
    email:{
        type:String,
        required:[true, "Enter a valid email"],
        unique:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter A valid email"
        ]
    },
    password:{
        type:String,
        required:[true, "Please Enter A Valid Password"],
        minLength:[6, "Please Enter A password Not Less Than 6 "]

    },
    role:{
        type:String,
       required:[true],
        default:"admin",
        enum:["customer", "admin"]
    },
    photo:{
     type:String,
     // type:mongoose.Schema.Types.ObjectId,
        required:[true, "Please Add A Photo"],
        default:"https://i.ibb.co/b2p7x2P/dpPhoto.jpg",
    },
    phone:{
        type:String,
        default:"+351",
    },
    balance:{

        type:Number,
        default:0,
        
    },
 
        address: {
            type: String,
          
        },
        state: {
            type: String,
        
        },
        country: {
            type: String,

        
            
    },

    cartItems:{
        type:[Object]
    },

    
    stripeCustomerId: {
        type: String,
      
    },
  
   
},
{
    timeStamps:true
}

)
//Encrypt the password before saving it in the DB
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    const salt =  await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()

},


{
    timeStamps:true
})

const User = mongoose.model("User", userSchema)

module.exports = User