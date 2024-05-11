const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
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

},
{timestamps:true},

)


const Category = mongoose.model("category", categorySchema)

module.exports = Category