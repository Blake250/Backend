const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
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


 

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // 'http://localhost:3000',
      // 'http://localhost:8000',

      "https://shopito-app-one.vercel.app",
       "https://api-shopito-app.onrender.com",
      
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type",  "Authorization", "X-Requested-With", "Accept"],
  allowedMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
};

app.use(cors(corsOptions));


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Connection error:', err));



 app.use("/api/transaction", transactionRoute);
  app.use(express.json());
 
//  //Serve static files from the React frontend app
//  const buildPath = path.join(__dirname, './frontend_ecommerce/build', );
// //  const buildPath = path.join(__dirname, '/frontend_ecommerce', 'build');
//  console.log("Serving static files from:", buildPath);
 

// API Routes

app.use("/api/user", userRouter);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);






app.get("/",(req, res )=>{
  res.send("API is running...");


 })

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(buildPath));
//   app.get('*', (req, res) => {
//       res.sendFile(path.join(buildPath, 'index.html'));
//   });
// } else {
//   app.get('*', (req, res) => {
//       res.send("API is running...");
//   });
// }







 




// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});





















