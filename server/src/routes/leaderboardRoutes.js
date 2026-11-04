import express from 'express';
import { getLeaderboard, getLeaderboardOverview } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/overview', getLeaderboardOverview);

export default router;
