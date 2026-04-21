import express, { Router } from "express";
import * as itemController from "../controllers/itemController";
import { upload } from "../middleware/multerUploadFile";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);
router.post("/", upload.single("image"), itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

export default router;
