import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';
import { getChatModel } from "../utils/aiModel.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('[Parse Service] PDF Extraction Error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from DOCX buffer
 */
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('[Parse Service] DOCX Extraction Error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Use AI to parse raw text into structured JSON
 */
async function parseResumeWithAI(text) {
  const model = await getChatModel({
    temperature: 0.1, // Low temperature for precise extraction
  });
  
  const prompt = `You are a professional resume parser. 
Extract the information from the following resume text and format it into a valid JSON object.

RESUME TEXT:
"""
${text}
"""

REQUIRED JSON STRUCTURE:
{
  "personal": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "location": "City, State/Country"
  },
  "summary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "startDate": "string",
      "endDate": "string (or 'Present')",
      "current": boolean,
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "field": "string",
      "startYear": "string",
      "endYear": "string"
    }
  ],
  "skills": ["string"]
}

Guidelines:
1. If a field is missing, use an empty string or empty array.
2. Return ONLY the JSON object.
3. Be as accurate as possible.`;

  try {
    const response = await model.invoke(prompt);
    let content = response.content.replace(/```json|```/g, '').trim();
    
    // Isolation logic for JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('[Parse Service] AI Parsing Error:', error);
    throw new Error('Failed to parse resume with AI');
  }
}

/**
 * Main service function to parse a file
 */
export async function parseResumeFile(file) {
  let text = '';
  
  if (file.mimetype === 'application/pdf') {
    text = await extractTextFromPDF(file.buffer);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
    text = await extractTextFromDOCX(file.buffer);
  } else if (file.mimetype === 'text/plain') {
    text = file.buffer.toString('utf8');
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
  }

  if (!text.trim()) {
    throw new Error('Could not extract any text from the file.');
  }

  return await parseResumeWithAI(text);
}
