import { extractKeywordsWithOllama } from './ollamaService.js';

export async function extractKeywords(jdText) {
  if (!jdText) {
    throw new Error('Job description is required');
  }
  return await extractKeywordsWithOllama(jdText);
}