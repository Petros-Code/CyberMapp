import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import { updateAvatarUrl } from '../model/userModel.js'

const storage = multer.memoryStorage()
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' })
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'cybermapp/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
        (error, result) => { if (error) reject(error); else resolve(result) }
      )
      stream.end(req.file.buffer)
    })

    await updateAvatarUrl(req.user.id, result.secure_url)

    res.json({ avatar_url: result.secure_url })
  } catch (err) {
    console.error('Erreur upload avatar :', err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}
