
const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/userController.js")
//const {protect} = require("./middleWare/authMiddleWare.js")
const {protect} = require("../middleware/authMiddleWare")

// router.post("/register", registerUser);
// router.post("/login", LoginUser);
// router.get("/logOut", logOutUser);
// router.get("/getData",  protect, getUser )
// router.get("/getLoginStatus", getLoginStatus)
// router.patch("/updateUser",protect, upDateUser)
// router.patch("/updatePhoto", protect, updatePhoto)

// router.patch("/saveCart", protect, saveCart)


router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/logOut", logOutUser);
router.get("/getData",  protect, getUser )
router.get("/getLoginStatus", getLoginStatus)
router.patch("/updateUser",protect, upDateUser)
router.patch("/updatePhoto", protect, updatePhoto)
router.get("/getCart", protect, getCart)

router.post("/addToWishlist", protect, addToWishlist)

router.get("/getWishlist", protect, getWishlist)
router.patch("/saveCart", protect, saveCart)
router.put("/wishlist/:productID", protect, removeFromWishlist)



module.exports = router