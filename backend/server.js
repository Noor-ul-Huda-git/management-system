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

const app = express();
const port = 4000;


// console.log("CLERK KEY:", process.env.CLERK_PUBLISHABLE_KEY);
console.log("CLERK SECRET:", process.env.CLERK_SECRET_KEY);


// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

// ✅ CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not Allowed By Cors"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Clerk Middleware (IMPORTANT)
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// Body parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// DB Connection
connectDB();



// Routes
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);


// Test Route
app.get("/", (req, res) => {
  res.send("API WORKING ✅");
});

// Server start
app.listen(port, () => {
  console.log(`🚀 Server Started on http://localhost:${port}`);
});