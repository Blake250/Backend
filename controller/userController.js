





const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userAuth.js");
const dotenv = require("dotenv");

dotenv.config();

// Function to create a JWT for a user
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter A Valid Registration");
  }

  // Check if the password length is sufficient
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: email});
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Default role for a new user
  let role = "customer";

  // Create a new user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // Generate token for the new user
  const token = generateToken(user._id);
  if (user) {
    const { _id, name, email, role } = user;

    // Set token in cookies
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
    //  secure: process.env.NODE_ENV === "production", // Only set secure in production
        secure:true,
        sameSite: 'none',
   
     
    });

    // Send user data
    res.status(201).json({
      _id, name, email, token, role
    });

  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid User Data");
  }

  // Check if user already exists
  const user = await User.findOne({email: email});
  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // Generate a token for the user
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    const newUser = await User.findOne({ email: email }).select("-password");

    // Set token in cookies
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
     // secure: process.env.NODE_ENV === "production", // Only set secure in production
     secure:true,
     sameSite: 'none',
    
    });

    res.status(201).json(newUser);

  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// Log Out User
const logOutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
//secure: process.env.NODE_ENV === "production", // Only set secure in production
secure:true,
   sameSite: 'none',
  

  });
  res.status(200).json({ message: "Successfully logged out" });
});

// Get user details
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("User not found...");
  }
});

// Get Login Status
const getLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify the token
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    res.json(true);
  } catch (err) {
    res.status(401).json(false);
  }
});

// Update User Information
const upDateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, phone, address, state, country } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;
    user.state = req.body.state || state;
    user.country = req.body.country || country;

    const upDatedUser = await user.save();
    res.status(200).json(upDatedUser);
  } else {
    res.status(400);
    throw new Error("No changes were found...");
  }
});

// Update User's Photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user?._id);
  user.photo = photo;
  const updatedPhoto = await user.save();
  res.status(200).json(updatedPhoto);
});

// Save Cart
const saveCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;
  const user = await User.findById(req.user._id);
  if (user) {
    user.cartItems = cartItems;
    await user.save();
    res.status(200).json({ message: 'Cart saved successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get Cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Add to Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productID } = req.body;
  await User.findOneAndUpdate(
    { email: req.user.email },
    {
      $addToSet: {
        wishlist: productID
      }
    }
  );
  res.status(200).json({ message: 'Product was added to wishlist' });
});

// Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const list = await User.findOne({
    email: req.user.email,
  }).select('wishlist')
    .populate('wishlist');

  res.status(200).json(list);
});

// Remove from Wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productID } = req.params;
  await User.findOneAndUpdate({
    email: req.user.email
  },
    { $pull: { wishlist: productID } }
  );

  res.status(200).json({ message: 'Product removed from wishlist' });
});

module.exports = {
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
};

