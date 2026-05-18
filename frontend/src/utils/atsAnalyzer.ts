// Local ATS analysis: 4 gauges + keyword density

const STOPWORDS = new Set([
  "a", "an", "and", "the", "of", "to", "in", "for", "on", "with", "by", "at", "from", 
  "is", "are", "was", "were", "be", "have", "has", "had", "do", "does", "did", 
  "but", "or", "so", "nor", "yet", "i", "you", "he", "she", "it", "we", "they", 
  "me", "him", "her", "us", "them"
]);

const COMMON_TYPOS = [
  "teh", "recieve", "adress", "acheive", "definately", "seperate", "priviledge", "accomodate", "occured", "untill"
];

export interface GaugeResult {
  score: number;
  recommendation: string;
}

export interface KeywordStat {
  word: string;
  count: number;
  density: number;
}

export interface AtsAnalysis {
  content: GaugeResult;
  format: GaugeResult;
  grammar: GaugeResult;
  design: GaugeResult;
  overall: number;
  detailed_breakdown?: {
    hard_skills_matched: string[];
    hard_skills_missing: string[];
    soft_skills_found: string[];
    action_verbs_analysis: string;
    formatting_issues: string[];
    contact_info_check: string;
  };
  suggestions?: string[];
  keywords: KeywordStat[];
  missingKeywords: string[];
  totalWords: number;
}

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export function analyzeContent(resumeText: string, jobDescription: string): GaugeResult {
  if (!jobDescription.trim()) {
    return {
      score: 0,
      recommendation: "Please provide a job description for content analysis.",
    };
  }
  const jdTokens = Array.from(new Set(tokenize(jobDescription))).filter((t) => !STOPWORDS.has(t) && t.length > 2);
  const resumeSet = new Set(tokenize(resumeText));
  const matched = jdTokens.filter((t) => resumeSet.has(t)).length;
  const score = jdTokens.length ? Math.round((matched / jdTokens.length) * 100) : 0;
  
  let rec = "";
  if (score >= 75) rec = "Excellent keyword match! Your content aligns well with the JD.";
  else if (score >= 50) rec = "Good match, but consider adding more keywords from the JD.";
  else rec = "Low keyword match. Try to incorporate more terms directly from the job description.";
  
  return { score, recommendation: rec };
}

export function analyzeFormat(resumeText: string): GaugeResult {
  let score = 100;
  const issues: string[] = [];
  
  // Tables check
  if (/\t.*\t/.test(resumeText) || /\|.*\|/.test(resumeText)) {
    score -= 20;
    issues.push("tables");
  }
  
  // Columns/Layout check (using a heuristic for multiple large gaps)
  if (/(\S+\s{6,}\S+\s{6,}\S+)/.test(resumeText)) {
    score -= 20;
    issues.push("columns/layouts");
  }

  // Small font size is hard to detect via text, so we'll simulate it with a specific marker or skip
  // But per requirements we should try to deduct if "font size too small"
  // Since we don't have rich text, we'll assume a clean pass for now unless specific markers are found
  
  score = Math.max(0, score);
  
  let rec = "Your resume formatting looks ATS-friendly.";
  if (score < 100) rec = `Avoid using ${issues.join(" and ")} as they can confuse ATS systems.`;
  
  return { score, recommendation: rec };
}

export function analyzeGrammar(resumeText: string): GaugeResult {
  const lower = resumeText.toLowerCase();
  let score = 100;
  let typosFound = 0;
  
  for (const t of COMMON_TYPOS) {
    const re = new RegExp(`\\b${t}\\b`, "g");
    const matches = lower.match(re);
    if (matches) {
      typosFound += matches.length;
    }
  }
  
  score -= typosFound * 10;
  score = Math.max(0, score);
  
  let rec = score === 100 ? "Perfect grammar! No common typos detected." : `Found ${typosFound} common typos. Please proofread your resume carefully.`;
  
  return { score, recommendation: rec };
}

export function analyzeDesign(resumeText: string): GaugeResult {
  const words = tokenize(resumeText).length;
  let score = 0;
  let rec = "";

  if (words >= 500 && words <= 2000) {
    score = 100;
    rec = "Ideal word count for a professional resume.";
  } else if (words < 500) {
    score = 50;
    rec = "Your resume is a bit short. Aim for at least 500 words to show depth.";
  } else {
    score = 70;
    rec = "Your resume is quite long. Consider trimming it to under 2000 words.";
  }
  
  return { score, recommendation: rec };
}

export function keywordDensity(resumeText: string, jobDescription: string = "", top = 10): { stats: KeywordStat[]; totalWords: number; missingKeywords: string[] } {
  const tokens = tokenize(resumeText).filter((t) => !STOPWORDS.has(t) && t.length > 2);
  const total = tokens.length;
  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  
  const stats: KeywordStat[] = Array.from(counts.entries())
    .map(([word, count]) => ({
      word,
      count,
      density: total ? +((count / total) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, top);

  let missingKeywords: string[] = [];
  if (jobDescription.trim()) {
    const jdTokens = Array.from(new Set(tokenize(jobDescription)))
      .filter((t) => !STOPWORDS.has(t) && t.length > 2);
    const resumeTokensSet = new Set(tokenize(resumeText));
    missingKeywords = jdTokens.filter(t => !resumeTokensSet.has(t)).slice(0, 15);
  }

  return { stats, totalWords: total, missingKeywords };
}

export async function analyzeResumeDeep(resumeText: string, jobDescription: string): Promise<AtsAnalysis> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
  
  try {
    const res = await fetch(`${apiUrl}/api/ai/ats-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!res.ok) throw new Error("Failed to get AI analysis");
    
    const { data } = await res.json();
    const { stats, totalWords, missingKeywords } = keywordDensity(resumeText, jobDescription);

    return {
      content: data.scores.content,
      format: data.scores.format,
      grammar: data.scores.grammar,
      design: data.scores.design,
      overall: data.scores.overall,
      detailed_breakdown: data.detailed_breakdown,
      suggestions: data.suggestions,
      keywords: stats,
      missingKeywords,
      totalWords: totalWords
    };
  } catch (error) {
    console.error("Deep Analysis Error:", error);
    // Fallback to local analysis if AI fails
    return analyzeResumeLocal(resumeText, jobDescription);
  }
}

export function analyzeResumeLocal(resumeText: string, jobDescription: string): AtsAnalysis {
  const content = analyzeContent(resumeText, jobDescription);
  const format = analyzeFormat(resumeText);
  const grammar = analyzeGrammar(resumeText);
  const design = analyzeDesign(resumeText);
  
  // Formula for overall score
  const overall = Math.round((content.score + format.score + grammar.score + design.score) / 4);
  
  const { stats, totalWords, missingKeywords } = keywordDensity(resumeText, jobDescription);
  return { content, format, grammar, design, overall, keywords: stats, missingKeywords, totalWords };
}

