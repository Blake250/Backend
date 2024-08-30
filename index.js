



const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
//const path = require("path");
const errorHandler = require("./middleware/errorMiddleWare.js");
const userRouter = require("./routes/userRoute.js");
const productRoute = require("./routes/productRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const brandRoute = require("./routes/brandRoutes.js");
const couponRoute = require("./routes/couponRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const transactionRoute = require("./routes/transactionRoute.js");
//const bodyParser = require('body-parser')
dotenv.config();
const app = express();







const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
    //  "https://api-shopito-app.vercel.app/",
    //  "https://shopito-app-zs1v.onrender.com/"
    // "http://localhost:8000",
    // "http://localhost:3000"
    process.env.FRONTEND_URL,
    process.env.BACKEND_URL

      
      

    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
   credentials: true,
  allowedHeaders: ["Content-Type", "Cookie", "Authorization", 'X-Requested-With', 'Accept',  ],
  allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE',  'OPTIONS', 'PUT']
};





// var whitelist = ['http://localhost:8000', 'http://localhost:3000']; //white list consumers
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(null, false);
//     }
//   },
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
// };

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






//app.use(cors(corsOptions));
mongoose.connect(process.env.MONGODB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Connection error:', err));

  
  app.use("/api/transaction", transactionRoute);
app.use(express.json());


app.use("/api/user", userRouter);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);
//app.use("/api/transaction", transactionRoute);


// The "catchall" handler: for any request that doesn't match any of the above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build/index.html'));
// });

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});





















