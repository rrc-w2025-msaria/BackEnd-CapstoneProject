import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { locationSchemas } from "../validations/locationValidation";
import * as locationController from "../controllers/locationController";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", locationController.getAllLocations);

router.get(
  "/:id",
  validateRequest(locationSchemas.getLocationById),
  locationController.getLocationById,
);

router.post(
  "/",
  validateRequest(locationSchemas.createLocation),
  locationController.createLocation,
);

router.put(
  "/:id",
  validateRequest(locationSchemas.updateLocation),
  locationController.updateLocation,
);

router.delete(
  "/:id",
  validateRequest(locationSchemas.deleteLocation),
  locationController.deleteLocation,
);

export default router;
