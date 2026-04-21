import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validations/itemValidation";
import * as itemController from "../controllers/itemController";
import { upload } from "../middleware/multerUploadFile";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes

// get all items
router.get("/", itemController.getAllItems);

// get item by id
router.get(
  "/:id",
  validateRequest(itemSchemas.getItemById),
  itemController.getItemById,
);

// create item
router.post(
  "/",
  upload.single("image"),
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  validateRequest(itemSchemas.createItem),
  itemController.createItem,
);

// update item
router.put(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager", "employee"],
    allowSameUser: true,
  }),
  validateRequest(itemSchemas.updateItem),
  itemController.updateItem,
);

//delete item
router.delete(
  "/:id",
  authenticate,
  isAuthorized({
    hasRole: ["manager", "employee"],
    allowSameUser: true,
  }),
  validateRequest(itemSchemas.deleteItem),
  itemController.deleteItem,
);

export default router;
