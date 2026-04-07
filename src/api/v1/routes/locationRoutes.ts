import express, { Router } from "express";
import * as locationController from "../controllers/locationController";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", locationController.getAllLocations);
router.post("/", locationController.createLocation);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

export default router;
