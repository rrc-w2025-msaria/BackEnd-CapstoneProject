import express, { Router } from "express";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController";

const router: Router = express.Router();

router.get(
  "/items",
  authenticate,
  isAuthorized({ hasRole: ["employee", "manager"] }),
  getAllItems,
);

router.get(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["employee", "manager"] }),
  getItemById,
);

router.post(
  "/items",
  authenticate,
  isAuthorized({ hasRole: ["employee", "manager"] }),
  createItem,
);

router.put(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["employee", "manager"] }),
  updateItem,
);

router.delete(
  "/items/:id",
  authenticate,
  isAuthorized({ hasRole: ["employee", "manager"] }),
  deleteItem,
);

export default router;
