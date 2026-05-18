import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Mail, Briefcase, Code, Palette, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { softwareEngineerTemplate, designerTemplate, businessTemplate } from "@/data/resumeTemplates";
import { softwareEngineerCoverLetter, designerCoverLetter, businessCoverLetter } from "@/data/coverLetterTemplates";
import { softwareEngineerPortfolio, designerPortfolio, businessPortfolio } from "@/data/portfolioTemplates";

const Examples = () => {
  const navigate = useNavigate();

  const resumeTemplates = [
    {
      id: "software-engineer",
      name: "Software Engineer",
      description: "Perfect for developers and tech professionals",
      icon: Code,
      data: softwareEngineerTemplate,
    },
    {
      id: "designer",
      name: "UI/UX Designer",
      description: "Showcase your design portfolio and creative skills",
      icon: Palette,
      data: designerTemplate,
    },
    {
      id: "business",
      name: "Business Professional",
      description: "For managers, analysts, and business roles",
      icon: Building,
      data: businessTemplate,
    },
  ];

  const coverLetterTemplates = [
    {
      id: "software-engineer",
      name: "Software Engineer",
      description: "Technical cover letter for developer roles",
      icon: Code,
      data: softwareEngineerCoverLetter,
    },
    {
      id: "designer",
      name: "UI/UX Designer",
      description: "Creative cover letter for design positions",
      icon: Palette,
      data: designerCoverLetter,
    },
    {
      id: "business",
      name: "Business Professional",
      description: "Professional cover letter for business roles",
      icon: Building,
      data: businessCoverLetter,
    },
  ];

  const portfolioTemplates = [
    {
      id: "software-engineer",
      name: "Software Engineer",
      description: "Developer portfolio with projects and skills",
      icon: Code,
      data: softwareEngineerPortfolio,
    },
    {
      id: "designer",
      name: "UI/UX Designer",
      description: "Design portfolio showcasing creative work",
      icon: Palette,
      data: designerPortfolio,
    },
    {
      id: "business",
      name: "Business Professional",
      description: "Professional portfolio for business roles",
      icon: Building,
      data: businessPortfolio,
    },
  ];

  const useResumeTemplate = (templateData: typeof softwareEngineerTemplate) => {
    localStorage.setItem("resume_data", JSON.stringify(templateData));
    navigate("/builder");
  };

  const useCoverLetterTemplate = (templateData: typeof softwareEngineerCoverLetter) => {
    localStorage.setItem("cover_letter_data", JSON.stringify(templateData));
    navigate("/cover-letter");
  };

  const usePortfolioTemplate = (templateData: typeof softwareEngineerPortfolio) => {
    localStorage.setItem("portfolio_data", JSON.stringify(templateData));
    navigate("/portfolio");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Template{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Examples
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Choose a template to get started quickly
          </p>

          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="resume" className="gap-2">
                <FileText className="w-4 h-4" />
                Resumes
              </TabsTrigger>
              <TabsTrigger value="cover-letter" className="gap-2">
                <Mail className="w-4 h-4" />
                Cover Letters
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Portfolios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resumeTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => useResumeTemplate(template.data)}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {template.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {template.description}
                          </p>
                        </div>
                        <Button className="w-full">Use This Template</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Card className="p-6 bg-gradient-card">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Start From Scratch</h3>
                    <p className="text-muted-foreground mb-4">
                      Prefer to build your resume from the ground up? No problem!
                    </p>
                    <Button variant="outline" onClick={() => navigate("/builder")}>
                      Create Blank Resume
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cover-letter">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {coverLetterTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => useCoverLetterTemplate(template.data)}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {template.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {template.description}
                          </p>
                        </div>
                        <Button className="w-full">Use This Template</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Card className="p-6 bg-gradient-card">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Start From Scratch</h3>
                    <p className="text-muted-foreground mb-4">
                      Prefer to write your cover letter from scratch? No problem!
                    </p>
                    <Button variant="outline" onClick={() => navigate("/cover-letter")}>
                      Create Blank Cover Letter
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {portfolioTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => usePortfolioTemplate(template.data)}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {template.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {template.description}
                          </p>
                        </div>
                        <Button className="w-full">Use This Template</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Card className="p-6 bg-gradient-card">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Start From Scratch</h3>
                    <p className="text-muted-foreground mb-4">
                      Prefer to build your portfolio from the ground up? No problem!
                    </p>
                    <Button variant="outline" onClick={() => navigate("/portfolio")}>
                      Create Blank Portfolio
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Examples;
