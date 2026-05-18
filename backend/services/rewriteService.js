import { getChatModel } from "../utils/aiModel.js";
import dotenv from "dotenv";

dotenv.config();

export async function rewriteBullet(bulletText, keywords) {
  if (!bulletText) throw new Error('Bullet point is required');

  const model = await getChatModel({
    temperature: 0.7,
  });

  const startTime = Date.now();

  const prompt = `You are an expert resume writer. 
Rewrite the following resume bullet point to be more impactful and professional. ${keywords && keywords.length > 0 ? `Naturally include these keywords: ${keywords.join(', ')}.` : ''}

Original Bullet Point:
${bulletText}

Guidelines:
1. Use strong action verbs.
2. Quantify achievements if possible.
3. Keep the tone professional.
4. Ensure keywords are integrated seamlessly if provided.

Return the result in JSON format:
{
  "original": "original text",
  "rewritten": "new optimized text",
  "changes": "brief explanation of changes"
}`;

  try {
    const response = await model.invoke(prompt);
    const latency = Date.now() - startTime;
    
    const result = JSON.parse(response.content.replace(/```json|```/g, '').trim());
    
    return {
      ...result,
      latency
    };
  } catch (error) {
    console.error('[Rewrite Service] Gemini Error:', error);
    throw new Error('Failed to rewrite bullet point with Gemini');
  }
}

export async function generateSummary(text, context) {
  if (!text && !context) throw new Error('Text or context is required to generate summary');

  const model = await getChatModel({
    temperature: 0.8,
  });

  const startTime = Date.now();

  const prompt = `You are an expert resume writer. 
Generate a compelling professional summary for a resume. ${context ? `Context: ${context}` : ''} ${text ? `Existing text to improve: ${text}` : ''}

Guidelines:
1. Keep it concise (3-4 sentences)
2. Highlight key skills and achievements
3. Use professional, impactful language
4. Tailor it to the context provided

Return the result in JSON format:
{
  "summary": "the generated professional summary text"
}`;

  try {
    const response = await model.invoke(prompt);
    const latency = Date.now() - startTime;
    
    const result = JSON.parse(response.content.replace(/```json|```/g, '').trim());
    
    return {
      ...result,
      latency
    };
  } catch (error) {
    console.error('[Summary Service] Gemini Error:', error);
    throw new Error('Failed to generate summary with Gemini');
  }
}