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
router.post("/update/:userId", authenticate, updateLocation);
router.delete("/delete/:userId", authenticate, deleteLocation);

export default router;
