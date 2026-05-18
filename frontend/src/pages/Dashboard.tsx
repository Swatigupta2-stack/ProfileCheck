import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Mail, Upload, Sparkles, Plus, 
  ArrowRight, Clock, ChevronRight, TrendingUp, 
  AlertCircle, Search, Download, Trash2, Edit3, 
  CheckCircle2, Star, Zap, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreGauge } from "@/components/ats/ScoreGauge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProUpgradeDialog } from "@/components/ProUpgradeDialog";

const quickActions = [
  { to: "/builder", title: "New Resume", desc: "AI-Powered Builder", icon: Plus, color: "bg-primary" },
  { to: "/upload", title: "Analyze", desc: "ATS Compatibility", icon: Zap, color: "bg-blue-600" },
  { to: "/cover-letter", title: "Cover Letter", desc: "Job-Specific AI", icon: Mail, color: "bg-amber-600" },
];

const recentResumes = [
  { id: 1, name: "Senior Software Engineer", company: "Google", date: "2h ago", score: 85, status: "Optimized" },
  { id: 2, name: "Product Manager", company: "Meta", date: "1d ago", score: 72, status: "Draft" },
  { id: 3, name: "Full Stack Dev", company: "Amazon", date: "3d ago", score: 64, status: "Review" },
];

const Dashboard = () => {
  const { user, isPro, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const handleNewResumeClick = () => {
    const savedResume = localStorage.getItem("resume_data");
    let hasExisting = false;
    if (savedResume) {
      try {
        const parsed = JSON.parse(savedResume);
        hasExisting = !!(parsed.personalInfo?.fullName || parsed.experience?.length > 0 || parsed.education?.length > 0);
      } catch (e) {}
    }

    if (hasExisting && !isPro) {
      setUpgradeReason("Free tier users are limited to 1 active resume. Upgrade to Zaalima Pro to create unlimited resumes and unlock premium templates!");
      setUpgradeOpen(true);
    } else {
      navigate("/builder");
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/auth");
      else setIsLoaded(true);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoaded && user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-foreground overflow-x-hidden relative">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12 lg:py-20 max-w-7xl relative z-10">
        <div className="space-y-16">
          {/* Professional Hero Section */}
          <section className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Career Studio Professional
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                Your Career <br />
                <span className="text-gradient-gold">Reimagined.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
                Welcome, <span className="text-foreground font-bold">{user?.email?.split("@")[0]}</span>. Your documents are optimized and ready for your next big move.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Button 
                  size="lg" 
                  onClick={handleNewResumeClick}
                  className="bg-primary text-primary-foreground font-black h-14 px-8 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-base"
                >
                  <Plus className="w-5 h-5 mr-2" /> New Resume
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/ats")}
                  className="h-14 px-8 rounded-xl border-border font-bold text-base hover:bg-muted"
                >
                  Analyze Existing
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-[400px]"
            >
              <Card className="p-10 glass border-border/50 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -inset-1 bg-gradient-gold opacity-5 blur-2xl group-hover:opacity-10 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="w-48 h-48">
                    <ScoreGauge label="Career Score" score={88} recommendation="Your career score is looking excellent!" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-success font-black text-xs flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4" /> PERFORMANCE STABLE
                    </div>
                    <p className="text-muted-foreground text-xs font-medium">Your profile is in the top 10% for tech roles.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </section>

          {/* Clean Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
              >
                {action.to === "/builder" ? (
                  <div onClick={handleNewResumeClick} className="cursor-pointer h-full">
                    <Card className="p-6 bg-card border border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl group h-full rounded-2xl">
                      <div className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{action.desc}</p>
                    </Card>
                  </div>
                ) : (
                  <Link to={action.to}>
                    <Card className="p-6 bg-card border border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl group cursor-pointer h-full rounded-2xl">
                      <div className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-black mb-1 group-hover:text-primary transition-colors">{action.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{action.desc}</p>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}
          </section>

          {/* Documents Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" /> Recent Documents
                </h2>
                <Button variant="ghost" className="font-black text-primary hover:text-primary/80 uppercase tracking-widest text-[10px]">
                  All Files <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentResumes.map((doc, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.05) }}
                  >
                    <Card className="p-5 bg-card border border-border/50 hover:border-primary/30 transition-all group rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">{doc.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>{doc.company}</span>
                            <span className="w-1 h-1 rounded-full bg-muted"></span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">ATS Match</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-primary">{doc.score}%</span>
                            <Progress value={doc.score} className="w-16 h-1.5" />
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9"><Edit3 className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9"><Download className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="rounded-lg h-9 w-9 text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight">Intelligence</h2>
                <Card className="p-8 bg-gradient-gold text-white border-none rounded-[2rem] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 font-black text-sm uppercase tracking-widest">
                      <Star className="w-5 h-5" /> Pro Insight
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                      Using quantifiable metrics like <span className="font-bold underline">"Improved efficiency by 20%"</span> increases your callback rate by 3x.
                    </p>
                    <Button className="w-full bg-white text-primary font-black h-11 rounded-xl shadow-lg hover:bg-white/90">
                      Learn More
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Recent Events</h3>
                <div className="space-y-5">
                  {[
                    { icon: CheckCircle2, title: "ATS Optimization", sub: "Score 85%", color: "text-success" },
                    { icon: Sparkles, title: "AI Rewrite Applied", sub: "Google Resume", color: "text-primary" },
                    { icon: Download, title: "Export Successful", sub: "Lead Designer", color: "text-blue-500" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center ${item.color} border border-border/50`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{item.title}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
      
      <ProUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={upgradeReason} />
    </div>
  );
};

export default Dashboard;
