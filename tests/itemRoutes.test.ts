import request from "supertest";
import express from "express";
import itemRoutes from "../src/api/v1/routes/itemRoutes";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

import { auth } from "../src/config/firebaseConfig";

// mocks for middleware
jest.mock("../src/api/v1/middleware/authenticate", () => {
  return jest.fn((req: any, res: any, next: any) => {
    res.locals.uid = "user123";
    res.locals.role = "admin";
    next();
  });
});

jest.mock("../src/api/v1/middleware/authorize", () => {
  return jest.fn(() => (req: any, res: any, next: any) => next());
});

// controller mock
jest.mock("../src/api/v1/controllers/itemController", () => ({
  createItem: (req: any, res: any) =>
    res.status(201).json({
      success: true,
      id: "item-1",
      name: "Item",
    }),

  getAllItems: (req: any, res: any) =>
    res.status(200).json({
      success: true,
      data: [],
    }),
}));

const app = express();
app.use(express.json());
app.use("/api/v1/items", itemRoutes);

describe("Items Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create item successfully with valid role", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user1",
      role: "admin",
    });

    const res = await request(app).post("/api/v1/items").send({
      name: "Item",
      description: "Test item",
      locationId: "loc-1",
      status: "lost",
      contactInfo: "123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.name).toBe("Item");
  });

  it("should return 403 when role is insufficient", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user1",
      role: "user",
    });

    const res = await request(app).post("/api/v1/items").send({
      name: "Item",
      description: "Test item",
      locationId: "loc-1",
      status: "lost",
      contactInfo: "123",
    });

    expect(res.status).toBe(403);
  });
});
