import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { locationSchemas } from "../validations/locationValidation";
import * as locationController from "../controllers/locationController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// "/api/v1/locations" prefixes all below routes
router.get("/", locationController.getAllLocations);

router.get(
  "/:id",
  validateRequest(locationSchemas.getLocationById),
  locationController.getLocationById,
);

router.post(
  "/",
  authenticate,
  isAuthorized({
    hasRole: ["manager"],
    allowSameUser: true,
  }),
  validateRequest(locationSchemas.createLocation),
  locationController.createLocation,
);

router.put(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager"],
    allowSameUser: true,
  }),
  validateRequest(locationSchemas.updateLocation),
  locationController.updateLocation,
);

router.delete(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager"],
    allowSameUser: true,
  }),
  validateRequest(locationSchemas.deleteLocation),
  locationController.deleteLocation,
);

export default router;
