import express from 'express';
import { createSession, getSessionByCode, getUserRecentSessions } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createSession);
router.get('/code/:roomCode', protect, getSessionByCode);
router.get('/my/recent', protect, getUserRecentSessions);

export default router;
