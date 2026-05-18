import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getUserResumes,
  getUserCoverLetters,
  deleteAccount,
  getSubscriptionStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/subscription/:userId', getSubscriptionStatus);

// Private routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/:userId/resumes', protect, getUserResumes);
router.get('/:userId/cover-letters', protect, getUserCoverLetters);
router.delete('/account', protect, deleteAccount);

export default router;
