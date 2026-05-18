import { getChatModel } from "../utils/aiModel.js";
import dotenv from "dotenv";

dotenv.config();

export async function analyzeResumeDeepAI(resumeText, jobDescription) {
  const model = await getChatModel({
    temperature: 0.1,
  });
  
  const prompt = `You are a professional Applicant Tracking System (ATS) expert. 
Analyze the following resume text against the provided job description (JD).
If no JD is provided, perform a general professional resume audit.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription || "Not provided. General audit requested."}
"""

Provide a highly detailed analysis in ONLY JSON format with this structure:
{
  "scores": {
    "content": { "score": number, "recommendation": "string" },
    "format": { "score": number, "recommendation": "string" },
    "grammar": { "score": number, "recommendation": "string" },
    "design": { "score": number, "recommendation": "string" },
    "overall": number
  },
  "detailed_breakdown": {
    "hard_skills_matched": ["string"],
    "hard_skills_missing": ["string"],
    "soft_skills_found": ["string"],
    "action_verbs_analysis": "string",
    "formatting_issues": ["string"],
    "contact_info_check": "string"
  },
  "suggestions": ["string"]
}

Rules for scoring:
- Content: Match of skills and experience to JD.
- Format: Detection of tables, columns, non-standard fonts, or messy layouts in text.
- Grammar: Typos, passive voice, or inconsistent tense.
- Design: Word count, bullet point quality, and section balance.

Be critical and professional.`;

  try {
    const response = await model.invoke(prompt);
    console.log("[ATS Deep AI] Raw response:", response.content);
    let content = response.content.replace(/```json|```/g, '').trim();
    
    // Attempt to extract JSON if there's surrounding text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("[ATS AI Service] Gemini Error:", error);
    throw new Error("Deep AI analysis failed");
  }
}
