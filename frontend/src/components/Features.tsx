import { Wand2, Gauge, Search, Mail, FileSearch, LayoutTemplate, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: Wand2, title: "Magic Button rewrites", description: "One click turns weak bullets into achievement-driven, metric-rich impact statements." },
  { icon: Gauge, title: "Live 4-gauge ATS score", description: "Content, format, grammar, and design — scored in real time as you type." },
  { icon: Search, title: "Keyword density analyzer", description: "Match your resume to any job description and surface missing keywords instantly." },
  { icon: FileSearch, title: "Resume parser", description: "Drop a PDF or DOCX and we'll structure it into editable sections in seconds." },
  { icon: Mail, title: "Cover letters & outreach", description: "Three writing styles plus recruiter, follow-up, and referral email templates." },
  { icon: LayoutTemplate, title: "Premium templates", description: "Modern Classic, Corporate Professional, and Tech Minimal — all ATS-safe." },
  { icon: ShieldCheck, title: "Privacy first", description: "Your data is encrypted and yours alone. Export and delete at any time." },
  { icon: Sparkles, title: "Built on top models", description: "Gemini 2.5 Pro and GPT-5 power every suggestion under the hood." },
];

const Features = () => {
  return (
    <section className="relative py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">The toolkit</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Everything a hiring manager wants — <span className="text-gradient-gold">automated</span>.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A studio-grade workspace with the AI horsepower of a senior recruiter on your shoulder.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
