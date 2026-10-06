import React from "react";
import { PieChart, Pie, Cell } from "recharts";

/**
 * ScoreChart / ScoreRing Component
 * Status Thresholds (WCAG Standard):
 * - 90–100: Good (var(--good))
 * - 70–89:  Needs work (var(--warn-ring) / var(--warn))
 * - 0–69:   Poor (var(--bad))
 */
export default function ScoreChart({ score = 0, label = "Score" }) {
  const data = [
    { name: "score", value: score },
    { name: "rest", value: Math.max(0, 100 - score) },
  ];

  // Status threshold calculation
  let colorVar = "var(--bad)";
  let statusText = "Poor";
  let statusColorClass = "text-[var(--bad)]";

  if (score >= 90) {
    colorVar = "var(--good)";
    statusText = "Good";
    statusColorClass = "text-[var(--good)]";
  } else if (score >= 70) {
    colorVar = "var(--warn-ring)";
    statusText = "Needs work";
    statusColorClass = "text-[var(--warn-text)]";
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[200px] hover:scale-105 transition-transform duration-300">
      <div className="relative flex items-center justify-center mb-3">
        <PieChart width={150} height={150}>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={70}
            innerRadius={55}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={colorVar} />
            <Cell fill="var(--ring-track)" />
          </Pie>
        </PieChart>
        
        {/* Score in center */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-[var(--text-main)] leading-none font-mono">
            {score}
          </span>
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-[var(--text-main)] text-center mb-0.5">{label}</h3>
      <span className={`text-xs font-semibold ${statusColorClass} tracking-wide`}>
        {statusText}
      </span>
    </div>
  );
}
