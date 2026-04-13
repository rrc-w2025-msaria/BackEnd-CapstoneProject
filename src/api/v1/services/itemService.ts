import {
  QuerySnapshot,
  DocumentData,
  DocumentSnapshot,
} from "firebase-admin/firestore";
import { Item, itemStatus } from "../models/itemModel";
import {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../repositories/firestoreRepository";
import { NotFoundError } from "../errors/errors";

// reference to the firestore collection name
const COLLECTION: string = "items";

/**
 * Retrieves all items from storage
 * @returns Array of all items
 */
export const getAllItems = async (): Promise<Item[]> => {
  try {
    const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
    const items: Item[] = snapshot.docs.map((doc) => {
      const data: DocumentData = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
      } as Item;
    });

    return items;
  } catch (error: unknown) {
    throw error;
  }
};

/**
 * Retrieves a single Item by ID from the database
 * @param id - This ID of the Item to retrieve
 * @returns The loan if found
 */
export const getItemById = async (id: string): Promise<Item> => {
  const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

  if (!doc) {
    throw new NotFoundError("Item not found", "ITEM_NOT_FOUND");
  }

  const data: DocumentData | undefined = doc.data();
  const item: Item = {
    id: doc.id,
    ...data,
    createdAt: data?.createdAt?.toDate?.()?.toISOString?.() ?? data?.createdAt,
  } as Item;

  return structuredClone(item);
};

/**
 * Creates a new item
 * @returns The created item with generated ID
 */
export const createItem = async (itemData: {
  name: string;
  description: string;
  locationId: string;
  status: itemStatus;
  contactInfo: string;
  imageUrl?: string; // this is optional, if image can be provided
}): Promise<Item> => {
  const dateNow = new Date();
  const newItem: Partial<Item> = {
    ...itemData,
    createdAt: dateNow.toISOString(),
  };

  const itemId: string = await createDocument<Item>(COLLECTION, newItem);

  return structuredClone({ id: itemId, ...newItem } as Item);
};

/**
 * Updates (replaces) an existing Item
 * @param id - The ID of the loan to update
 * @param itemData - The fields to updates (name and/or description)
 * @returns The updated loan
 * @throws Error if loan with given ID is not found
 */
export const updateItem = async (
  id: string,
  status: itemStatus,
): Promise<Item> => {
  // check if the loan exists before updating
  const item: Item = await getItemById(id);
  const updatedItem: Item = {
    ...item,
    status,
    updatedAt: new Date().toISOString(),
  };

  await updateDocument<Item>(COLLECTION, id, updatedItem);

  return structuredClone(updatedItem);
};

/**
 * Deletes an loan from storage
 * @param id - The ID of the loan to delete
 * @throws Error if loan with given ID is not found
 */
export const deleteItem = async (id: string): Promise<void> => {
  // check if the item exists before deleting
  const item: Item = await getItemById(id);
  if (!item) {
    throw new NotFoundError("Item not found", "ITEM_NOT_FOUND");
  }

  await deleteDocument(COLLECTION, id);
};
