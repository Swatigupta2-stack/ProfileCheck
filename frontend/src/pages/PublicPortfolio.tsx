import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioPreview } from "@/components/portfolio/PortfolioPreview";
import { PortfolioData } from "@/types/portfolio";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PublicPortfolio = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound">("loading");

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data, error } = await supabase
        .from("published_portfolios")
        .select("data, is_public")
        .eq("slug", slug)
        .eq("is_public", true)
        .maybeSingle();
      if (error || !data) {
        setStatus("notfound");
      } else {
        setData(data.data as unknown as PortfolioData);
        setStatus("ok");
        // Update document title for SEO/sharing
        const name = (data.data as any)?.personalInfo?.fullName || "Portfolio";
        document.title = `${name} — Portfolio | CareerForge Pro`;
      }
    })();
  }, [slug]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "notfound" || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-3xl font-bold mb-2">Portfolio not found</h1>
        <p className="text-muted-foreground mb-6">This portfolio is private or the link is invalid.</p>
        <Button asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Go home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <PortfolioPreview data={data} />
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Built with CareerForge Pro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicPortfolio;
