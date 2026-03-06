import pool from "../config/db.js";

export const findLocationByUserId = async (userId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM locations WHERE user_id = ?",
      [userId],
    );

    return rows.length ? rows[0] : undefined;
  } catch (error) {
    console.error("Erreur findLocationByUserId :", error.message);
    throw error;
  }
};

export const upsertLocation = async ({ userId, latitude, longitude }) => {
  try {
    await pool.query(
      `
      INSERT INTO locations (user_id, latitude, longitude)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        latitude = VALUES(latitude),
        longitude = VALUES(longitude),
        updated_at = CURRENT_TIMESTAMP
      `,
      [userId, latitude, longitude],
    );
  } catch (error) {
    console.error("Erreur upsertLocation :", error.message);
    throw error;
  }
};

export const deleteLocationByUserId = async (userId) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM locations WHERE user_id = ?",
      [userId],
    );

    return result.affectedRows;
  } catch (error) {
    console.error("Erreur deleteLocationByUserId :", error.message);
    throw error;
  }
};

export const findAllLocations = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM locations");

    return rows;
  } catch (error) {
    console.error("Erreur findAllLocations :", error.message);
    throw error;
  }
};
