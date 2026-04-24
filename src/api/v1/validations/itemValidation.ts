import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - status
 *         - contactInfo
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an item
 *           example: "item_abc123"
 *         name:
 *           type: string
 *           description: The name of the item
 *           example: "water bottle"
 *         description:
 *           type: string
 *           description: The description of the item
 *           example: "Pink nike water bottle"
 *         locationId:
 *           type: number
 *           description: ID of the location it was found/lost
 *           example: "wtYWq0CQI1l3rN3K1kAA"
 *         status:
 *           type: string
 *           description: current status of the item
 *           enum: [lost, found, claimed]
 *           example: "lost"
 *         contactInfo:
 *           type: string
 *           description: Contact information of the person who submitted the item
 *           example: "user@email.com"
 *         imageUrl:
 *           type: string
 *           description: optional image upload of the item
 *           example: "/uploads/image.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the item was created
 *           example: "2024-01-20T14:45:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the item was last updated
 *           example: "2024-01-20T14:45:00Z"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: "The name field is required"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               issue:
 *                 type: string
 *                 example: "must be a valid string"
 *           description: Detailed validation errors (optional)
 */

export const itemSchemas = {
  createItem: {
    body: Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "Name is required",
      }),

      description: Joi.string().required().messages({
        "string.empty": "Description is required",
      }),

      locationId: Joi.string().required().messages({
        "string.empty": "Location ID is required",
      }),

      status: Joi.string()
        .valid("lost", "found", "claimed")
        .required()
        .messages({
          "string.empty": "Status must be one of lost, found, or claimed",
        }),

      contactInfo: Joi.string().required().messages({
        "string.empty": "Contact info is required",
      }),
    }),
  },

  getItemById: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Item ID is required",
      }),
    }),
  },

  updateItem: {
    params: Joi.object({
      id: Joi.string().required(),
    }),

    body: Joi.object({
      status: Joi.string()
        .valid("lost", "found", "claimed")
        .required()
        .messages({
          "any.only": "Status must be one of lost, found, or claimed",
        }),
    }),
  },

  deleteItem: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Item ID is required",
      }),
    }),
  },
};
