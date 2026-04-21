import Joi from "joi";
import { deleteItem } from "../services/itemService";

export const locationSchemas = {
  createLocation: {
    body: Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required(),
    }),
  },

  getLocationById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  updateLocation: {
    params: Joi.object({
      id: Joi.string().required(),
    }),

    body: Joi.object({
      address: Joi.string().required(),
    }),
  },
};
