// import express from 'express';
// import { clerkMiddleware,requireAuth } from '@clerk/express';
// import{getAppointments} from '../controllers/appointmentController.js';
// const appointmentRouter=express.Router();
// appointmentRouter.get("/",getAppointments);
// appointmentRouter.get("/confirm",confirmPayment);
// appointmentRouter.get("/stats/summary",getStats);
// // authentication Routes
// appointmentRouter.post('/',clerkMiddleware(),requireAuth(),createAppointment);
// appointmentRouter.get('/me',clerkMiddleware(),requireAuth(),getAppointmentsByPatient);
// appointmentRouter.get("/doctor/:doctorId",getAppointmentByDoctor);
// appointmentRouter.post("/:id/cancel",cancelApointment);
// appointmentRouter.get('/patients/count',getRegisteredUserCount);
// appointmentRouter.put("/:id",updateAppointment);
// export default appointmentRouter;




import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import {
  getAppointments,
  confirmPayment,
  getStats,
  createAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  cancelAppointment,
  getRegisteredUserCount,
  updateAppointment
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/confirm", confirmPayment);
appointmentRouter.get("/stats/summary", getStats);

appointmentRouter.post("/", clerkMiddleware(), requireAuth(), createAppointment);

appointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getAppointmentsByPatient);

appointmentRouter.get("/doctor/:doctorId", getAppointmentsByDoctor);

appointmentRouter.post("/:id/cancel", cancelAppointment);

appointmentRouter.get("/patients/count", getRegisteredUserCount);

appointmentRouter.put("/:id", updateAppointment);

export default appointmentRouter;



