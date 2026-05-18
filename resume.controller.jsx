// backend/controllers/resume.controller.js
const Resume = require('../models/Resume.model');
const User = require('../models/User.model');
const AIService = require('../services/ai.service');
const PDFService = require('../services/pdf.service');

class ResumeController {
  async createResume(req, res) {
    try {
      const resumeData = {
        ...req.body,
        userId: req.user.id
      };
      
      const resume = new Resume(resumeData);
      await resume.save();
      
      // Update user's resume count
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { resumeCount: 1 }
      });
      
      res.status(201).json({
        success: true,
        data: resume
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getResumes(req, res) {
    try {
      const resumes = await Resume.find({ userId: req.user.id })
        .sort({ updatedAt: -1 });
      
      res.json({
        success: true,
        data: resumes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getResumeById(req, res) {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      res.json({
        success: true,
        data: resume
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateResume(req, res) {
    try {
      const resume = await Resume.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      res.json({
        success: true,
        data: resume
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteResume(req, res) {
    try {
      const resume = await Resume.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Resume deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async analyzeJobDescription(req, res) {
    try {
      const { jobDescription } = req.body;
      
      const analysis = await AIService.analyzeJobDescription(jobDescription);
      
      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async rewriteBulletPoint(req, res) {
    try {
      const { bulletPoint, keywords, jobTitle } = req.body;
      
      const rewritten = await AIService.rewriteBulletPoint(bulletPoint, keywords, jobTitle);
      
      res.json({
        success: true,
        data: rewritten
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async calculateATSScore(req, res) {
    try {
      const { resumeId, jobDescription } = req.body;
      
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      const scoreData = await AIService.calculateATSScore(resume, jobDescription);
      
      // Update resume with ATS score
      resume.atsScore = scoreData.score;
      resume.targetJobDescription = jobDescription;
      resume.extractedKeywords = scoreData.matchedKeywords;
      await resume.save();
      
      res.json({
        success: true,
        data: scoreData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generatePDF(req, res) {
    try {
      const resume = await Resume.findById(req.params.id);
      
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      const html = await PDFService.generateResumeHTML(resume);
      const pdfPath = await PDFService.generatePDF(html, resume._id);
      
      res.download(pdfPath, `${resume.personalInfo.fullName}_Resume.pdf`);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generateCoverLetter(req, res) {
    try {
      const { resumeId, jobDescription } = req.body;
      
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      
      const coverLetter = await AIService.generateCoverLetter(resume, jobDescription);
      
      res.json({
        success: true,
        data: coverLetter
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ResumeController();