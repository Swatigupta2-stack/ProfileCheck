import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { extractResumeText } from "@/utils/resumeParser";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Sparkles, Loader2, CheckCircle2, AlertCircle, ListChecks, Lock } from "lucide-react";
import { analyzeResumeDeep, type AtsAnalysis } from "@/utils/atsAnalyzer";
import { ScoreGauge } from "@/components/ats/ScoreGauge";
import { KeywordDensity } from "@/components/ats/KeywordDensity";
import { useAuth } from "@/hooks/useAuth";
import { ProUpgradeDialog } from "@/components/ProUpgradeDialog";

const ATS = () => {
  const { isPro } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [report, setReport] = useState<AtsAnalysis | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      const text = await extractResumeText(file);
      setResumeText(text);
      setFileName(file.name);
      toast.success(`Parsed ${file.name}`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const score = async () => {
    if (!resumeText.trim()) return toast.error("Add or upload a resume first.");
    setScoring(true);
    try {
      const result = await analyzeResumeDeep(resumeText, jobDescription);
      setReport(result);

      const { data: u } = await supabase.auth.getUser();
      if (u?.user) {
        await supabase.from("uploaded_resumes").insert({
          user_id: u.user.id,
          file_name: fileName || "Pasted resume",
          extracted_text: resumeText,
          ats_score: result.overall,
          feedback: result as any,
          job_description: jobDescription || null,
        });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Scoring failed");
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      {/* Premium Background Graphics - Resume Themed Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] dark:opacity-[0.1] scale-105"
          style={{ 
            backgroundImage: "url('https://i.pinimg.com/736x/0b/42/d0/0b42d0a9bf421c177334df5acd3f876e.jpg')",
            filter: "blur(8px)"
          }} 
        />
        <div className="absolute inset-0 bg-grid-premium opacity-[0.03]" />
      </div>
      <Navbar />
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-6">
        <Card className="p-6 glass space-y-4">
          <div>
            <h1 className="text-3xl font-bold">
              ATS Score <span className="text-gradient-gold">Analyzer</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Upload a resume or paste text. Add a job description for tailored scoring.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Upload resume (PDF, DOCX, TXT)</Label>
            <div className="flex items-center gap-3">
              <Input type="file" accept=".pdf,.docx,.txt" onChange={handleFile} disabled={parsing} />
              {parsing && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          <div>
            <Label>Resume text</Label>
            <Textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste resume text or upload a file…" />
          </div>

          <div>
            <Label>Job description (optional)</Label>
            <Textarea rows={6} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the JD for tailored scoring." />
          </div>

          <Button onClick={score} disabled={scoring} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
            {scoring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {scoring ? "Analyzing…" : "Score my resume"}
          </Button>
        </Card>

        <Card className="p-6 glass overflow-y-auto max-h-[85vh]">
          {!report && (
            <div className="h-full grid place-items-center text-center text-muted-foreground py-20">
              <div>
                <Upload className="h-10 w-10 mx-auto mb-3 opacity-60" />
                <p>Your detailed ATS report will appear here.</p>
              </div>
            </div>
          )}

          {report && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <ScoreGauge label="Content" {...report.content} />
                <ScoreGauge label="Format" {...report.format} />
                <ScoreGauge label="Grammar" {...report.grammar} />
                <ScoreGauge label="Design" {...report.design} />
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 shadow-inner">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Overall ATS Score</div>
                <div className="text-6xl font-black text-primary drop-shadow-sm">
                  {report.overall}%
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <div className={`h-2 w-12 rounded-full ${report.overall >= 75 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-2 w-12 rounded-full ${report.overall >= 50 ? 'bg-yellow-500' : 'bg-gray-200'}`} />
                  <div className={`h-2 w-12 rounded-full ${report.overall < 50 ? 'bg-red-500' : 'bg-gray-200'}`} />
                </div>
              </div>

              {!isPro ? (
                <div className="relative p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl text-center space-y-4 overflow-hidden mt-6">
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-md z-0" />
                  <div className="relative z-10 py-6 flex flex-col items-center">
                    <Lock className="h-10 w-10 text-amber-500 mb-3 animate-bounce" />
                    <h3 className="text-xl font-bold text-foreground">Detailed Feedback is Locked</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2 leading-relaxed font-medium">
                      Upgrade to Zaalima Pro for ₹100/month to unlock detailed keyword mapping, missing critical skills analysis, action verb reports, and personalized optimization suggestions!
                    </p>
                    <Button 
                      onClick={() => setUpgradeOpen(true)}
                      className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-5 rounded-xl shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2 text-amber-300 animate-pulse" /> Unlock ATS Recommendations
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {report.detailed_breakdown && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-bold flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Hard Skills Matched
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {report.detailed_breakdown.hard_skills_matched.map((s, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-green-500/10 text-green-600 text-xs font-medium border border-green-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold flex items-center gap-2 text-primary">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          Missing Critical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {report.detailed_breakdown.hard_skills_missing.map((s, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-red-500/10 text-red-600 text-xs font-medium border border-red-500/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-muted/30 border space-y-2">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <ListChecks className="h-4 w-4" />
                          Action Verb Analysis
                        </h4>
                        <p className="text-sm leading-relaxed italic text-foreground/80">
                          "{report.detailed_breakdown.action_verbs_analysis}"
                        </p>
                      </div>

                      {report.suggestions && report.suggestions.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-bold text-primary">Key Suggestions</h3>
                          <ul className="space-y-2">
                            {report.suggestions.map((s, i) => (
                              <li key={i} className="text-sm flex gap-2 items-start text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <KeywordDensity 
                    keywords={report.keywords} 
                    missingKeywords={report.missingKeywords} 
                  />
                  
                  <p className="text-xs text-muted-foreground text-center italic">
                    Analysis based on {report.totalWords} content words.
                  </p>
                </>
              )}
            </div>
          )}
        </Card>
      </div>

      <ProUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason="To unlock detailed ATS suggestions and keyword matching analytics" />
    </div>
  );
};

export default ATS;
