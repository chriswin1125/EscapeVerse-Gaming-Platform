import express from 'express';
import {
  getAdminStats,
  getAdminRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getAdminPuzzles,
  createPuzzle,
  updatePuzzle,
  deletePuzzle,
  getAdminUsers,
  updateUserRole
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply auth and admin check to all admin routes
router.use(protect, authorizeAdmin);

router.get('/stats', getAdminStats);

// Room management
router.get('/rooms', getAdminRooms);
router.post('/rooms', createRoom);
router.put('/rooms/:id', updateRoom);
router.delete('/rooms/:id', deleteRoom);

// Puzzle management
router.get('/puzzles', getAdminPuzzles);
router.post('/puzzles', createPuzzle);
router.put('/puzzles/:id', updatePuzzle);
router.delete('/puzzles/:id', deletePuzzle);

// User management
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
