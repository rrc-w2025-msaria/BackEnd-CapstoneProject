import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validations/itemValidation";
import * as itemController from "../controllers/itemController";
import { upload } from "../middleware/multerUploadFile";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// get all items - all roles
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  itemController.getAllItems,
);

// get item by id - all roles
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  validateRequest(itemSchemas.getItemById),
  itemController.getItemById,
);

// create item - all roles
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  upload.single("image"),
  validateRequest(itemSchemas.createItem),
  itemController.createItem,
);

// update item - manager and employee only
router.put(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager", "employee"],
  }),
  validateRequest(itemSchemas.updateItem),
  itemController.updateItem,
);

// delete item - manager only
router.delete(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager"],
  }),
  validateRequest(itemSchemas.deleteItem),
  itemController.deleteItem,
);

export default router;
