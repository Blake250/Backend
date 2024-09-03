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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8000',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Cookie", "Authorization", "X-Requested-With", "Accept"],
  allowedMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"],
};

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Connection error:', err));



  //Serve static files from the React frontend app
const buildPath = path.join(__dirname, '..', 'frontend_ecommerce', 'build');

console.log('Serving static files from:', path.join(__dirname, '..', 'frontend_ecommerce', 'build'));

app.use(express.static(buildPath));


// API Routes
app.use("/api/transaction", transactionRoute);
app.use("/api/user", userRouter);
app.use("/api/products", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);



app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


// if (process.env.NODE_ENV === 'production') {
//   const buildPath = path.resolve(__dirname, '..', 'frontend_ecommerce/build');
//   app.use(express.static(buildPath));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(buildPath, 'index.html'));
//   });
// }


// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

























// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// const path = require("path");
// const errorHandler = require("./middleware/errorMiddleWare.js");
// const userRouter = require("./routes/userRoute.js");
// const productRoute = require("./routes/productRoute.js");
// const categoryRoute = require("./routes/categoryRoute.js");
// const brandRoute = require("./routes/brandRoutes.js");
// const couponRoute = require("./routes/couponRoute.js");
// const orderRoute = require("./routes/orderRoute.js");
// const transactionRoute = require("./routes/transactionRoute.js");
// const serveStatic = require("serve-static")

// dotenv.config();
// const app = express();




// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = [
    
//     //   "https://shopito-app-zs1v.onrender.com",
//     // 'https://api-shopito-app.onrender.com',
//     'http://localhost:3000',
//     'http://localhost:8000'
  

//     ];
    
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log("Blocked origin:", origin);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//    credentials: true,
//   allowedHeaders: ["Content-Type", 'Cookie',"Authorization", 'X-Requested-With', 'Accept',  ],
//   allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE',  'OPTIONS', 'PUT']
// };






// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(cors(corsOptions));




// mongoose.connect(process.env.MONGODB_URL, {

// }).then(() => console.log('Connected to the database!'))
//   .catch(err => console.error('Connection error:', err));

  
//   app.use("/api/transaction", transactionRoute);
// app.use(express.json());


// //app.use(express.static( '/', serveStatic( path.join( './frontend_ecommerce/build'))) );
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')))
// }

// //app.use("/", serveStatic(path.join(__dirname,  '../frontend_ecommerce/build')));

// app.use("/api/user", userRouter);
// app.use("/api/products", productRoute);
// app.use("/api/category", categoryRoute);
// app.use("/api/brand", brandRoute);
// app.use("/api/coupon", couponRoute);
// app.use("/api/order", orderRoute);



// app.get('/*', (req, res) => {
//  //res.sendFile(path.join(__dirname, '..' './frontend_ecommerce/build', 'index.html'));
// res.sendFile(path.join(__dirname,'frontend_ecommerce', 'build', 'index.html'))

// }  );


// // app.get('*', (req, res) =>
// //   res.sendFile(
// //     path.resolve(__dirname, '..', 'frontend_ecommerce', 'build', 'index.html')
// //   )
// // );





// app.use(errorHandler);

// const port = process.env.PORT || 8000;

// app.listen(port, () => {
//   console.log(`Server listening on ${port}`);
// });





















