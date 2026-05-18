import React from 'react';
import { motion } from 'framer-motion';

export default function ATSScore({ score = 0, size = 120 }) {
  const radius = size * 0.4;
  const stroke = size * 0.08;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s < 40) return '#ef4444'; // Red
    if (s < 70) return '#f59e0b'; // Yellow/Amber
    return '#10b981'; // Green
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          height={size}
          width={size}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            className="text-slate-200 dark:text-slate-800"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress Circle */}
          <motion.circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-display" style={{ color }}>
            {score}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            ATS Score
          </span>
        </div>
      </div>
    </div>
  );
}
