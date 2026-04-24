import Joi from "joi";

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
