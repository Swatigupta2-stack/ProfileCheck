import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GaugeProps {
  label: string;
  score: number;
  recommendation: string;
}

const colorFor = (s: number) => {
  if (s >= 75) return "#22c55e"; // Green
  if (s >= 50) return "#eab308"; // Yellow
  return "#ef4444"; // Red
};

export const ScoreGauge = ({ label, score, recommendation }: GaugeProps) => {
  const color = colorFor(score);

  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border glass-morphism hover:shadow-lg transition-all duration-300">
      <div className="w-24 h-24 mb-4">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textSize: '22px',
            pathColor: color,
            textColor: color,
            trailColor: '#e2e8f0',
            pathTransitionDuration: 1.5,
          })}
        />
      </div>
      <div className="font-bold text-sm text-foreground uppercase tracking-wider mb-1">{label}</div>
      <p className="text-[11px] text-muted-foreground leading-tight min-h-[32px] flex items-center justify-center">
        {recommendation}
      </p>
    </div>
  );
};

