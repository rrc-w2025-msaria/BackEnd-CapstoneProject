import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as locationService from "../services/locationService";
import { Location } from "../models/locationModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and reponses to retrieve all Items
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const locations: Location[] = await locationService.getAllLocations();
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(locations, "Locations successfully retrieved"));
  } catch (error: unknown) {
    next(error);
  }
};

export const getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const location: Location = await locationService.getLocationById(id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(location, "Location retrieved"));
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
export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract only the fields we want (destructuring)
    // const name: string = req.body.name;
    // const description: string = req.body.description;
    const { name, address } = req.body;

    const newLocation: Location = await locationService.createLocation(
      name,
      address,
    );
    res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(newLocation, "Location created successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // const id: string = req.params.id;
    const id = req.params.id as string;

    // Extract update fields
    const { address } = req.body;

    // create the update item object with the fields to be updated
    const updatedLocation: Location = await locationService.updateLocation(
      id,
      address,
    );

    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(updatedLocation, "Location updated successfully"));
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    await locationService.deleteLocation(id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse("Location successfully deleted"));
  } catch (error: unknown) {
    next(error);
  }
};
