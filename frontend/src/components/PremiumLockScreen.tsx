import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Lock, Sparkles, CheckCircle } from 'lucide-react';
import { ProUpgradeDialog } from './ProUpgradeDialog';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface PremiumLockScreenProps {
  title: string;
  description: string;
  features: string[];
  reason: string;
}

export function PremiumLockScreen({ title, description, features, reason }: PremiumLockScreenProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">
      <Navbar />
      
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 lg:p-12 glass border-border/80 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-gold" />
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 shadow-lg animate-bounce">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">
              {title} <span className="text-gradient-gold">Pro Feature</span>
            </h1>
            
            <p className="text-muted-foreground text-sm lg:text-base font-medium max-w-md mb-8 leading-relaxed">
              {description}
            </p>

            {/* Premium Features Checklist */}
            <div className="w-full max-w-md bg-background/50 border border-border/40 p-6 rounded-2xl mb-8 text-left space-y-4 shadow-inner">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> UNLOCKED WITH PRO
              </h3>
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-foreground/80 leading-snug">{feat}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setUpgradeOpen(true)}
              size="lg"
              className="bg-primary hover:scale-[1.03] active:scale-[0.97] transition-all text-primary-foreground font-black h-14 px-10 rounded-xl shadow-xl shadow-primary/20 text-base w-full max-w-md"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse text-amber-300" />
              Upgrade for ₹100/month
            </Button>
          </Card>
        </motion.div>
      </main>

      <ProUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={reason} />
    </div>
  );
}
