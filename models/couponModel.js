const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: [true, "Please add a coupon Name"],
      minlength: [6, "coupon must be up to 6 characters"],
      maxLength: [12, "coupon must be up to 12 characters"],
    },
    discount: {
      type: String,
      required: true,
    },
    // Automatically added by Mongoose
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
