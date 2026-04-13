import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import {
  createServiceAppointment,
  confirmServicePayment,
  getServiceAppoitments,
  getServiceAppointmentById,
  cancelServiceAppointment,
  getServiceAppointmentStats,
  getServiceAppointmentsByPatient
} from "../controllers/serviceAppointmentController.js";

const serviceAppointmentRouter = express.Router();

serviceAppointmentRouter.get("/", getServiceAppoitments);
serviceAppointmentRouter.get("/confirm", confirmServicePayment);
serviceAppointmentRouter.get("/stats/summary", getServiceAppointmentStats);

serviceAppointmentRouter.post("/", clerkMiddleware(), requireAuth(), createServiceAppointment);
serviceAppointmentRouter.get("/me", clerkMiddleware(), requireAuth(), getServiceAppointmentsByPatient);

serviceAppointmentRouter.get("/:id", getServiceAppointmentById);
serviceAppointmentRouter.post("/:id/cancel", cancelServiceAppointment);

export default serviceAppointmentRouter;
