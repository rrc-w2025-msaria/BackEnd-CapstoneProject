import {
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase-admin/firestore";
import { Location } from "../models/locationModel";
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../repositories/firestoreRepository";
import { NotFoundError } from "../errors/errors";

// reference to the firestore collection name
const COLLECTION: string = "locations";

/**
 * Retrieves all locations from storage
 * @returns Array of all locations
 */
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const locations: Location[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Location;
    });

    return locations;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a single location by ID from the database
 * @param id - This ID of the location to retrieve
 * @returns The loan if found
 */
export const getLocationById = async (id: string): Promise<Location> => {
  const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

  if (!doc) {
    throw new NotFoundError("Location not found", "LOCATION_NOT_FOUND");
  }

  const data: DocumentData | undefined = doc.data();
  const location: Location = {
    id: doc.id,
    ...data,
  } as Location;

  return structuredClone(location);
};

/**
 * Creates a new loan
 * @returns The created loan with generated ID
 */
export const createLocation = async (
  id: string,
  name: string,
  address: string,
): Promise<Location> => {
  const newLocation: Partial<Location> = {
    id,
    name,
    address,
  };

  const locationId: string = await createDocument<Location>(
    COLLECTION,
    newLocation,
  );

  return structuredClone({ id: locationId, ...newLocation } as Location);
};

export const updateLocation = async (
  id: string,
  address: string,
): Promise<Location> => {
  // check if the location exists before updating
  const location: Location = await getLocationById(id);
  const updatedLocation: Location = {
    ...location,
    address,
  };

  await updateDocument<Location>(COLLECTION, id, updatedLocation);

  return structuredClone(updatedLocation);
};

/**
 * Deletes an location from storage
 * @param id - The ID of the location to delete
 * @throws Error if location with given ID is not found
 */
export const deleteLocation = async (id: string): Promise<void> => {
  // check if the location exists before deleting
  const location: Location = await getLocationById(id);
  if (!location) {
    throw new NotFoundError("Location not found", "LOCATION_NOT_FOUND");
  }

  await deleteDocument(COLLECTION, id);
};
