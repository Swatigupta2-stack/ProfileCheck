import express from 'express';
import {
  generateCoverLetter,
  saveCoverLetter,
  getCoverLetter,
  getUserCoverLetters,
  deleteCoverLetter,
} from '../controllers/coverLetterController.js';

const router = express.Router();

router.post('/generate', generateCoverLetter);
router.post('/save', saveCoverLetter);
router.get('/:id', getCoverLetter);
router.get('/user/:userId', getUserCoverLetters);
router.delete('/:id', deleteCoverLetter);

export default router;
