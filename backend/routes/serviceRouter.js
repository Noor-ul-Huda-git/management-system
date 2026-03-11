// import express from "express";
// import upload from "../middlewares/multer.js";
// import{createService} from "../controllers/serviceController.js";

// const upload = multer({ dest: "temp" });

// const serviceRouter=express.Router();
// serviceRouter.get("/",getServices);
// serviceRouter.get("/id",getServiceById);
// serviceRouter.post('/',upload.single("image"),createService);
// serviceRouter.put("/:id",upload.single("image"),updateService);

// serviceRouter.delete("/:id",deleteService);
// export default serviceRouter;


import express from "express";
import upload from "../middlewares/multer.js";

import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} from "../controllers/serviceController.js";

const serviceRouter = express.Router();

// Get all services
serviceRouter.get("/", getServices);

// Get single service by id
serviceRouter.get("/:id", getServiceById);

// Create service
serviceRouter.post("/", upload.single("image"), createService);

// Update service
serviceRouter.put("/:id", upload.single("image"), updateService);

// Delete service
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;
