import React from 'react';

/**
 * ScoreRing SVG Component
 * Thresholds:
 * - 90+: Good (var(--good))
 * - 70-89: Needs work (var(--warn-ring))
 * - <70: Poor (var(--bad))
 */
export default function ScoreRing({ score = 0, label = "Score" }) {
  const size = 100, stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, score / 100)));

  let strokeColor = "var(--bad)";
  let statusText = "Poor";
  let statusColorClass = "text-[var(--bad)]";

  if (score >= 90) {
    strokeColor = "var(--good)";
    statusText = "Good";
    statusColorClass = "text-[var(--good)]";
  } else if (score >= 70) {
    strokeColor = "var(--warn-ring)";
    statusText = "Needs work";
    statusColorClass = "text-[var(--warn-text)]";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} stroke="var(--ring-track)" strokeWidth={stroke} fill="none" />
          <circle 
            cx={size/2} 
            cy={size/2} 
            r={r} 
            stroke={strokeColor} 
            strokeWidth={stroke} 
            fill="none" 
            strokeDasharray={c} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            transform={`rotate(-90 ${size/2} ${size/2})`} 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[var(--text-main)] font-mono">{score}</span>
        </div>
      </div>
      {label && <span className="text-xs font-semibold text-[var(--text-muted)] mt-1">{label}</span>}
      <span className={`text-[11px] font-bold ${statusColorClass}`}>{statusText}</span>
    </div>
  );
}
