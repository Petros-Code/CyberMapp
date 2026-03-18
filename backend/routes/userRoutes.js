import { Router } from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { upload, uploadAvatar } from '../controllers/userController.js'

const router = Router()

// POST /api/users/avatar
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar)

export default router
