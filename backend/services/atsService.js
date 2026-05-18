export function calculateATSScore(resumeText, keywords) {
  const normalizedResume = resumeText.toLowerCase();
  const matchedKeywords = [];
  
  for (const keyword of keywords) {
    if (normalizedResume.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  }
  
  const score = keywords.length > 0 ? (matchedKeywords.length / keywords.length) * 100 : 0;
  
  return {
    score: Math.round(score),
    matchedKeywords,
    totalKeywords: keywords.length,
    missingKeywords: keywords.filter(k => !matchedKeywords.includes(k)),
    matchPercentage: `${Math.round(score)}%`,
  };
}

export function calculateBulkScore(resumeBullets, keywords) {
  const allText = resumeBullets.join(" ");
  return calculateATSScore(allText, keywords);
}
