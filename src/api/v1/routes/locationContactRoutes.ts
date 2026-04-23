import express, { Router } from "express";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

import {
  getAllLocationContacts,
  getLocationContactById,
  createLocationContact,
  updateLocationContact,
  deleteLocationContact,
} from "../controllers/locationContactController";

const router: Router = express.Router();

// all roles can view
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user", "employee", "manager"] }),
  getAllLocationContacts,
);

router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["user", "employee", "manager"] }),
  getLocationContactById,
);

// only manager can create, update, and delete
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  createLocationContact,
);

router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  updateLocationContact,
);

router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  deleteLocationContact,
);

export default router;
