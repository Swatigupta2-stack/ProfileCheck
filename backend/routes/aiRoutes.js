import express from "express";
import { analyzeJD, rewriteResumeBullet, getATSScore, generateCoverLetterHandler, proxyUniversitySearch, proxyCompanySearch, proxyImage } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze-jd", analyzeJD);
router.post("/rewrite", rewriteResumeBullet);
router.post("/ats-score", getATSScore);
router.post("/generate-cover-letter", generateCoverLetterHandler);
router.get("/universities", proxyUniversitySearch);
router.get("/companies", proxyCompanySearch);
router.get("/proxy-image", proxyImage);

router.get("/health", (req, res) => {
  res.json({ status: "AI routes are working", timestamp: new Date() });
});

export default router;
