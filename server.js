
const  express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const ProductData = require("./models/user.js")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const errorHandler = require("./middleware/errorMiddleWare.js")
const  userRouter = require("./routes/userRoute.js")
const  productRoute = require("./routes/productRoute.js")
const  categoryRoute = require("./routes/categoryRoute.js")
const brandRoute = require("./routes/brandRoutes.js")
const couponRoute =  require("./routes/couponRoute.js")
const orderRoute =  require("./routes/orderRoute.js")
const transactionRoute =  require("./routes/transactionRoute.js")

//const ProductData = require("./models")

dotenv.config();
const app =express()



//app.use(express.static("public"));

//app.use(express.static('public')) 




const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [ 
    //"http://localhost:8000",
   //   "http://localhost:3000",
    
 "https://www.shoppitapp.online/",
   "https://www.app.shoppitapp.online/",
   "https://app.shoppitapp.online/",
   "https://shoppitapp.online/"
  
  ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allow by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Cookie", "Authorization", 'X-Requested-With'],
  allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', ],
  Vary: Origin,
};


app.use(cors(corsOptions));









app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/transaction", transactionRoute)

app.use(express.json())



mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection

db.on('error', (err) => { // Corrected this line
    console.error("connection error:", err);
  });
db.once("open", (()=>{
    console.log('Connected to the database!');
}))




app.use("/api/user", userRouter)
app.use("/api/products", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/brand", brandRoute)
app.use("/api/coupon", couponRoute)
app.use("/api/order", orderRoute)




app.get('/',(req,res)=>{
  res.send(' Home Page Loading... ')
})



app.use(errorHandler)

const port = process.env.PORT || 8000 

app.listen(port, console.log(`Server listening on ${port}`))
















