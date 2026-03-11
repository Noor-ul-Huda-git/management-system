import express from "express";
import upload from "../middlewares/multer.js";
import doctorAuth from "../middlewares/doctorAuth.js";

import {
  createDoctor,
  toggleAvailability,
  getDoctors,
  getDoctorById,
  doctorLogin,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

// public routes
doctorRouter.get("/", getDoctors);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/:id", getDoctorById);

// create doctor
doctorRouter.post("/", upload.single("image"), createDoctor);

// after login
doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);

doctorRouter.post(
  "/:id/toggle-availability",
  doctorAuth,
  toggleAvailability
);

doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
