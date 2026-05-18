import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function extractKeywordsWithOllama(jdText) {
  const startTime = Date.now();
  
  const prompt = `Extract the most important ATS keywords from this job description.
Return ONLY a comma-separated list of keywords. No explanations, no numbering.

Job Description:
${jdText}`;

  const response = await ollama.generate({
    model: 'llama3.2',
    prompt: prompt,
  });
  
  const keywords = response.response.split(',').map(k => k.trim().toLowerCase());
  const latency = Date.now() - startTime;
  
  console.log(`[Ollama JD Analysis] Extracted ${keywords.length} keywords in ${latency}ms`);
  
  return { keywords, latency };
}

export async function rewriteBulletWithOllama(bulletText, keywords) {
  const startTime = Date.now();
  
  const prompt = `Rewrite the following resume bullet point to be professional and ATS-optimized.
Include these keywords naturally: ${keywords.join(", ")}

Bullet point: "${bulletText}"

Return ONLY the rewritten bullet point (one sentence, no explanations):`;

  const response = await ollama.generate({
    model: 'llama3.2',
    prompt: prompt,
  });
  
  const latency = Date.now() - startTime;
  
  console.log(`[Ollama Rewrite] Rewrote bullet in ${latency}ms`);
  
  return {
    original: bulletText,
    rewritten: response.response.trim(),
    latency
  };
}