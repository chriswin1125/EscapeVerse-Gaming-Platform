import express from 'express';
import { getUserProfile, getAllAchievements } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/achievements', getAllAchievements);
router.get('/profile/:username', protect, getUserProfile);

export default router;
