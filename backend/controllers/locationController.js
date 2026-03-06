import {
  findLocationByUserId,
  upsertLocation,
  deleteLocationByUserId,
  findAllLocations,
} from "../model/locationModel.js";

export const getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const location = await findLocationByUserId(userId);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Localisation non trouvée",
      });
    }

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Erreur getUserLocation :", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude et longitude requises",
      });
    }

    await upsertLocation({ userId, latitude, longitude });

    return res.status(200).json({
      success: true,
      message: "Localisation mise à jour",
    });
  } catch (error) {
    console.error("Erreur updateLocation :", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleted = await deleteLocationByUserId(userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Localisation non trouvée",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Localisation supprimée",
    });
  } catch (error) {
    console.error("Erreur deleteLocation :", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const locations = await findAllLocations();

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("Erreur getAllLocations :", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
