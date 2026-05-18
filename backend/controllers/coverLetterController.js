import CoverLetter from '../models/CoverLetter.js';
import { generateCoverLetter as generateCoverLetterService } from '../services/coverLetterAgent.js';

/**
 * Generate a new cover letter
 */
export async function generateCoverLetter(req, res) {
  try {
    const { jobDescription, resumeData, companyName } = req.body;

    if (!jobDescription || !resumeData || !companyName) {
      return res.status(400).json({
        success: false,
        error: 'jobDescription, resumeData, and companyName are required',
      });
    }

    const result = await generateCoverLetterService(jobDescription, resumeData, companyName);

    res.json(result);
  } catch (error) {
    console.error('Generate Cover Letter Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate cover letter',
      details: error.message,
    });
  }
}

/**
 * Save a cover letter to the database
 */
export async function saveCoverLetter(req, res) {
  try {
    const { userId, companyName, jobDescription, content } = req.body;

    if (!userId || !companyName || !content) {
      return res.status(400).json({
        success: false,
        error: 'userId, companyName, and content are required',
      });
    }

    const newCoverLetter = new CoverLetter({
      userId,
      companyName,
      jobDescription,
      content,
    });

    await newCoverLetter.save();

    res.json({
      success: true,
      data: newCoverLetter,
    });
  } catch (error) {
    console.error('Save Cover Letter Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save cover letter',
      details: error.message,
    });
  }
}

/**
 * Get a cover letter by ID
 */
export async function getCoverLetter(req, res) {
  try {
    const { id } = req.params;
    const coverLetter = await CoverLetter.findById(id);

    if (!coverLetter) {
      return res.status(404).json({
        success: false,
        error: 'Cover letter not found',
      });
    }

    res.json({
      success: true,
      data: coverLetter,
    });
  } catch (error) {
    console.error('Get Cover Letter Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cover letter',
      details: error.message,
    });
  }
}

/**
 * Get all cover letters for a specific user
 */
export async function getUserCoverLetters(req, res) {
  try {
    const { userId } = req.params;
    const coverLetters = await CoverLetter.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coverLetters,
    });
  } catch (error) {
    console.error('Get User Cover Letters Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve cover letters',
      details: error.message,
    });
  }
}

/**
 * Delete a cover letter
 */
export async function deleteCoverLetter(req, res) {
  try {
    const { id } = req.params;
    const deletedCoverLetter = await CoverLetter.findByIdAndDelete(id);

    if (!deletedCoverLetter) {
      return res.status(404).json({
        success: false,
        error: 'Cover letter not found',
      });
    }

    res.json({
      success: true,
      message: 'Cover letter deleted successfully',
    });
  } catch (error) {
    console.error('Delete Cover Letter Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete cover letter',
      details: error.message,
    });
  }
}

export default {
  generateCoverLetter,
  saveCoverLetter,
  getCoverLetter,
  getUserCoverLetters,
  deleteCoverLetter,
};
