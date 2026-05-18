import { Button } from "@/components/ui/button";
import { ArrowRight, Hammer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-card p-12 text-center shadow-lg md:p-16">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[120%] -translate-x-1/2 bg-gradient-primary opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Hammer className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Your next role is <span className="text-gradient-gold">one resume away</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join 40,000+ candidates who use CareerForge Pro to land interviews at top companies.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 gap-2 bg-gradient-primary px-7 text-primary-foreground shadow-glow hover:opacity-95"
                onClick={() => navigate("/builder")}
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-7" onClick={() => navigate("/pricing")}>
                Compare plans
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No credit card · 3 free downloads · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
