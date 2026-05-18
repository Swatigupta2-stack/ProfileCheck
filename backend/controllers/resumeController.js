import Resume from '../models/Resume.js';
import { parseResumeFile } from '../services/parseService.js';

export const parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[Resume Controller] Parsing file: ${req.file.originalname}`);
    const result = await parseResumeFile(req.file);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('[Resume Controller] Parse Error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume' });
  }
};

export const saveResume = async (req, res) => {
  try {
    const { userId, ...resumeData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const resume = await Resume.findOneAndUpdate(
      { userId },
      { userId, ...resumeData },
      { upsert: true, new: true }
    );

    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResumesByUser = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
