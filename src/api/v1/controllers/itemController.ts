import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as itemService from "../services/itemService";
import { Item } from "../models/itemModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and reponses to retrieve all Items
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const items: Item[] = await itemService.getAllItems();
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(items, "Items successfully retrieved"));
  } catch (error: unknown) {
    next(error);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const item: Item = await itemService.getItemById(id);
    res.status(HTTP_STATUS.OK).json(successResponse(item, "Item retrieved"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests, reponses, and validation to create an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract only the fields we want (destructuring)
    // const name: string = req.body.name;
    // const description: string = req.body.description;
    const { name, description, locationId, status } = req.body;

    const imageUrl = req.file ? req.file.path : undefined;

    const newItem: Item = await itemService.createItem({
      name,
      description,
      locationId,
      status,
      imageUrl,
    });
    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newItem, "Item created successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests and reponses to update an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // const id: string = req.params.id;
    const id = req.params.id as string;

    // Extract update fields
    const { status } = req.body;

    // create the update item object with the fields to be updated
    const updatedItem: Item = await itemService.updateItem(id, status);

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedItem, "Item updated successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Manages requests and reponses to delete an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    await itemService.deleteItem(id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse("Item successfully deleted"));
  } catch (error: unknown) {
    next(error);
  }
};
