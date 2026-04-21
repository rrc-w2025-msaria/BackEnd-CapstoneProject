import Joi from "joi";

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
