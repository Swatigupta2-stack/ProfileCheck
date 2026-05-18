import { extractKeywords } from "../services/jdAgent.js";
import { rewriteBullet, generateSummary } from "../services/rewriteService.js";
import { analyzeResumeDeepAI } from "../services/atsAIService.js";
import { generateCoverLetter } from "../services/coverLetterAgent.js";
import { searchUniversitiesAI } from "../services/universityAIService.js";

export async function analyzeJD(req, res) {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ 
        success: false, 
        error: "Job description is required" 
      });
    }
    
    const result = await extractKeywords(jobDescription);
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error("JD Analysis Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to analyze job description",
      details: error.message 
    });
  }
}

export async function rewriteResumeBullet(req, res) {
  try {
    const { text, mode = 'rewrite', context, bullet, keywords } = req.body;
    
    const inputText = text || bullet;
    
    if (!inputText) {
      return res.status(400).json({ 
        success: false, 
        error: "Text is required" 
      });
    }
    
    let result;
    if (mode === 'summary') {
      result = await generateSummary(inputText, context);
    } else {
      result = await rewriteBullet(inputText, keywords);
    }
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error("Rewrite/Summary Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to process request",
      details: error.message 
    });
  }
}

export async function getATSScore(req, res) {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ 
        success: false, 
        error: "Resume text is required" 
      });
    }
    
    console.log("[ATS Deep AI] Analyzing resume...");
    const result = await analyzeResumeDeepAI(resumeText, jobDescription);
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error("ATS Score Deep Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to perform deep AI ATS analysis",
      details: error.message 
    });
  }
}

export async function proxyUniversitySearch(req, res) {
  try {
    const { q } = req.query;
    console.log(`[AI Search] University search request received for: "${q}"`);
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const data = await searchUniversitiesAI(q);
    console.log(`[AI Search] Found ${data.length} universities for: "${q}"`);
    res.json(data);
  } catch (error) {
    console.error("University AI Search Error:", error);
    res.status(500).json({ error: "Failed to fetch detailed university data", details: error.message });
  }
}

export async function proxyCompanySearch(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(q)}`;
    console.log(`[Proxy] Fetching companies from: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Add full logo URL using clearbit's logo service directly
    const dataWithLogos = data.map(company => ({
      ...company,
      logo: company.domain ? `https://logo.clearbit.com/${company.domain}` : null
    }));

    res.json(dataWithLogos);
  } catch (error) {
    console.error("Company Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch company data from external API" });
  }
}

export async function proxyImage(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required" });

    console.log(`[Image Proxy] Fetching: ${url}`);
    
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000) // 5s timeout
    });

    if (!response.ok) {
      console.error(`[Image Proxy] External API error: ${response.status}`);
      return res.status(404).json({ error: "Image not found" });
    }

    const contentType = response.headers.get("content-type");
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set("Content-Type", contentType || "image/png");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(buffer);
  } catch (error) {
    console.error("Image Proxy Error:", error.message);
    // Return a 404 so the frontend can trigger its fallback logic
    return res.status(404).json({ error: "Failed to proxy image" });
  }
}

export async function generateCoverLetterHandler(req, res) {
  try {
    const { resumeData, jobDescription, companyName } = req.body;
    
    if (!resumeData || !jobDescription || !companyName) {
      return res.status(400).json({ 
        success: false, 
        error: "Resume data, job description, and company name are required" 
      });
    }
    
    const result = await generateCoverLetter(jobDescription, resumeData, companyName);
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error("Cover Letter Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate cover letter",
      details: error.message 
    });
  }
}
