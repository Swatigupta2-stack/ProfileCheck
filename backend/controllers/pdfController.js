import { generateResumePDF } from '../services/pdfService.js';

/**
 * Controller to handle resume PDF generation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function generatePDF(req, res) {
  try {
    const resumeData = req.body;

    if (!resumeData || Object.keys(resumeData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Resume data is required',
      });
    }

    const pdfBuffer = await generateResumePDF(resumeData);

    // Set headers for PDF download/viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the buffer
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      details: error.message,
    });
  }
}

export default {
  generatePDF,
};
