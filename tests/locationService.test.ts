import * as locationService from "../src/api/v1/services/locationService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Location } from "../src/api/v1/models/locationModel";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

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
      mockLocationData.id,
      mockLocationData.name,
      mockLocationData.address,
    );

    // assert
    expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
      "locations",
      expect.objectContaining(mockLocationData),
    );

    expect(result).toEqual(mockLocationData);
  });

  // READ ALL
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
    expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("locations");
  });

  // READ BY ID
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
    expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(
      "locations",
      mockLocation.id,
    );
  });

  // UPDATE
  it("should update a location successfully", async () => {
    const mockLocation: Location = {
      id: "loc-1",
      name: "Location 1",
      address: "Old Address",
    };

    const updatedAddress = "New Address";

    jest
      .spyOn(locationService, "getLocationById")
      .mockResolvedValue(mockLocation);

    (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    const result = await locationService.updateLocation(
      mockLocation.id,
      updatedAddress,
    );

    expect(locationService.getLocationById).toHaveBeenCalledWith(
      mockLocation.id,
    );
    expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
      "locations",
      mockLocation.id,
      expect.objectContaining({
        ...mockLocation,
        address: updatedAddress,
      }),
    );

    expect(result.address).toBe(updatedAddress);
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
});
