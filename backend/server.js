import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import coverLetterRoutes from './routes/coverLetterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import renderRoutes from './routes/renderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerforge';

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch((err) => console.error('✗ MongoDB connection failed:', err));

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/render', renderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 
 
