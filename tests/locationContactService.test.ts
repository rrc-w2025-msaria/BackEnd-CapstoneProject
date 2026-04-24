jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  createDocument: jest.fn(),
  getDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

import * as locationContactService from "../src/api/v1/services/locationContactService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { LocationContact } from "../src/api/v1/models/locationContactModel";
import { NotFoundError } from "../src/api/v1/errors/errors";

// mock firestore BEFORE importing service dependencies fully
// jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("LocationContact Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //get all location contacrts
  it("should get all location contacts successfully", async () => {
    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: [
        {
          id: "1",
          data: () => ({
            locationId: "loc-1",
            contactName: "John Doe",
            email: "john@test.com",
          }),
        },
      ],
    });

    const result = await locationContactService.getAllLocationContacts();

    expect(result.length).toBe(1);
    expect(result[0].contactName).toBe("John Doe");
  });

  it("should return empty list when no contacts exist", async () => {
    (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
      docs: [],
    });

    const result = await locationContactService.getAllLocationContacts();

    expect(result).toEqual([]);
  });

  // get locationcontact by id
  it("should get location contact by id", async () => {
    const mockContact: LocationContact = {
      id: "1",
      locationId: "loc-1",
      contactName: "John",
      email: "john@test.com",
    };

    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
      id: mockContact.id,
      data: () => ({
        locationId: mockContact.locationId,
        contactName: mockContact.contactName,
        email: mockContact.email,
      }),
    });

    const result = await locationContactService.getLocationContactById("1");

    expect(result).toEqual(mockContact);
  });

  it("should throw error if location contact not found", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

    await expect(
      locationContactService.getLocationContactById("bad-id"),
    ).rejects.toThrow(NotFoundError);
  });

  // create location contact
  it("should create location contact successfully", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
      id: "loc-1",
    });

    (firestoreRepository.createDocument as jest.Mock).mockResolvedValue("1");

    const result = await locationContactService.createLocationContact(
      "loc-1",
      "John Doe",
      "john@test.com",
    );

    expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
      "locationContacts",
      expect.objectContaining({
        locationId: "loc-1",
        contactName: "John Doe",
        email: "john@test.com",
      }),
    );

    expect(result.id).toBe("1");
  });

  it("should throw error when location does not exist", async () => {
    (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

    await expect(
      locationContactService.createLocationContact(
        "bad-loc",
        "John",
        "john@test.com",
      ),
    ).rejects.toThrow(NotFoundError);
  });

  // update location contact
  it("should update location contact email", async () => {
    const existing: LocationContact = {
      id: "1",
      locationId: "loc-1",
      contactName: "John",
      email: "old@mail.com",
    };

    jest
      .spyOn(locationContactService, "getLocationContactById")
      .mockResolvedValue(existing);

    (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    const result = await locationContactService.updateLocationContact(
      "1",
      "new@mail.com",
    );

    expect(result.email).toBe("new@mail.com");
  });

  // delete location contact
  it("should delete location contact successfully", async () => {
    const existing: LocationContact = {
      id: "1",
      locationId: "loc-1",
      contactName: "John",
      email: "john@test.com",
    };

    jest
      .spyOn(locationContactService, "getLocationContactById")
      .mockResolvedValue(existing);

    (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(
      undefined,
    );

    await locationContactService.deleteLocationContact("1");

    expect(locationContactService.getLocationContactById).toHaveBeenCalledWith(
      "1",
    );

    expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
      "locationContacts",
      "1",
    );
  });

  it("should throw error when deleting non-existent contact", async () => {
    jest
      .spyOn(locationContactService, "getLocationContactById")
      .mockRejectedValue(
        new NotFoundError(
          "Location Contact not found",
          "LOCATION_CONTACT_NOT_FOUND",
        ),
      );

    await expect(
      locationContactService.deleteLocationContact("bad-id"),
    ).rejects.toThrow(NotFoundError);
  });
});
