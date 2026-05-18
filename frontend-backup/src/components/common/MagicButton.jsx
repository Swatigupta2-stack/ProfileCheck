import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function MagicButton({ 
  onClick, 
  loading, 
  children = "Enhance with AI", 
  className 
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={twMerge(
        "magic-gradient relative group px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
    >
      {/* Sparkle Background Animation */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5 group-hover:animate-sparkle" />
      )}
      
      <span className="relative z-10">{loading ? "Magic in progress..." : children}</span>
      
      {/* Decorative Shine Effect */}
      <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />
    </motion.button>
  );
}
