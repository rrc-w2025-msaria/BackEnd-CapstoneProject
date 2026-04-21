import Joi from "joi";
import { deleteItem } from "../services/itemService";

export const itemSchemas = {
  createItem: {
    body: Joi.object({
      name: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters",
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
          "any.only": "Status must be lost, found, or claimed",
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
