import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";
import { get } from "mongoose";

const app = express();
const port = 4000;
const allowedOrigins=[
  "http://localhost:5173",
  "http://localhost:5174",
]

// Middelwares
app.use(cors({
  origin:function(origin,callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      return callback(null, true)
    }
    return callback(new Error("Not allowed by Cors"));
  },
  credentials:true,
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type", "Authorization"]
}))
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json({limit:"20mb", extended:true}))


// DB
connectDB();

// Routes
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);
app.get('/',(req,res)=>{
  res.send("API WORKING");
});
app.listen(port,()=>{
  console.log(`Server Started on http://localhost:${port}`);
})