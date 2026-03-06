import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.CRYPTO_SECRET;

if (!SECRET) {
  console.warn("⚠️  CRYPTO_SECRET manquant dans .env");
}

/**
 * Chiffre une valeur en AES
 * @param {string} value
 * @returns {string} valeur chiffrée
 */
export const encrypt = (value) => {
  if (!value) return value;
  return CryptoJS.AES.encrypt(String(value), SECRET).toString();
};

/**
 * Déchiffre une valeur AES
 * @param {string} value
 * @returns {string} valeur déchiffrée
 */
export const decrypt = (value) => {
  if (!value) return value;
  try {
    const bytes = CryptoJS.AES.decrypt(value, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    // Valeur non chiffrée (migration) → retournée telle quelle
    return value;
  }
};
