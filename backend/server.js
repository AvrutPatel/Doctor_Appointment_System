import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

//app config
const app = express()
const port=process.env.PORT || 4000;
connectDB()
connectCloudinary()

const allowedOrigins = [
  'http://localhost:5173', // Local client
  'http://localhost:5174', // Local admin
  'https://doctor-appointment-system-fawn.vercel.app', // Deployed client
  'https://doctor-appointment-system-uhkg.vercel.app'  // Deployed admin
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, 
}));

//middlewares
app.use(express.json())
app.use(cors())

//api endpoint
app.use('/api/admin',adminRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('Api working ')
})

app.listen(port,()=>{
    console.log("server is running on "+ port)
})
