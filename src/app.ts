// import the express application and type definition
import express, { Express } from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { getHelmetConfig } from "./config/helmetConfig";
import getCorsOptions from "./config/corsConfig";

// Load environment variables BEFORE your internal imports!
dotenv.config();

import setupSwagger from "../config/swagger";
import itemRoutes from "./api/v1/routes/itemRoutes";
import userRoutes from "./api/v1/routes/userRoutes";
import managerRoutes from "./api/v1/routes/managerRoutes";
import locationRoutes from "./api/v1/routes/locationRoutes";
import locationContactRoutes from "./api/v1/routes/locationContactRoutes";

import errorHandler from "./api/v1/middleware/errorHandler";
import {
  accessLogger,
  errorLogger,
  consoleLogger,
} from "./api/v1/middleware/logger";

// initialize the express application
const app: Express = express();

// Apply Helmet's security headers
app.use(helmet());
app.use(getHelmetConfig());

// Configure CORS
app.use(cors());
app.use(cors(getCorsOptions()));

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
  // In production, log to files
  app.use(accessLogger);
  app.use(errorLogger);
} else {
  // In development, log to console for immediate feedback
  app.use(consoleLogger);
}

// Interface for health check response
// An interface in TypeScript defines the structure or "shape" of an object.
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}
// Middleware START

// Ensures incoming body is correctly parsed to JSON, otherwise req.body would be undefined
app.use(express.json());

// for file upload
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware END

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
  res.send("Hello World");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.json(healthData);
});

// Route Imports START
// "/api/v1/items" will prefix all item routes
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/manager", managerRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/locationContacts", locationContactRoutes);

// Route Imports END

// needs to be used last
app.use(errorHandler);

export default app;
