import express from "express";
import {
  getUserLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
} from "../controllers/locationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllLocations);
router.get("/:userId", authenticate, getUserLocation);
router.post("/update", authenticate, updateLocation);
router.delete("/delete", authenticate, deleteLocation);

export default router;
