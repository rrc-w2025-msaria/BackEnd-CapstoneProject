import * as itemService from "../src/api/v1/services/itemService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Item, itemStatus } from "../src/api/v1/models/itemModel";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Item Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an item successfully", async () => {
    // Arrange
    const mockItemData: {
      name: string;
      description: string;
      locationId: string;
      status: itemStatus;
    } = {
      name: "Test Item",
      description: "Test Description",
      locationId: "location-id",
      status: "lost",
    };
    const mockDocumentId: string = "test-item-id";

    (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
      mockDocumentId,
    );

    // Act
    const result: Item = await itemService.createItem(mockItemData);

    // Assert
    expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
      "items",
      expect.objectContaining({
        name: mockItemData.name,
        description: mockItemData.description,
        locationId: mockItemData.locationId,
        status: mockItemData.status,
        createdAt: expect.any(String),
      }),
    );
    expect(result.id).toBe(mockDocumentId);
    expect(result.name).toBe(mockItemData.name);
  });

  it("should delete an item successfully", async () => {
    // Arrange
    const mockDocumentId: string = "test-item-id";
    const mockItem: Item = {
      id: mockDocumentId,
      name: "Test Item",
      description: "Test Description",
      locationId: "location-id",
      status: "lost",
      createdAt: new Date().toISOString(),
    };

    // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
    jest.spyOn(itemService, "getItemById").mockResolvedValue(mockItem);

    // jest.Mock replaces the auto-mocked version with our specific mocked implementation
    (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    // Act
    await itemService.deleteItem(mockDocumentId);

    // Assert
    expect(itemService.getItemById).toHaveBeenCalledWith(mockDocumentId);
    expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
      "items",
      mockDocumentId,
    );
  });
});
