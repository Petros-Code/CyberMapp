import express from "express";
import {
  getUserLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getAllLocations);
router.get("/:userId", getUserLocation);
router.post("/update/:userId", updateLocation);
router.delete("/delete/:userId", deleteLocation);

export default router;
