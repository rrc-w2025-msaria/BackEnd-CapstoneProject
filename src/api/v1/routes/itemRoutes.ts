import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validations/itemValidation";
import * as itemController from "../controllers/itemController";
import { upload } from "../middleware/multerUploadFile";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// get all items - all roles
/**
 * @openapi
 * /items:
 *   get:
 *     summary: Retrieve a list of all items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/validations/Item'
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  itemController.getAllItems,
);

// get item by id - all roles
/**
 * @openapi
 * /items/{id}
 *  get:
 *    summary: Retrieve an item by ID
 *    tags: [Items]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: item retrieved successfully
 *      404:
 *        description: Item not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  validateRequest(itemSchemas.getItemById),
  itemController.getItemById,
);

// create item (including multer file upload for images) - all roles
/**
 * @openapi
 * /items:
 *   post:
 *     summary: Creates a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Item Name"
 *               description:
 *                 type: string
 *                 example: "Item Description"
 *               locationId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [lost, found, claimed]
 *                 example: "lost"
 *               contactInfo:
 *                 type: string
 *                 example: "(204) 123-4567"
 *               image:
 *                 type: file
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/validations/Item'
 *       400:
 *         description: Invalid input data
 */
router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  upload.single("image"),
  validateRequest(itemSchemas.createItem),
  itemController.createItem,
);

// update item - manager and employee only
/**
 * @openapi
 * /items/{id}:
 *   put:
 *     summary: Update a specific item's information
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/validations/Item'
 *             properties:
 *             status:
 *               type: string
 *               enum: [lost, found, claimed]
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/validations/Item'
 *       404:
 *         description: Item not found
 *       403:
 *         description: Not authorized to update this item
 */
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
/**
 * @openapi
 * /items/{id}:
 *   put:
 *     summary: Update a specific item's information
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the item
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/validations/Item'
 *       404:
 *         description: Item not found
 *       403:
 *         description: Not authorized to delete this item
 */
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
