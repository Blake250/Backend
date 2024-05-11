const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userAuth.js")


// creating a protected route for any authenticated user
const protect = asyncHandler(async(req, res, next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            res.status(401)
            throw new Error("Not Authorized, Please Login")

        }
        // verify the token
        const verified =  jwt.verify(token, process.env.JWT_SECRET)
      

        // get the user's ID from the token
        const user = await  User.findById(verified.id).select("-password")

        // check if the user really does exist
        if(!user){
          send.status(401)
          throw new Error("user not found")
        }
        req.user = user
        next()





    }catch(error){
        res.status(401)
        throw new Error("Not Authorized, Please Login")
    }
})

//for Admin Only
const adminOnly = ((req,res, next)=>{
    if(req.user && req.user.role === "admin" ){
        

        next()
    }
    else{
        res.status(401)
      throw new Error("not Authorized as an Admin")
    }

})

module.exports = {
    protect,
    adminOnly
}