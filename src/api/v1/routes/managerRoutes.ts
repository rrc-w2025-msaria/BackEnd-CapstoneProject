import express, { Router } from "express";
import { setCustomClaims } from "../controllers/managerController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";

import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController";

import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

router.post(
  "/setCustomClaims",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  setCustomClaims,
);

router.get(
  "/users/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getUserDetails,
);

// full items CRUD access
router.get(
  "/items",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getAllItems,
);

router.get(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getItemById,
);

router.post(
  "/items",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  createItem,
);

router.put(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  updateItem,
);

router.delete(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  deleteItem,
);

// full locations CRUD access
router.get(
  "/locations",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getAllLocations,
);

router.get(
  "/locations/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getLocationById,
);

router.post(
  "/locations",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  createLocation,
);

router.put(
  "/locations/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  updateLocation,
);

router.delete(
  "/locations/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  deleteLocation,
);

export default router;
