import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerForge Pro · Forged with AI
      </footer>
    </div>
  );
};

export default Index;
