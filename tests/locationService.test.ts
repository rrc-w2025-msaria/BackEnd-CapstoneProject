import { NotFoundError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  createDocument: jest.fn(),
  getDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

import * as locationService from "../src/api/v1/services/locationService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Location } from "../src/api/v1/models/locationModel";

describe("Location Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // creates location
  it("should create a location successfully", async () => {
    //arrange
    const mockLocationData = {
      id: "loc-1",
      name: "Test Location",
      address: "123 Main St",
    };

    (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(
      mockLocationData.id,
    );

    // act
    const result = await locationService.createLocation(
      mockLocationData.name,
      mockLocationData.address,
    );

    // assert
    expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
      "locations",
      expect.objectContaining({
        name: mockLocationData.name,
        address: mockLocationData.address,
      }),
    );

    expect(result).toEqual(mockLocationData);
  });

  // get all locations
  it("should get all locations successfully", async () => {
    const mockLocations = [
      { id: "loc-1", name: "Location 1", address: "Address 1" },
      { id: "loc-2", name: "Location 2", address: "Address 2" },
    ];

    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: mockLocations.map((loc) => ({
        id: loc.id,
        data: () => ({ name: loc.name, address: loc.address }),
      })),
    });

    const result = await locationService.getAllLocations();

    expect(result).toEqual(mockLocations);
  });

  it("should handle empty location list", async () => {
    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: [],
    });

    const result = await locationService.getAllLocations();

    expect(result).toEqual([]);
  });

  // get location by id
  it("should get a location by id successfully", async () => {
    const mockLocation: Location = {
      id: "loc-1",
      name: "Location 1",
      address: "Address 1",
    };

    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
      id: mockLocation.id,
      data: () => ({
        name: mockLocation.name,
        address: mockLocation.address,
      }),
    });

    const result = await locationService.getLocationById(mockLocation.id);

    expect(result).toEqual(mockLocation);
  });

  it("should throw NotFoundError when location not found", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

    await expect(locationService.getLocationById("invalid-id")).rejects.toThrow(
      NotFoundError,
    );
  });

  // update location
  it("should update a location successfully", async () => {
    const mockLocation: Location = {
      id: "loc-1",
      name: "Location 1",
      address: "Old Address",
    };

    jest
      .spyOn(locationService, "getLocationById")
      .mockResolvedValue(mockLocation);

    (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    const result = await locationService.updateLocation(
      mockLocation.id,
      "New Address",
    );

    expect(result.address).toBe("New Address");
  });

  it("should throw error when updating non-existent location", async () => {
    jest
      .spyOn(locationService, "getLocationById")
      .mockRejectedValue(
        new NotFoundError("Location not found", "LOCATION_NOT_FOUND"),
      );

    await expect(
      locationService.updateLocation("bad-id", "New Address"),
    ).rejects.toThrow(NotFoundError);
  });

  // delete a location
  it("should delete a location successfully", async () => {
    const mockLocation: Location = {
      id: "loc-1",
      name: "Location 1",
      address: "Address 1",
    };

    // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
    jest
      .spyOn(locationService, "getLocationById")
      .mockResolvedValue(mockLocation);

    // jestMock replaces the auto-mocked version with our specific mocked implementation
    (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    // act
    await locationService.deleteLocation(mockLocation.id);

    // assert
    expect(locationService.getLocationById).toHaveBeenCalledWith(
      mockLocation.id,
    );
    expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
      "locations",
      mockLocation.id,
    );
  });

  it("should throw error when deleting non-existent location", async () => {
    jest
      .spyOn(locationService, "getLocationById")
      .mockRejectedValue(
        new NotFoundError("Location not found", "LOCATION_NOT_FOUND"),
      );

    await expect(locationService.deleteLocation("bad-id")).rejects.toThrow(
      NotFoundError,
    );
  });
});
