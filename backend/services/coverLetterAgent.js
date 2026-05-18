import { getChatModel } from "../utils/aiModel.js";
import dotenv from "dotenv";

dotenv.config();

export async function generateCoverLetter(jobDescription, resumeData, companyName) {
  if (!jobDescription) throw new Error('Job description is required');
  if (!resumeData) throw new Error('Resume data is required');

  const model = await getChatModel({
    temperature: 0.7,
  });

  const startTime = Date.now();

  const prompt = `You are an expert resume writer and career coach. 
Write a professional, 3-4 paragraph cover letter for a candidate applying to ${companyName || 'the company'}.

Job Description:
${jobDescription}

Candidate Resume Data:
${JSON.stringify(resumeData, null, 2)}

The cover letter should:
1. Have a professional greeting.
2. An introductory paragraph mentioning the role and company.
3. 1-2 body paragraphs highlighting matching skills and achievements from the resume.
4. A concluding paragraph with a call to action and professional sign-off.

Return ONLY the text of the cover letter:`;

  try {
    const response = await model.invoke(prompt);
    const latency = Date.now() - startTime;
    
    return {
      success: true,
      data: {
        content: response.content.trim(),
        latency,
      }
    };
  } catch (error) {
    console.error("[Cover Letter Agent] Gemini Error:", error);
    throw new Error('Failed to generate cover letter with Gemini');
  }
}
