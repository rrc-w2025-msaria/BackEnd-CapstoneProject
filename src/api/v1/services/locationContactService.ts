import {
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase-admin/firestore";
import { LocationContact } from "../models/locationContactModel";
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../repositories/firestoreRepository";
import { NotFoundError } from "../errors/errors";

// reference to the firestore collection name
const COLLECTION: string = "locationContacts";

// get all location contacts
export const getAllLocationContacts = async (): Promise<LocationContact[]> => {
  try {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const locationContacts: LocationContact[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        ...data,
      } as LocationContact;
    });

    return locationContacts;
  } catch (error: unknown) {
    throw error;
  }
};

//get location contact by id
export const getLocationContactById = async (
  id: string,
): Promise<LocationContact> => {
  const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

  if (!doc) {
    throw new NotFoundError(
      "Location Contact not found",
      "LOCATION_CONTACT_NOT_FOUND",
    );
  }

  const data: DocumentData | undefined = doc.data();
  const locationContact: LocationContact = {
    id: doc.id,
    ...data,
  } as LocationContact;

  return structuredClone(locationContact);
};

// create location contact
export const createLocationContact = async (
  locationId: string,
  contactName: string,
  email: string,
): Promise<LocationContact> => {
  const locationDoc = await getDocumentById("locations", locationId);

  if (!locationDoc) {
    // when locationId does not exists when attemping to create contact
    throw new NotFoundError("Location does not exist", "LOCATION_NOT_FOUND");
  }

  const newLocationContact: Partial<LocationContact> = {
    locationId,
    contactName,
    email,
  };

  const locationContactId: string = await createDocument<LocationContact>(
    COLLECTION,
    newLocationContact,
  );

  return {
    id: locationContactId,
    locationId: locationId,
    contactName,
    email,
  };
};

export const updateLocationContact = async (
  id: string,
  email: string,
): Promise<LocationContact> => {
  const locationContact: LocationContact = await getLocationContactById(id);
  const updatedLocationContact: LocationContact = {
    ...locationContact,
    email,
  };

  await updateDocument<LocationContact>(COLLECTION, id, updatedLocationContact);

  return structuredClone(updatedLocationContact);
};

// delete location contact
export const deleteLocationContact = async (id: string): Promise<void> => {
  await getLocationContactById(id);
  await deleteDocument(COLLECTION, id);
};
