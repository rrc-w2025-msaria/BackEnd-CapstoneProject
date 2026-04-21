import express, { Router } from "express";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

import { createItem } from "../controllers/itemController";
import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  getUserDetails,
);

// can only create items
router.post(
  "/items",
  authenticate,
  isAuthorized({ hasRole: ["user"] }),
  createItem,
);

export default router;
