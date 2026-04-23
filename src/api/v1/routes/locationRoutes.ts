import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { locationSchemas } from "../validations/locationValidation";
import * as locationController from "../controllers/locationController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// get all locations - all roles
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  locationController.getAllLocations,
);

// get location by id - manager only
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.getLocationById),
  locationController.getLocationById,
);

// create location - for all roles
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  validateRequest(locationSchemas.createLocation),
  locationController.createLocation,
);

// update location - manager only
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.updateLocation),
  locationController.updateLocation,
);

// delete location - manager only
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.deleteLocation),
  locationController.deleteLocation,
);

export default router;
