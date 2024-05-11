const asyncHandler = require("express-async-handler")
const Coupon = require("../models/couponModel")

const slugify = require("slugify")





// create A Coupon
/*const createCoupon = asyncHandler(async(req,res)=>{
 const{name, expiresAt, discount} = req.body
 if(!name || !expiresAt, !discount){
  res.status(400)
  throw new Error("Please fill in all the fields...")
 }
 const couponCreated = await Coupon.create({
 name:name, expiresAt:expiresAt, discount:discount
 })
res.status(200).json(couponCreated)

})*/

// create a Coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount } = req.body;
  if (!name || !discount) {
    res.status(400);
    throw new Error("Please fill in all the fields...");
  }

  // Set expiry date to current date + 24 hours
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const couponCreated = await Coupon.create({
    name: name,
    discount: discount,
    expiresAt: expiresAt,
  });
  res.status(200).json(couponCreated);
});





//fetching Coupons
const getCoupon = asyncHandler(async(req,res)=>{
  const coupon = await Coupon.find().sort("-createdAt")
  res.status(200).json(coupon)
})







//getCoupon
const getACoupon = asyncHandler(async(req, res)=>{
  const coupons = await Coupon.findOne({
   name: req.params.couponName,
expiresAt: {$gt : Date.now()}
// expiresAt: new Date("2024-12-31")
  })
  if(!coupons){
     res.status(400)
     throw new Error("Coupon Not Found or has Expired...")
  }
  res.status(200).json(coupons)
})

// create a Coupon





//Delete Coupon

const deleteCoupon = asyncHandler(async(req, res)=>{
  const {id} = req.params
  const isCouponDeleted = await Coupon.findByIdAndDelete(id)
  if(!isCouponDeleted){
    res.status(400)
    throw new Error("coupon not found")
  }
  res.status(200).json({message: "coupon deleted successfully"})

})





module.exports = {
    createCoupon,
    getCoupon,
    getACoupon,
    deleteCoupon,
}