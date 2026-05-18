import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeButton } from "@/components/UpgradeButton";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Simple,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Choose the plan that works best for you
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-2xl p-8 border border-border/50">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-6">₹0<span className="text-lg text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>1 Resume</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Basic Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>PDF Export</span>
                </li>
              </ul>
              <Button variant="outline" onClick={() => navigate("/builder")} className="w-full">Get Started</Button>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-8 border-2 border-primary/50 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">₹100<span className="text-lg text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Unlimited Resumes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>All Premium Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>AI Cover Letters</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Portfolio Builder</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>ATS Score Feedback</span>
                </li>
              </ul>
              <UpgradeButton user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
