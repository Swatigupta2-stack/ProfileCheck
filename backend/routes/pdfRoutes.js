import express from 'express';
import { generatePDF } from '../controllers/pdfController.js';

const router = express.Router();

// POST endpoint to generate PDF
router.post('/generate', generatePDF);

export default router;
