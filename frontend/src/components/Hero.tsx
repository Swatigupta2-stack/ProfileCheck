import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Zap, FileCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary-glow/15 blur-[120px]" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium tracking-wide uppercase text-foreground/80">
              Powered by Gemini & GPT-5
            </span>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Forge a resume that{" "}
            <span className="text-gradient-gold">lands interviews</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            CareerForge Pro pairs a stunning split-screen builder with real-time ATS scoring,
            keyword analysis, and AI-rewritten bullet points — built for the next role you actually want.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 bg-gradient-primary px-7 text-primary-foreground shadow-glow hover:opacity-95"
              onClick={() => navigate("/builder")}
            >
              Build my resume
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-7 border-border/70 bg-card/40 backdrop-blur"
              onClick={() => navigate("/examples")}
            >
              See live examples
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> ATS-optimized templates</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Magic Button rewrites</div>
            <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-primary" /> Free PDF export</div>
          </div>
        </div>

        {/* Mock preview card */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-primary opacity-30 blur-2xl" />
          <div className="relative grid grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-border/60 glass-strong shadow-lg md:grid-cols-5">
            <div className="border-b border-border/60 p-6 md:col-span-2 md:border-b-0 md:border-r">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Editor</div>
              <div className="mt-3 space-y-3">
                {["Personal Info", "Experience", "Skills", "Projects"].map((s, i) => (
                  <div key={s} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2.5">
                    <span className="text-sm font-medium">{s}</span>
                    <span className={`text-[10px] uppercase tracking-wider ${i < 2 ? "text-primary" : "text-muted-foreground"}`}>
                      {i < 2 ? "Complete" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span>ATS Score</span><span className="text-primary">92%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[92%] rounded-full bg-gradient-primary" />
                </div>
              </div>
            </div>
            <div className="bg-background/60 p-8 md:col-span-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Live Preview</div>
              <div className="mt-3 border-b border-border pb-3">
                <div className="text-xl font-bold">Alex Morgan</div>
                <div className="text-xs text-muted-foreground">Senior Product Engineer · San Francisco, CA</div>
              </div>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">Experience</div>
                  <div className="mt-1.5 text-foreground/90">Staff Engineer · Linear</div>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    <li>Led migration to RSC, cutting TTFB by 41% across 3M sessions.</li>
                    <li>Shipped AI-assisted issue triage adopted by 8 of 10 enterprise teams.</li>
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-foreground">Skills</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {["TypeScript", "React", "Node", "Postgres", "LLMs"].map((s) => (
                      <span key={s} className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[10px] text-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
