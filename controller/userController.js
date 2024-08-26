const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../models/userAuth.js")
const dotenv = require("dotenv")


dotenv.config();
// create a jwt for a user
const generateToken = ((id)=>{
  return jwt.sign({id : id}, process.env.JWT_SECRET, {expiresIn : "1d"})
})

const registerUser = asyncHandler( async (req, res)=>{
  const {name, email, password} = req.body
  // check for if the user hasn't register yet and intend to login Login
  if(!name || !email || !password){
    res.status(400)
    throw new Error("Please Enter  A Valid Registration")

  }
//A check for situation where the password is less than 6
  if(password.length < 6){
    res.status(400);
    throw new Error("Password must be at least 6 characters")
  }
  // A check for where is user is register and intend to register again
  const userExists = await User.findOne({email:email})
  if(userExists){
    throw new Error("user already exist")
  }
  let  role = "customer"
  const user =  await User.create({
         name,
         email,
         password,
          role
  }) // generating a token for each individual user
  const token = generateToken(user._id)
  if(user){
    const {_id, name, email,role} = user

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400 ),
    // secure:true,
  
   //  sameSite: 'none'
      
    })
    // send user data   
   res.status(201).json({
   _id, name, email, token, role
   })

  }
  else{
       res.status(400);
       throw new Error("invalid user data")
  }
 
  

})
const LoginUser = asyncHandler((async(req, res)=>{
  const {email,password} = req.body

  // validate request
  if(!email || !password){
    throw new Error("Invalid User Data")
  }
  // check if user Already Exists
  const user = await User.findOne({email:email})
  if(!user){
    res.status(400)
    throw new Error("User does not Exist")
  }

  // if User Exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // generate a token for the user
    const token = generateToken(user._id)

  if(user && passwordIsCorrect){
    const newUser = await User.findOne({email : email}).select("-password")
    res.cookie(  "token", token, {
      path:"/",
      httpOnly:true,
      expires: new Date(Date.now()  + 1000 * 86400),
 secure:true,

     sameSite : 'none'

    })
    res.status(201).json(newUser)

  }else{
    res.status(400)
    throw new Error("Invalid Email or Password ")

  }


}))

// LogOut User
const logOutUser = asyncHandler(async(req, res)=>{
  res.cookie("token", "", {
    path:"/",
   httpOnly:true,
    expires: new Date(0),
 secure:true,
 sameSite : 'none'

  })
  res.status(200).json({message: "Successfully loggedOut"})
})
// getting the user 
const getUser = (async (req, res)=>{
 const user = await User.findById(req.user._id)
 if(user){
  res.status(201).json(user)
 }
 else{
  res.status(400)
  throw new Error("User not found...")
 }
})

// Get Login Status
const getLoginStatus = asyncHandler(async(req, res)=>{
  const token = req.cookies.token
  if(!token){
   return  res.json(false)
  
  }
  // verify the token
  const verified = jwt.verify(token, process.env.JWT_SECRET)
  if(verified){
    res.json(true)

  }else{
    res.json(false)
  }
  
  
})






const upDateUser  = asyncHandler(async(req, res)=>{
const user = await User.findById(req.user._id)

if(user){
 const {name, phone, address, state, country} = user;
user.name =  req.body.name || name
user.phone = req.body.phone || phone
user.address = req.body.address || address

user.state = req.body.state || state
user.country = req.body.country || country

const upDatedUser = await  user.save()
res.status(200).json(upDatedUser)
}else{
  res.status(400)
  throw new Error("No Changes Was Found...")

}
})

//update user's Photo
const updatePhoto = asyncHandler(async(req, res)=>{
 const {photo} = req.body

 const user = await User.findById(req.user?._id)
user.photo = photo;
const updatedPhoto = await user.save()
res.status(200).json(updatedPhoto)
})


// save cart
const saveCart = asyncHandler(async(req, res)=>{
  const {cartItems} = req.body
  const user = await  User.findById(req.user._id)
  if(user){
     user.cartItems = cartItems
    await user.save()
     res.status(200).json({message : 'cart saved successfully'})
  }
  else{
    res.status(404)
    throw new Error('user not found')
  }
})


//Get cart
const getCart = asyncHandler(async(req, res)=>{
  const user =  await User.findById(req.user._id)
  if(user){
    res.status(200).json(user.cartItems)
 //console.log(`${result} as be received successfully`)
    
  }
  else{
    res.status(404)
    throw new Error('user not found')
  }

  //console.log(`${user} was being received successfully`)
})


const addToWishlist = asyncHandler(async(req, res)=>{
  const {productID} = req.body
  await User.findOneAndUpdate(
    {email:req.user.email},
    {
      $addToSet :{
        wishlist:productID
      }
    }



  )
res.status(200).json({message:'product was added to wishlist'})


})

const getWishlist = asyncHandler(async(req, res)=>{
  const list = await User.findOne({
    email:req.user.email,

  }).select('wishlist')
    .populate('wishlist')

    res.status(200).json(list)
  
})

const removeFromWishlist = asyncHandler(async(req, res)=>{
  const {productID} = req.params
  await User.findOneAndUpdate({
    email:req.user.email
  },
{$pull: {wishlist : productID  }}
//{ $pull: { wishlist: mongoose.Types.ObjectId(productID) } }
)

res.status(200).json({message:'product removed from wishlist'})
})




module.exports =  {
    registerUser,
     LoginUser,
     logOutUser,
     getUser, 
     getLoginStatus,
     upDateUser,
     updatePhoto,
     saveCart,
     getCart,
     addToWishlist,
     getWishlist,
     removeFromWishlist
    
    }








// const asyncHandler = require("express-async-handler")
// const jwt = require("jsonwebtoken")
// const bcrypt = require("bcryptjs")

// const User = require("../models/userAuth.js")
// const dotenv = require("dotenv")


// dotenv.config();
// // create a jwt for a user
// const generateToken = ((id)=>{
//   return jwt.sign({id : id}, process.env.JWT_SECRET, {expiresIn : "1d"})
// })

// const registerUser = asyncHandler( async (req, res)=>{
//   const {name, email, password} = req.body
//   // check for if the user hasn't register yet and intend to login 
//   if(!name || !email || !password){
//     res.status(400)
//     throw new Error("Please Enter  A Valid Registration")

//   }
// //A check for situation where the password is less than 6
//   if(password.length < 6){
//     res.status(400);
//     throw new Error("Password must be at least 6 characters")
//   }
//   // A check for where is user is register and intend to register again
//   const userExists = await User.findOne({email:email})
//   if(userExists){
//     throw new Error("user already exist")
//   }
//   let  role = "customer"
//   const user =  await User.create({
//          name,
//          email,
//          password,
//           role
//   }) // generating a token for each individual user
//   const token = generateToken(user._id)
//   if(user){
//     const {_id, name, email,role} = user

//     res.cookie("token", token, {
//       path: "/",
//       httpOnly: true,
//       expires: new Date(Date.now() + 1000 * 86400 ),
//      //secure:true,
  
//      // sameSite: 'none'
      
//     })
//     // send user data   
//    res.status(201).json({
//    _id, name, email, token, role
//    })

//   }
//   else{
//        res.status(400);
//        throw new Error("invalid user data")
//   }
 
  

// })
// const LoginUser = asyncHandler((async(req, res)=>{
//   const {email,password} = req.body

//   // validate request
//   if(!email || !password){
//     throw new Error("Invalid User Data")
//   }
//   // check if user Already Exists
//   const user = await User.findOne({email:email})
//   if(!user){
//     res.status(400)
//     throw new Error("User does not Exist")
//   }

//   // if User Exists, check if password is correct
//   const passwordIsCorrect = await bcrypt.compare(password, user.password)

//     // generate a token for the user
//     const token = generateToken(user._id)

//   if(user && passwordIsCorrect){
//     const newUser = await User.findOne({email : email}).select("-password")
//     res.cookie(  "token", token, {
//       path:"/",
//       httpOnly:true,
//       expires: new Date(Date.now()  + 1000 * 86400),
//  // secure:true,

//     //  sameSite : 'none'

//     })
//     res.status(201).json(newUser)

//   }else{
//     res.status(400)
//     throw new Error("Invalid Email or Password ")

//   }


// }))

// // LogOut User
// const logOutUser = asyncHandler(async(req, res)=>{
//   res.cookie("token", "", {
//     path:"/",
//    httpOnly:true,
//     expires: new Date(0),
//  //secure:true,

//      // sameSite : 'none'

//   })
//   res.status(200).json({message: "Successfully loggedOut"})
// })
// // getting the user 
// const getUser = (async (req, res)=>{
//  const user = await User.findById(req.user._id)
//  if(user){
//   res.status(201).json(user)
//  }
//  else{
//   res.status(400)
//   throw new Error("User not found...")
//  }
// })

// // Get Login Status
// const getLoginStatus = asyncHandler(async(req, res)=>{
//   const token = req.cookies.token
//   if(!token){
//    return  res.json(false)
  
//   }
//   // verify the token
//   const verified = jwt.verify(token, process.env.JWT_SECRET)
//   if(verified){
//     res.json(true)

//   }else{
//     res.json(false)
//   }
  
  
// })






// const upDateUser  = asyncHandler(async(req, res)=>{
// const user = await User.findById(req.user._id)

// if(user){
//  const {name, phone, address, state, country} = user;
// user.name =  req.body.name || name
// user.phone = req.body.phone || phone
// user.address = req.body.address || address

// user.state = req.body.state || state
// user.country = req.body.country || country

// const upDatedUser = await  user.save()
// res.status(200).json(upDatedUser)
// }else{
//   res.status(400)
//   throw new Error("No Changes Was Found...")

// }
// })

// //update user's Photo
// const updatePhoto = asyncHandler(async(req, res)=>{
//  const {photo} = req.body

//  const user = await User.findById(req.user?._id)
// user.photo = photo;
// const updatedPhoto = await user.save()
// res.status(200).json(updatedPhoto)
// })


// // save cart
// const saveCart = asyncHandler(async(req, res)=>{
//   const {cartItems} = req.body
//   const user = await  User.findById(req.user._id)
//   if(user){
//      user.cartItems = cartItems
//     await user.save()
//      res.status(200).json({message : 'cart saved successfully'})
//   }
//   else{
//     res.status(404)
//     throw new Error('user not found')
//   }
// })

// //Get cart
// const getCart = asyncHandler(async(req, res)=>{
//   const user =  await User.findById(req.user._id)
//   if(user){
//     res.status(200).json(user?.cartItems)
//   }
//   else{
//     res.status(404)
//     throw new Error('user not found')
//   }
// })



// module.exports =  {
//   registerUser,
//    LoginUser,
//    logOutUser,
//    getUser, 
//    getLoginStatus,
//    upDateUser,
//    updatePhoto,
//    saveCart,
//    getCart
  
//   }



