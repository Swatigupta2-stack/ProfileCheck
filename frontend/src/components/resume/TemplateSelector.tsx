import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, TEMPLATES } from "@/data/templates";
import { Layout } from "lucide-react";

interface TemplateSelectorProps {
  currentTemplateId: string;
  onTemplateChange: (id: string) => void;
}

export const TemplateSelector = ({ currentTemplateId, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="flex items-center gap-2 mb-4 bg-muted/30 p-2 rounded-lg border border-border/50">
      <Layout className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Template:</span>
      <Select value={currentTemplateId} onValueChange={onTemplateChange}>
        <SelectTrigger className="h-8 text-xs font-medium border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-[10px] uppercase tracking-widest text-primary/60 font-bold px-2 py-1.5">{category}</SelectLabel>
              {TEMPLATES.filter(t => t.category === category).map((template) => (
                <SelectItem key={template.id} value={template.id} className="text-xs">
                  {template.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
