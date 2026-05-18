import React, { useState } from 'react';
import axios from 'axios';

/**
 * CoverLetterGenerator Component
 * @param {string} jobDescription - The job description text
 * @param {Object} resumeData - The user's resume data
 * @param {string} userId - Current user ID (needed for saving)
 */
const CoverLetterGenerator = ({ jobDescription, resumeData, userId }) => {
  const [companyName, setCompanyName] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async () => {
    if (!jobDescription || !resumeData || !companyName) {
      setError('Please provide job description, resume data, and company name.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/cover-letter/generate`, {
        jobDescription,
        resumeData,
        companyName
      });

      setGeneratedLetter(response.data.data.coverLetter);
    } catch (err) {
      console.error('Generation Error:', err);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter || !userId) {
      setError('Nothing to save or missing user information.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/cover-letter/save`, {
        userId,
        companyName,
        jobDescription,
        content: generatedLetter
      });

      setSuccessMsg('Cover letter saved successfully!');
    } catch (err) {
      console.error('Save Error:', err);
      setError('Failed to save cover letter.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setSuccessMsg('Copied to clipboard!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="cover-letter-generator">
      <div className="input-group">
        <label htmlFor="companyName">Company Name</label>
        <input 
          type="text" 
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Google, Meta"
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading || !companyName}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {generatedLetter && (
        <div className="result-container">
          <div className="toolbar">
            <h3>Generated Cover Letter</h3>
            <div className="actions">
              <button onClick={handleCopy} className="icon-btn" title="Copy">
                📋 Copy
              </button>
              <button onClick={handleSave} disabled={saving} className="icon-btn save" title="Save">
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          </div>
          <textarea 
            className="letter-display" 
            value={generatedLetter} 
            onChange={(e) => setGeneratedLetter(e.target.value)}
            rows={15}
          />
          {successMsg && <p className="success-message">{successMsg}</p>}
        </div>
      )}

      <style jsx>{`
        .cover-letter-generator {
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .input-group {
          margin-bottom: 15px;
        }

        .input-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .input-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }

        .generate-btn {
          width: 100%;
          padding: 12px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 15px;
        }

        .generate-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .result-container {
          margin-top: 20px;
          border-top: 2px solid #dee2e6;
          padding-top: 20px;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .icon-btn {
          padding: 5px 10px;
          background: white;
          border: 1px solid #ced4da;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .icon-btn:hover {
          background-color: #e9ecef;
        }

        .icon-btn.save {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }

        .letter-display {
          width: 100%;
          padding: 15px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
        }

        .error-message { color: #dc3545; }
        .success-message { color: #28a745; margin-top: 10px; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default CoverLetterGenerator;
