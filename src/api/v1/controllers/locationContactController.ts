import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as locationContactService from "../services/locationContactService";
import { Location } from "../models/locationModel";
import { successResponse } from "../models/responseModel";
import { LocationContact } from "../models/locationContactModel";

// get all location contacts
export const getAllLocationContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const locationContacts: LocationContact[] =
      await locationContactService.getAllLocationContacts();
    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(
          locationContacts,
          "Location Contacts successfully retrieved",
        ),
      );
  } catch (error: unknown) {
    next(error);
  }
};

// get location contacts by id
export const getLocationContactById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const locationContact: LocationContact =
      await locationContactService.getLocationContactById(id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse(locationContact, "Location contact retrieved"));
  } catch (error: unknown) {
    next(error);
  }
};

// create location contact
export const createLocationContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract only the fields we want (destructuring)
    // const name: string = req.body.name;
    // const description: string = req.body.description;
    const { locationId, contactName, email } = req.body;

    const newLocationContact: LocationContact =
      await locationContactService.createLocationContact(
        locationId,
        contactName,
        email,
      );
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        successResponse(
          newLocationContact,
          "Location Contact created successfully",
        ),
      );
  } catch (error: unknown) {
    next(error);
  }
};

// update location contact
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // const id: string = req.params.id;
    const id = req.params.id as string;

    // Extract update fields
    const { email } = req.body;

    // create the update item object with the fields to be updated
    const updatedLocationContact: LocationContact =
      await locationContactService.updateLocationContact(id, email);

    res
      .status(HTTP_STATUS.OK)
      .json(
        successResponse(
          updatedLocationContact,
          "Location contact updated successfully",
        ),
      );
  } catch (error: unknown) {
    next(error);
  }
};

// delete location contact
export const deleteLocatioContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    await locationContactService.deleteLocationContact(id);
    res
      .status(HTTP_STATUS.OK)
      .json(successResponse("Location contact successfully deleted"));
  } catch (error: unknown) {
    next(error);
  }
};
