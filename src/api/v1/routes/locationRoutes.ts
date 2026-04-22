import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { locationSchemas } from "../validations/locationValidation";
import * as locationController from "../controllers/locationController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// get all locations
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  locationController.getAllLocations,
);

// get location by id
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.getLocationById),
  locationController.getLocationById,
);

// create location
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.createLocation),
  locationController.createLocation,
);

// update location
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.updateLocation),
  locationController.updateLocation,
);

// delete location
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.deleteLocation),
  locationController.deleteLocation,
);

export default router;
