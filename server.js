
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorMiddleWare.js");
const userRouter = require("./routes/userRoute.js");
const productRoute = require("./routes/productRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const brandRoute = require("./routes/brandRoutes.js");
const couponRoute = require("./routes/couponRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");

dotenv.config();
const app = express();


const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Cookie", "Authorization", 'X-Requested-With'],
  allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
};

app.use(cors(corsOptions));
app.use(cookieParser());




app.use("/api/transaction", transactionRoute);
app.use(express.json());





mongoose.connect(
process.env.MONGODB_URL 
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true
  // }
).then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Connection error:', err));


 


app.use("/api/user", userRouter);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);


app.use(errorHandler);

const port = process.env.PORT || 8000; 
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});








