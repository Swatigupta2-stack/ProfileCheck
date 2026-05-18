import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Download, History, Github, User, Briefcase, 
  GraduationCap, Wrench, FolderGit2, Sparkles, Layout, 
  Palette, Type, Save, CheckCircle2, ChevronLeft, ChevronRight,
  Monitor, Smartphone, FileText, Settings, Share2, Eye,
  LayoutGrid, Layers, Undo2, Redo2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useResumeStorage } from "@/hooks/useResumeStorage";
import { PersonalInfoForm } from "@/components/resume/PersonalInfoForm";
import { EducationForm } from "@/components/resume/EducationForm";
import { ExperienceForm } from "@/components/resume/ExperienceForm";
import { SkillsForm } from "@/components/resume/SkillsForm";
import { ProjectsForm } from "@/components/resume/ProjectsForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateGalleryDialog } from "@/components/resume/TemplateGalleryDialog";
import { VersionHistoryDialog } from "@/components/resume/VersionHistoryDialog";
import { GithubImportDialog } from "@/components/GithubImportDialog";
import { MagicButton } from "@/components/MagicButton";
import { exportToPDF, exportToPDFBackend } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { ResumeTemplate } from "@/data/templates";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { ProUpgradeDialog } from "@/components/ProUpgradeDialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User, desc: 'Contact Details' },
  { id: 'summary', label: 'Summary', icon: Sparkles, desc: 'Professional Pitch' },
  { id: 'experience', label: 'Experience', icon: Briefcase, desc: 'Work History' },
  { id: 'education', label: 'Education', icon: GraduationCap, desc: 'Academic Background' },
  { id: 'skills', label: 'Skills', icon: Wrench, desc: 'Expertise & Tools' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, desc: 'Work Highlights' },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { resumeData, updateResume, clearResume, undo, redo, canUndo, canRedo } = useResumeStorage();
  const { toast } = useToast();
  const { isPro } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [activeSection, setActiveSection] = useState('personal');
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [templateToLoad, setTemplateToLoad] = useState<ResumeTemplate | null>(null);
  const [showTemplateAlert, setShowTemplateAlert] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const cycleColor = () => {
    if (!isPro) {
      setUpgradeReason("Custom Theme Colors is a Zaalima Pro feature! Upgrade now to style your resume with gorgeous custom branding!");
      setUpgradeOpen(true);
      return;
    }
    const colors = ['#0f172a', '#1e3a8a', '#4338ca', '#065f46', '#991b1b', '#d97706', '#db2777'];
    const currentColor = resumeData.customPrimaryColor || '';
    const nextIdx = (colors.indexOf(currentColor) + 1) % colors.length;
    updateResume({ ...resumeData, customPrimaryColor: colors[nextIdx] });
    toast({ title: "Theme Color Changed", description: `Applied new primary color: ${colors[nextIdx]}` });
  };

  const cycleFont = () => {
    if (!isPro) {
      setUpgradeReason("Custom Font Typography is a Zaalima Pro feature! Upgrade now to style your resume with premium Google fonts!");
      setUpgradeOpen(true);
      return;
    }
    const fonts = ['Inter, sans-serif', 'Georgia, serif', 'ui-monospace, SFMono-Regular', 'Montserrat, sans-serif', 'Playfair Display, serif'];
    const currentFont = resumeData.customFontFamily || '';
    const nextIdx = (fonts.indexOf(currentFont) + 1) % fonts.length;
    updateResume({ ...resumeData, customFontFamily: fonts[nextIdx] });
    toast({ title: "Font Family Changed", description: `Applied premium font style: ${fonts[nextIdx].split(',')[0]}` });
  };

  const cycleLayout = () => {
    if (!isPro) {
      setUpgradeReason("Dynamic Grid Layout Builder is a Zaalima Pro feature! Upgrade now to instantly cycle between single, dual, and sidebar layouts!");
      setUpgradeOpen(true);
      return;
    }
    const layouts = ['single-column', 'two-column', 'sidebar'];
    const currentLayout = resumeData.customLayoutType || '';
    const nextIdx = (layouts.indexOf(currentLayout as string) + 1) % layouts.length;
    updateResume({ ...resumeData, customLayoutType: layouts[nextIdx] as any });
    toast({ title: "Layout Restructured", description: `Switched template to modern ${layouts[nextIdx]} format!` });
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
          toast({ title: "Redo", description: "Restored changes." });
        } else {
          e.preventDefault();
          undo();
          toast({ title: "Undo", description: "Reverted last change." });
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
        toast({ title: "Redo", description: "Restored changes." });
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toast({ title: "Saved", description: "Your progress has been saved." });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, toast]);

  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000);
    return () => clearTimeout(timer);
  }, [resumeData]);

  const handleExport = async () => {
    try {
      await exportToPDFBackend(resumeData, `${resumeData.personalInfo.fullName || 'Resume'}`);
      toast({ title: "Success!", description: "Your resume has been downloaded." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export resume.", variant: "destructive" });
    }
  };

  const handleSelectTemplate = (template: ResumeTemplate) => {
    // Check if user has any significant data
    const hasData = resumeData.personalInfo.fullName || 
                   resumeData.experience.length > 0 || 
                   resumeData.education.length > 0;

    if (hasData) {
      setTemplateToLoad(template);
      setShowTemplateAlert(true);
    } else {
      updateResume({ ...template.exampleData, templateId: template.id });
      toast({ title: "Template Loaded", description: `Loaded ${template.name} with example data.` });
    }
  };

  const applyTemplateOnly = () => {
    if (templateToLoad) {
      updateResume({ ...resumeData, templateId: templateToLoad.id });
      toast({ title: "Template Changed", description: `Switched to ${templateToLoad.name}.` });
    }
    setShowTemplateAlert(false);
  };

  const applyTemplateWithData = () => {
    if (templateToLoad) {
      updateResume({ ...templateToLoad.exampleData, templateId: templateToLoad.id });
      toast({ title: "Template Loaded", description: `Loaded ${templateToLoad.name} with example data.` });
    }
    setShowTemplateAlert(false);
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) completed++;
    if (resumeData.summary) completed++;
    if (resumeData.education.length > 0) completed++;
    if (resumeData.experience.length > 0) completed++;
    if (Array.isArray(resumeData.skills) ? resumeData.skills.length > 0 : Object.keys(resumeData.skills).length > 0) completed++;
    return Math.round((completed / 5) * 100);
  };

  return (
    <div className="h-screen flex flex-col bg-transparent text-foreground overflow-hidden relative font-sans">
      <Navbar />
      
      <main className="flex-1 flex overflow-hidden z-10 relative">
        {/* Step 1: Sidebar Navigation - Clean & Standard */}
        <aside className={`${sidebarExpanded ? 'w-20 lg:w-72' : 'w-20'} bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col shadow-2xl transition-all duration-300`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className={`${sidebarExpanded ? 'hidden lg:block' : 'hidden'} px-2 flex-1`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Profile Strength</span>
                  <span className="text-xs font-bold text-primary">{calculateCompletion()}%</span>
                </div>
                <Progress value={calculateCompletion()} className="h-1.5 bg-muted" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="rounded-xl hover:bg-muted"
              >
                {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>
            
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <TooltipProvider key={section.id}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 group relative ${
                          activeSection === section.id 
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <section.icon className={`w-5 h-5 shrink-0 transition-transform duration-500 ${activeSection === section.id ? "scale-110" : "group-hover:scale-110"}`} />
                        <div className={`${sidebarExpanded ? 'hidden lg:block' : 'hidden'} text-left overflow-hidden`}>
                          <p className="text-sm font-bold tracking-tight truncate">{section.label}</p>
                          <p className={`text-[10px] truncate font-medium opacity-60 ${activeSection === section.id ? "text-primary-foreground" : ""}`}>
                            {section.desc}
                          </p>
                        </div>
                        {activeSection === section.id && (
                          <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-6 bg-white rounded-full" />
                        )}
                      </button>
                    </TooltipTrigger>
                    {!sidebarExpanded && (
                      <TooltipContent side="right">
                        <p>{section.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">
            <div className="pt-6 border-t border-border/50">
              <div className={`${sidebarExpanded ? 'flex' : 'hidden'} items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-2`}>
                <span>Auto-Save</span>
                {isSaving ? <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> : <CheckCircle2 className="w-3 h-3 text-success" />}
              </div>
              <Button 
                onClick={() => setVersionsOpen(true)} 
                variant="ghost" 
                className={`w-full ${sidebarExpanded ? 'justify-start gap-4' : 'justify-center'} rounded-xl font-bold hover:bg-muted text-muted-foreground hover:text-foreground h-11`}
              >
                <History className="w-5 h-5" />
                <span className={`${sidebarExpanded ? 'hidden lg:block' : 'hidden'}`}>Versions</span>
              </Button>
            </div>
          </div>
        </aside>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Step 2: Form Area - Clean, Light, Professional */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <section className="h-full overflow-y-auto bg-muted/10 backdrop-blur-sm p-6 lg:p-12 scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-2xl mx-auto space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-6">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-black tracking-tight capitalize text-foreground">{activeSection}</h1>
                      <p className="text-sm text-muted-foreground font-medium">Professional resume data entry.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live Edit
                    </div>
                  </div>

                  <Card className="p-8 lg:p-10 rounded-3xl border-border/50 shadow-2xl bg-card relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-gold" />
                    {activeSection === 'personal' && (
                      <PersonalInfoForm
                        data={resumeData.personalInfo}
                        onChange={(data) => updateResume(prev => ({ ...prev, personalInfo: data }))}
                      />
                    )}
                    {activeSection === 'summary' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pitch Yourself</label>
                          <MagicButton
                            text={resumeData.summary || ''}
                            mode="summary"
                            context={`Resume summary for ${resumeData.personalInfo.fullName || 'a professional'}`}
                            onResult={(improved) => updateResume(prev => ({ ...prev, summary: improved }))}
                            label="AI Generate"
                          />
                        </div>
                        <textarea
                          className="w-full min-h-[250px] p-6 rounded-2xl border border-border bg-muted/10 text-foreground focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none leading-relaxed text-base"
                          placeholder="E.g., Results-driven professional with 5+ years of experience..."
                          value={resumeData.summary || ''}
                          onChange={(e) => updateResume(prev => ({ ...prev, summary: e.target.value }))}
                        />
                      </div>
                    )}
                    {activeSection === 'experience' && (
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) => updateResume(prev => ({ ...prev, experience: data }))}
                      />
                    )}
                    {activeSection === 'education' && (
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) => updateResume(prev => ({ ...prev, education: data }))}
                        onUniversitySelect={(country) => {
                          updateResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: country } }));
                        }}
                      />
                    )}
                    {activeSection === 'skills' && (
                      <SkillsForm
                        data={Array.isArray(resumeData.skills) ? resumeData.skills : []}
                        onChange={(data) => updateResume(prev => ({ ...prev, skills: data }))}
                      />
                    )}
                    {activeSection === 'projects' && (
                      <ProjectsForm
                        data={resumeData.projects}
                        onChange={(data) => updateResume(prev => ({ ...prev, projects: data }))}
                      />
                    )}
                  </Card>

                  <div className="flex items-center justify-between pt-4">
                    <Button 
                      variant="ghost" 
                      disabled={activeSection === SECTIONS[0].id}
                      onClick={() => {
                        const idx = SECTIONS.findIndex(s => s.id === activeSection);
                        setActiveSection(SECTIONS[idx-1].id);
                      }}
                      className="font-black gap-2 h-12 px-6 rounded-xl text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <Button 
                      onClick={() => {
                        const idx = SECTIONS.findIndex(s => s.id === activeSection);
                        if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx+1].id);
                        else handleExport();
                      }}
                      className="bg-primary text-primary-foreground font-black px-10 h-12 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
                    >
                      {activeSection === SECTIONS[SECTIONS.length-1].id ? 'Finish & Download' : 'Continue'} 
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden lg:flex" />

          {/* Step 3: Preview Area - Clean & High Fidelity */}
          <ResizablePanel defaultSize={50} minSize={30} className="hidden lg:block">
            <section className="flex h-full flex-col relative bg-muted/30 border-l border-border/50 mesh-bg">
              {/* Studio Toolbar */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2.5 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl">
                <TemplateGalleryDialog onSelectTemplate={handleSelectTemplate} />
                <div className="h-6 w-px bg-border/50 mx-1" />
                
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={undo} 
                          disabled={!canUndo}
                          className="h-10 w-10 rounded-xl hover:bg-muted transition-colors disabled:opacity-30"
                        >
                          <Undo2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={redo} 
                          disabled={!canRedo}
                          className="h-10 w-10 rounded-xl hover:bg-muted transition-colors disabled:opacity-30"
                        >
                          <Redo2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="h-6 w-px bg-border/50 mx-1" />
                  
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={cycleColor}
                            className="h-10 w-10 rounded-xl hover:bg-muted transition-colors relative"
                          >
                            <Palette className="w-4 h-4 text-primary" />
                            {!isPro && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Theme Colors {isPro ? "" : "(Pro Locked)"}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={cycleFont}
                            className="h-10 w-10 rounded-xl hover:bg-muted transition-colors relative"
                          >
                            <Type className="w-4 h-4 text-primary" />
                            {!isPro && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Font Styles {isPro ? "" : "(Pro Locked)"}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={cycleLayout}
                            className="h-10 w-10 rounded-xl hover:bg-muted transition-colors relative"
                          >
                            <LayoutGrid className="w-4 h-4 text-primary" />
                            {!isPro && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Grid Layout {isPro ? "" : "(Pro Locked)"}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="h-6 w-px bg-border/50 mx-1" />
                
                <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
                  <Button 
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setPreviewMode('desktop')}
                    className={`h-8 w-8 rounded-lg shadow-sm ${previewMode === 'desktop' ? 'bg-card' : ''}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setPreviewMode('mobile')}
                    className={`h-8 w-8 rounded-lg shadow-sm ${previewMode === 'mobile' ? 'bg-card' : ''}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="h-6 w-px bg-border/50 mx-1" />
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      toast({ title: "Saved", description: "Your progress has been saved to local storage." });
                    }}
                    className="h-10 w-10 rounded-xl hover:bg-muted transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button onClick={handleExport} className="bg-primary text-primary-foreground font-black rounded-xl h-10 px-6 shadow-lg gap-2 hover:scale-[1.02] transition-transform">
                    <Download className="w-4 h-4" /> Export
                  </Button>
                </div>
              </div>

              {/* Document Stage */}
              <div className="flex-1 overflow-y-auto p-20 pt-32 scrollbar-hide flex justify-center">
                <motion.div
                  layout
                  className={`relative transition-all duration-700 ease-in-out ${
                    previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[850px] w-full'
                  }`}
                >
                  <div className="absolute -inset-10 bg-primary/5 blur-[100px] rounded-full opacity-40"></div>
                  <div className="relative bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden transform transition-all duration-500 hover:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.25)] hover:-translate-y-1">
                    <ResumePreview data={resumeData} />
                  </div>

                  {/* Float Controls */}
                  <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              toast({ title: "Link Copied", description: "Share this link with others!" });
                            }}
                            className="h-11 w-11 rounded-full bg-background border border-border shadow-xl hover:scale-110 transition-transform"
                          >
                            <Share2 className="w-4 h-4 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Share Resume</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            onClick={() => window.open('https://github.com', '_blank')}
                            className="h-11 w-11 rounded-full bg-background border border-border shadow-xl hover:scale-110 transition-transform"
                          >
                            <Github className="w-4 h-4 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Import from GitHub</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              </div>
            </section>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <VersionHistoryDialog open={versionsOpen} onOpenChange={setVersionsOpen} currentData={resumeData} onRestore={updateResume} />
      <GithubImportDialog
        open={githubOpen}
        onOpenChange={setGithubOpen}
        onImport={(r) => {
          updateResume({
            ...resumeData,
            personalInfo: {
              ...resumeData.personalInfo,
              fullName: resumeData.personalInfo.fullName || r.profile.name,
              location: resumeData.personalInfo.location || r.profile.location,
              github: resumeData.personalInfo.github || r.profile.html_url,
              portfolio: resumeData.personalInfo.portfolio || r.profile.blog,
              email: resumeData.personalInfo.email || r.profile.email,
            },
            projects: [...resumeData.projects, ...r.projects],
            skills: Array.from(new Set([...(Array.isArray(resumeData.skills) ? resumeData.skills : []), ...r.skills])),
          });
        }}
      />

      <AlertDialog open={showTemplateAlert} onOpenChange={setShowTemplateAlert}>
        <AlertDialogContent className="glass-strong border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Change Template</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              You already have some data in your resume. How would you like to apply the new template?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="rounded-xl border-border/40">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={applyTemplateOnly}
              className="rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border/40"
            >
              Keep My Data
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={applyTemplateWithData}
              className="rounded-xl bg-primary text-primary-foreground shadow-glow"
            >
              Load Example Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ProUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={upgradeReason} />
    </div>
  );
};

export default ResumeBuilder;
