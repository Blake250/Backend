const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:"Name is Require",
        minlength:[2, "too short"],
        maxLength:[32, "too Long"]
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true,
        index:true
    },
    category:{
        type:String,
        required:true
    }

},
{timestamps:true},

)


const Brand = mongoose.model("brand", brandSchema)

module.exports = Brand