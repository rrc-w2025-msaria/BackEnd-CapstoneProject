import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an item
 *           example: "item_abc123"
 *         name:
 *           type: string
 *           description: The name of the location
 *           example: "Gym"
 *         address:
 *           type: string
 *           description: Address of the location
 *           example: "123 Main St"
 */

export const locationSchemas = {
  createLocation: {
    body: Joi.object({
      name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
      }),
      address: Joi.string().required(),
    }),
  },

  getLocationById: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Location ID is required",
      }),
    }),
  },

  updateLocation: {
    params: Joi.object({
      id: Joi.string().required(),
    }),

    body: Joi.object({
      address: Joi.string().required().messages({
        "any.only": "Address must be provided",
      }),
    }),
  },

  deleteLocation: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "Location ID is required",
      }),
    }),
  },
};
