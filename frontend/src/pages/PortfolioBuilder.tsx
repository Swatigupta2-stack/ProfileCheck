import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2, Github, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PortfolioForm } from "@/components/portfolio/PortfolioForm";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { PublishPortfolioDialog } from "@/components/portfolio/PublishPortfolioDialog";
import { GithubImportDialog } from "@/components/GithubImportDialog";
import { usePortfolioStorage } from "@/hooks/usePortfolioStorage";
import { exportToPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { PremiumLockScreen } from "@/components/PremiumLockScreen";

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const { isPro, loading } = useAuth();
  const { portfolioData, updatePortfolio, clearPortfolio } = usePortfolioStorage();
  const { toast } = useToast();
  const [publishOpen, setPublishOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      await exportToPDF('portfolio-preview', 'portfolio');
      toast({
        title: "Success!",
        description: "Your portfolio has been downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      clearPortfolio();
      toast({
        title: "Cleared",
        description: "Portfolio data has been cleared.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isPro) {
    return (
      <PremiumLockScreen
        title="Interactive Portfolio Builder"
        description="Launch a stunning, personalized professional website featuring your projects, GitHub repositories, educational highlights, and experience."
        features={[
          "🌐 Instant professional hosting on cloud servers",
          "🐙 Automated one-click GitHub profile imports",
          "📱 100% responsive desktop & mobile presentation",
          "✨ Customizable design settings and themes"
        ]}
        reason="To unlock the interactive Portfolio Builder website creator"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Portfolio{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Build your stunning digital portfolio
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                <h2 className="text-2xl font-bold">Edit Details</h2>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => setGithubOpen(true)}>
                    <Github className="w-4 h-4 mr-2" />
                    Import GitHub
                  </Button>
                  <Button variant="outline" onClick={() => setPublishOpen(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" onClick={handleClear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
              <PortfolioForm
                data={portfolioData}
                onChange={updatePortfolio}
              />
            </Card>
          </div>

          <div className="lg:sticky lg:top-8 lg:h-fit">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div className="overflow-auto max-h-[calc(100vh-200px)]">
              <PortfolioPreview data={portfolioData} />
            </div>
          </div>
        </div>

        <PublishPortfolioDialog open={publishOpen} onOpenChange={setPublishOpen} data={portfolioData} />
        <GithubImportDialog
          open={githubOpen}
          onOpenChange={setGithubOpen}
          onImport={(r) => {
            updatePortfolio({
              ...portfolioData,
              personalInfo: {
                ...portfolioData.personalInfo,
                fullName: portfolioData.personalInfo.fullName || r.profile.name,
                tagline: portfolioData.personalInfo.tagline || r.profile.bio,
                email: portfolioData.personalInfo.email || r.profile.email,
                github: portfolioData.personalInfo.github || r.profile.html_url,
                portfolio: portfolioData.personalInfo.portfolio || r.profile.blog,
              },
              about: portfolioData.about || r.profile.bio,
              skills: Array.from(new Set([...portfolioData.skills, ...r.skills])),
              projects: [
                ...portfolioData.projects,
                ...r.projects.map((p) => ({
                  id: p.id,
                  title: p.name,
                  description: p.description,
                  technologies: p.technologies,
                  link: p.link,
                })),
              ],
            });
          }}
        />
      </div>
    </div>
  );
};

export default PortfolioBuilder;
