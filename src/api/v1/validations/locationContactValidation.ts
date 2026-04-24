import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     LocationContact:
 *       type: object
 *       required:
 *         - id
 *         - locationId
 *         - contactName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an item
 *           example: "item_abc123"
 *         locationId:
 *           type: string
 *           description: Id of the location associated with the contact person
 *           example: "wtYWq0CQI1l3rN3K1kAA"
 *         contactName:
 *           type: string
 *           description: Name of the contact person
 *           example: "Marylen Saria"
 *         email:
 *           type: string
 *           description: email of the contact person
 *           example: "marylen@lostandfound.com"
 */
export const locationContactSchemas = {
  createLocationContact: {
    body: Joi.object({
      locationId: Joi.string().required().messages({
        "string.empty": "Location ID is required",
      }),
      contactName: Joi.string().min(2).max(100).required().messages({
        "string.empty": "Contact name is required",
        "string.min": "Contact name must be at least 2 characters",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be valid",
      }),
    }),
  },

  getContactsByLocationId: {
    params: Joi.object({
      locationId: Joi.string().required().messages({
        "string.empty": "Location ID is required",
      }),
    }),
  },

  updateLocationContact: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "LocationContact ID is required",
      }),
    }),

    body: Joi.object({
      locationId: Joi.string().optional(),
      contactName: Joi.string().min(2).max(100).optional(),
      email: Joi.string().email().optional(),
    })
      .min(1)
      .messages({
        "object.min": "At least one field must be provided to update",
      }),
  },

  deleteLocationContact: {
    params: Joi.object({
      id: Joi.string().required().messages({
        "string.empty": "LocationContact ID is required",
      }),
    }),
  },
};
