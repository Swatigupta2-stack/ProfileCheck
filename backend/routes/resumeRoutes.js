import express from 'express';
import multer from 'multer';
import {
  saveResume,
  getResumeById,
  getResumesByUser,
  deleteResume,
  parseResume,
} from '../controllers/resumeController.js';

const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post('/save', saveResume);
router.post('/parse', upload.single('file'), parseResume);
router.get('/:id', getResumeById);
router.get('/user/:userId', getResumesByUser);
router.delete('/:id', deleteResume);

export default router;
