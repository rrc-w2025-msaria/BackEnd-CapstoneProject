import { NotFoundError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  createDocument: jest.fn(),
  getDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

jest.mock("../src/api/v1/services/locationService", () => ({
  getLocationById: jest.fn(),
}));

import * as itemService from "../src/api/v1/services/itemService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import * as locationService from "../src/api/v1/services/locationService";
import { Item, itemStatus } from "../src/api/v1/models/itemModel";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Item Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an item successfully", async () => {
    (locationService.getLocationById as jest.Mock).mockResolvedValue({
      id: "loc-1",
    });

    (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
      "item-1",
    );

    const mockItemData = {
      name: "Test Item",
      description: "Test Description",
      locationId: "loc-1",
      status: "lost" as itemStatus,
      contactInfo: "123-4567",
    };

    const result = await itemService.createItem(mockItemData);

    expect(firestoreRepository.createDocument).toHaveBeenCalled();
    expect(result.id).toBe("item-1");
  });

  it("should throw error when location does not exist", async () => {
    (locationService.getLocationById as jest.Mock).mockRejectedValue(
      new Error("not found"),
    );

    await expect(
      itemService.createItem({
        name: "Test",
        description: "Test",
        locationId: "bad-id",
        status: "lost",
        contactInfo: "123",
      }),
    ).rejects.toThrow(NotFoundError);
  });

  //get all items
  it("should get all items successfully", async () => {
    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            name: "Item 1",
            locationId: "loc-1",
            status: "lost",
            contactInfo: "123",
            createdAt: new Date(),
          }),
        },
      ],
    });

    const result = await itemService.getAllItems();

    expect(result.length).toBe(1);
  });

  // get item by id
  it("should get item by id", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
      id: "1",
      data: () => ({
        name: "Item",
        locationId: "loc-1",
        status: "lost",
        contactInfo: "123",
        createdAt: new Date(),
      }),
    });

    const result = await itemService.getItemById("1");

    expect(result.id).toBe("1");
  });

  it("should throw error if item not found", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

    await expect(itemService.getItemById("bad")).rejects.toThrow(NotFoundError);
  });

  // update
  it("should update item successfully", async () => {
    jest.spyOn(itemService, "getItemById").mockResolvedValue({
      id: "1",
      name: "Item",
      description: "desc",
      locationId: "loc",
      status: "lost",
      contactInfo: "123-4567",
      createdAt: new Date().toISOString(),
    });

    (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    const result = await itemService.updateItem("1", "found");

    expect(result.status).toBe("found");
  });

  // delete item
  it("should delete item successfully", async () => {
    jest.spyOn(itemService, "getItemById").mockResolvedValue({
      id: "1",
      name: "Item",
      description: "desc",
      locationId: "loc",
      status: "lost",
      contactInfo: "123-4567",
      createdAt: new Date().toISOString(),
    });

    (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    await itemService.deleteItem("1");

    expect(firestoreRepository.deleteDocument).toHaveBeenCalled();
  });

  it("should throw error when deleting non-existent item", async () => {
    jest
      .spyOn(itemService, "getItemById")
      .mockRejectedValue(new NotFoundError("Item not found", "ITEM_NOT_FOUND"));

    await expect(itemService.deleteItem("bad")).rejects.toThrow(NotFoundError);
  });

  // advanced feature - get items from specific location
  it("should get items by location id", async () => {
    (locationService.getLocationById as jest.Mock).mockResolvedValue({
      id: "loc-1",
    });

    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            locationId: "loc-1",
            createdAt: new Date(),
          }),
        },
      ],
    });

    const result = await itemService.getItemsByLocationId("loc-1");

    expect(result.length).toBe(1);
  });
});
