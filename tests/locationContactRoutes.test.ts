import request from "supertest";
import app from "../src/app";
import { auth } from "../src/config/firebaseConfig";

jest.mock("../src/config/firebaseConfig");

// auht middleware
jest.mock("../src/api/v1/middleware/authenticate", () => {
  return (req: any, res: any, next: any) => {
    const authHeader = req.headers?.authorization;

    // when no token is provided
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized: No token provided",
          code: "TOKEN_NOT_FOUND",
        },
      });
    }

    // simulate roles from token
    if (authHeader.includes("user")) {
      res.locals.uid = "user1";
      res.locals.role = "user";
    } else if (authHeader.includes("manager")) {
      res.locals.uid = "manager1";
      res.locals.role = "manager";
    } else {
      res.locals.uid = "admin1";
      res.locals.role = "admin";
    }

    next();
  };
});

// mock services
jest.mock("../src/api/v1/services/locationContactService", () => ({
  getAllLocationContacts: jest.fn(() => Promise.resolve([])),
  createLocationContact: jest.fn(() =>
    Promise.resolve({
      id: "contact-1",
      locationId: "loc-1",
      contactName: "John Doe",
      email: "john@test.com",
    }),
  ),
  updateLocationContact: jest.fn(),
  deleteLocationContact: jest.fn(() => Promise.resolve()),
}));

// mock firestore
jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
  getDocuments: jest.fn(() => Promise.resolve({ docs: [] })),
  getDocumentById: jest.fn(() =>
    Promise.resolve({ id: "loc-1", data: () => ({}) }),
  ),
  createDocument: jest.fn(() => Promise.resolve("contact-1")),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

describe("Location Contacts Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no token provided", async () => {
    const res = await request(app).get("/api/v1/locationContacts");

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("TOKEN_NOT_FOUND");
  });

  it("should allow user to view contacts", async () => {
    const res = await request(app)
      .get("/api/v1/locationContacts")
      .set("Authorization", "Bearer user-token");

    expect(res.status).toBe(200);
  });

  it("should allow manager to create contact", async () => {
    const res = await request(app)
      .post("/api/v1/locationContacts")
      .set("Authorization", "Bearer manager-token")
      .send({
        locationId: "loc-1",
        contactName: "John Doe",
        email: "john@test.com",
      });

    expect(res.status).toBe(201);
  });

  it("should block non-manager from deleting contact", async () => {
    const res = await request(app)
      .delete("/api/v1/locationContacts/contact-1")
      .set("Authorization", "Bearer user-token");

    expect(res.status).toBe(403);
  });
});
