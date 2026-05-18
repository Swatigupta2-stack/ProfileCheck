import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Sparkles, Lock } from "lucide-react";
import { CATEGORIES, TEMPLATES, ResumeTemplate } from "@/data/templates";
import { ResumeData } from "@/types/resume";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumePreview } from "./ResumePreview";
import { useAuth } from "@/hooks/useAuth";
import { ProUpgradeDialog } from "@/components/ProUpgradeDialog";
import { useState } from "react";

interface TemplateGalleryDialogProps {
  onSelectTemplate: (template: ResumeTemplate) => void;
}

export const TemplateGalleryDialog = ({ onSelectTemplate }: TemplateGalleryDialogProps) => {
  const { isPro } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <LayoutGrid className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Resume Template Gallery
          </DialogTitle>
          <p className="text-muted-foreground">
            Choose from our professional templates. Click "Preview Template" to see it in action.
          </p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mt-4 pr-4">
          <div className="space-y-12">
            {CATEGORIES.map((category) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-2">
                  <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {TEMPLATES.filter(t => t.category === category).length} Templates
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TEMPLATES.filter(t => t.category === category).map((template) => {
                    const isPremium = template.category !== 'Standard' && template.category !== 'Compact';
                    const isLocked = isPremium && !isPro;

                    return (
                      <div 
                        key={template.id} 
                        className="group border-2 rounded-2xl overflow-hidden bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-500 flex flex-col relative"
                      >
                        {isLocked && (
                          <div className="absolute top-3 right-3 z-20 bg-amber-500/90 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Lock className="w-3 h-3" /> Pro
                          </div>
                        )}
                        <div className="aspect-[3/4] bg-white relative overflow-hidden border-b transition-colors">
                           {/* Visual Preview for Template - Larger and filling more space */}
                           <div className="absolute inset-0 scale-[0.35] origin-top-left w-[285%] h-[285%] pointer-events-none group-hover:scale-[0.38] transition-transform duration-700">
                              <ResumePreview data={template.exampleData} />
                           </div>
                           
                           {/* Improved Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6 translate-y-4 group-hover:translate-y-0">
                              {isLocked ? (
                                <Button 
                                  size="sm" 
                                  className="w-full shadow-2xl bg-amber-600 hover:bg-amber-700 text-white font-black h-12 rounded-xl hover:scale-105 active:scale-95 transition-all gap-1.5"
                                  onClick={() => setUpgradeOpen(true)}
                                >
                                  <Lock className="w-4 h-4" /> Unlock with Pro
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="w-full shadow-2xl bg-primary text-primary-foreground font-black h-12 rounded-xl hover:scale-105 active:scale-95 transition-all"
                                  onClick={() => onSelectTemplate(template)}
                                >
                                  Use This Template
                                </Button>
                              )}
                           </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col gap-3 bg-muted/5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-base tracking-tight">{template.name}</h4>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-background/50">
                              {template.layoutType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <ProUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason="To unlock premium design templates" />
      </DialogContent>
    </Dialog>
  );
};
