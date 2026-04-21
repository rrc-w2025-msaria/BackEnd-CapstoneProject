import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validations/itemValidation";
import * as itemController from "../controllers/itemController";
import { upload } from "../middleware/multerUploadFile";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", itemController.getAllItems);

router.get(
  "/:id",
  validateRequest(itemSchemas.getItemById),
  itemController.getItemById,
);

router.post(
  "/",
  upload.single("image"),
  validateRequest(itemSchemas.createItem),
  itemController.createItem,
);

router.put(
  "/:id",
  validateRequest(itemSchemas.updateItem),
  itemController.updateItem,
);

router.delete(
  "/:id",
  validateRequest(itemSchemas.deleteItem),
  itemController.deleteItem,
);

export default router;
