import request from "supertest";
import express from "express";
import locationRoutes from "../src/api/v1/routes/locationRoutes";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

import { auth } from "../src/config/firebaseConfig";

// fixed middleware mocks
jest.mock("../src/api/v1/middleware/authenticate", () => {
  return jest.fn((req: any, res: any, next: any) => {
    res.locals.uid = "user123";
    res.locals.role = "user";
    next();
  });
});

jest.mock("../src/api/v1/middleware/authorize", () => {
  return jest.fn(() => (req: any, res: any, next: any) => next());
});

// mock for controller
jest.mock("../src/api/v1/controllers/locationController", () => ({
  getAllLocations: (req: any, res: any) =>
    res.status(200).json({ success: true, data: [] }),

  createLocation: (req: any, res: any) =>
    res.status(201).json({
      success: true,
      id: "loc-1",
      name: "Test Location",
    }),

  deleteLocation: (req: any, res: any) =>
    res.status(200).json({ success: true }),
}));

const app = express();
app.use(express.json());
app.use("/api/v1/locations", locationRoutes);

describe("Locations Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no token provided", async () => {
    const res = await request(app).get("/api/v1/locations");

    expect(res.status).toBe(401);
  });

  it("should allow user to view locations", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user1",
      role: "user",
    });

    const res = await request(app)
      .get("/api/v1/locations")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
  });

  it("should allow manager to create location", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "manager1",
      role: "manager",
    });

    const res = await request(app)
      .post("/api/v1/locations")
      .set("Authorization", "Bearer token")
      .send({
        name: "Test Location",
        address: "123 Street",
      });

    expect(res.status).toBe(201);
  });

  it("should block non-manager from deleting location", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user1",
      role: "user",
    });

    const res = await request(app)
      .delete("/api/v1/locations/loc-1")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(403);
  });
});
