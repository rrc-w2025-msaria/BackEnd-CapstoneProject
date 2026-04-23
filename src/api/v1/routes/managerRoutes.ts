import express, { Router } from "express";
import { setCustomClaims } from "../controllers/managerController";
import authenticate from "../middleware/authenticate";

const router: Router = express.Router();

router.post("/setCustomClaims", authenticate, setCustomClaims);

export default router;
