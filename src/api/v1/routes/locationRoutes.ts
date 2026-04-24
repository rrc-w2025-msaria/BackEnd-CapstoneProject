import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { locationSchemas } from "../validations/locationValidation";
import * as locationController from "../controllers/locationController";
import { getItemsByLocationId } from "../controllers/itemController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// get all locations - all roles
/**
 * @openapi
 * /locations:
 *   get:
 *     summary: Retrieve a list of all locations
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  locationController.getAllLocations,
);

// get all items from a specific location
/**
 * @openapi
 * /locations/{id}/items:
 *   get:
 *    summary: Retrieve all items at a specific location
 *    tags: [Locations]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID of the location
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Items at location retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Item'
 *      404:
 *        description: Location not found
 *      403:
 *        description: Not authorized to view items at this location
 */
router.get(
  "/:id/items",
  authenticate,
  isAuthorized({ hasRole: ["user", "employee", "manager"] }),
  getItemsByLocationId,
);

// get location by id - manager only
/**
 * @openapi
 * /locations/{id}:
 *  get:
 *    summary: Retrieve a location by ID
 *    tags: [Locations]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Location retrieved successfully
 *      404:
 *        description: Location not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.getLocationById),
  locationController.getLocationById,
);

// create location - for all roles
/**
 * @openapi
 * /locations:
 *   post:
 *     summary: Creates a new Location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Item Name"
 *               address:
 *                 type: string
 *                 example: "123 Address Street"
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Invalid input data
 */

router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager", "employee", "user"] }),
  validateRequest(locationSchemas.createLocation),
  locationController.createLocation,
);

// update location - manager only
/**
 * @openapi
 * /locations/{id}:
 *   put:
 *     summary: Update a location's address
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the Location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       403:
 *         description: Not authorized to update this location
 */
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.updateLocation),
  locationController.updateLocation,
);

// delete location - manager only
/**
 * @openapi
 * /locations/{id}:
 *   delete:
 *     summary: Delete this location
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the Location
 *     responses:
 *       200:
 *         description: Location deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Location not found
 *       403:
 *         description: Not authorized to delete this location
 */
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  validateRequest(locationSchemas.deleteLocation),
  locationController.deleteLocation,
);

export default router;
