import { useState } from 'react';
import { jsonResumeTemplates } from '../services/jsonResumeAdapter';
import { Sparkles, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  currentTemplate: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ currentTemplate, onSelect }: TemplateSelectorProps) {
  const categories = ['All', 'Executive', 'Modern', 'Technical', 'Academic', 'Creative'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredTemplates = Object.entries(jsonResumeTemplates).filter(([_, t]) => 
    selectedCategory === 'All' || t.category === selectedCategory
  );
  
  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredTemplates.map(([id, template]) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(id)}
            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-500 relative overflow-hidden border ${
              currentTemplate === id
                ? 'border-primary bg-primary/5 shadow-2xl'
                : 'border-border/50 bg-card hover:border-primary/20 hover:shadow-xl'
            }`}
          >
            {currentTemplate === id && (
              <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
            
            <div className="aspect-[8.5/11] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <div className="absolute top-4 left-4 w-2/3 h-2 bg-foreground/20 rounded-full" />
                  <div className="absolute top-8 left-4 w-1/2 h-1 bg-foreground/10 rounded-full" />
                  <div className="absolute top-12 left-4 w-3/4 h-1 bg-foreground/10 rounded-full" />
                  
                  <div className="absolute bottom-8 left-4 right-4 h-1/2 bg-foreground/5 rounded-lg border border-foreground/5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors z-10">{template.name}</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">{template.name}</h3>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary/60" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{template.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
