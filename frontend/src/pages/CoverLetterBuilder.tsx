import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CoverLetterForm } from "@/components/coverLetter/CoverLetterForm";
import { CoverLetterPreview } from "@/components/coverLetter/CoverLetterPreview";
import { useCoverLetterStorage } from "@/hooks/useCoverLetterStorage";
import { exportToPDF } from "@/utils/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { PremiumLockScreen } from "@/components/PremiumLockScreen";

const CoverLetterBuilder = () => {
  const navigate = useNavigate();
  const { isPro, loading } = useAuth();
  const { coverLetterData, updateCoverLetter, clearCoverLetter } = useCoverLetterStorage();
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      await exportToPDF('cover-letter-preview', 'cover-letter');
      toast({
        title: "Success!",
        description: "Your cover letter has been downloaded as PDF.",
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
      clearCoverLetter();
      toast({
        title: "Cleared",
        description: "Cover letter data has been cleared.",
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
        title="AI Cover Letter Builder"
        description="Instantly write highly tailored, job-specific cover letters that get you noticed by hiring managers and beat automated screening systems."
        features={[
          "🤖 Fully automated job-specific AI drafting",
          "📈 Professional keywords match formatting",
          "⚡ Instant customized PDF download option",
          "🎨 Matches the theme structure of your resume"
        ]}
        reason="To unlock the automated AI Cover Letter Generator"
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
            Cover Letter{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Create a professional cover letter in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Details</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
              <CoverLetterForm
                data={coverLetterData}
                onChange={updateCoverLetter}
              />
            </Card>
          </div>

          <div className="lg:sticky lg:top-8 lg:h-fit">
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <div className="overflow-auto max-h-[calc(100vh-200px)]">
              <CoverLetterPreview data={coverLetterData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
