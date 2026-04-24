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
/**
 * @openapi
 * /locationContacts:
 *   get:
 *     summary: Retrieve a list of all location contacts
 *     tags: [LocationContacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Location contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationContact'
 */
router.get(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["user", "employee", "manager"] }),
  getAllLocationContacts,
);

/**
 * @openapi
 * /locationContacts/{id}:
 *  get:
 *    summary: Retrieve an location contact by ID
 *    tags: [LocationContacts]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Location contact retrieved successfully
 *      404:
 *        description: Location contact not found
 */
router.get(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["user", "employee", "manager"] }),
  getLocationContactById,
);

// only manager can create, update, and delete
/**
 * @openapi
 * /locationContacts:
 *   post:
 *     summary: Creates a new location contact
 *     tags: [LocationContacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationId
 *               - contactName
 *               - email
 *             properties:
 *               locationId:
 *                 type: string
 *               contactName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationContact'
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Not authorized to create contact
 */

router.post(
  "/",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  createLocationContact,
);

/**
 * @openapi
 * /locationContacts/{id}:
 *   put:
 *     summary: Update a specific location contact
 *     tags: [LocationContacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             locationId:
 *               type: string
 *             contactName:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Location contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locationId:
 *                   type: string
 *                 contactName:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Location not found
 *       403:
 *         description: Not authorized to update this contact
 */
router.put(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  updateLocationContact,
);

/**
 * @openapi
 * /locationContacts/{id}:
 *   delete:
 *     summary: Deelte a specific location contact
 *     tags: [LocationContacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the contact
 *     responses:
 *       200:
 *         description: Location Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationContact'
 *       404:
 *         description: Location Contact not found
 *       403:
 *         description: Not authorized to delete this location contact
 */
router.delete(
  "/:id",
  authenticate,
  isAuthorized({ hasRole: ["manager"] }),
  deleteLocationContact,
);

export default router;
