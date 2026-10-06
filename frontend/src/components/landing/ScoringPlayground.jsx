import React, { useState } from 'react';

export default function ScoringPlayground() {
  const [criticalCount, setCriticalCount] = useState(1);
  const [majorCount, setMajorCount] = useState(2);
  const [minorCount, setMinorCount] = useState(3);

  // REAL formula from scoring.js:
  // Critical: -20 pts | Major: -10 pts | Minor: -1 pt
  const penalty = criticalCount * 20 + majorCount * 10 + minorCount * 1;
  const wcagScore = Math.max(0, Math.min(100, 100 - penalty));

  // Simulated SEO score based on minor/major SEO deductions
  const seoPenalty = majorCount * 8 + minorCount * 2;
  const seoScore = Math.max(0, Math.min(100, 100 - seoPenalty));

  // REAL 70/30 overall weighted score formula from auditRunner.js
  const overallScore = Math.round(wcagScore * 0.7 + seoScore * 0.3);

  return (
    <section id="scoring-explained" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Scoring Engine</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          Your score, explained
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          Test the exact 70/30 weighted formula and issue severity deductions used by our scanner.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-[#121829] border border-[#1A233A] rounded-2xl p-6 sm:p-8 grid md:grid-cols-2 gap-8 shadow-xl">
        
        {/* Left: Interactive Steppers / Sliders */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A233A] pb-3">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB]">
              Adjust Issue Counts
            </h3>
            <span className="px-2.5 py-1 rounded bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 font-mono text-xs font-bold uppercase tracking-wider">
              Try it
            </span>
          </div>

          {/* Stepper 1: Critical */}
          <div className="space-y-2 bg-[#0B0F1A] p-4 rounded-xl border border-[#1A233A]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#FF5C5C]">Critical Issues (-20 pts)</span>
              <span className="font-bold text-[#F4F6FB] text-sm">{criticalCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="5"
                value={criticalCount}
                onChange={(e) => setCriticalCount(Number(e.target.value))}
                className="w-full accent-[#FF5C5C] cursor-pointer"
                aria-label="Critical issues count slider"
              />
            </div>
            <p className="text-[11px] text-[#9AA4BF]">Missing lang, missing title, low contrast, noindex tags</p>
          </div>

          {/* Stepper 2: Major */}
          <div className="space-y-2 bg-[#0B0F1A] p-4 rounded-xl border border-[#1A233A]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#FFB800]">Major Issues (-10 pts)</span>
              <span className="font-bold text-[#F4F6FB] text-sm">{majorCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="8"
                value={majorCount}
                onChange={(e) => setMajorCount(Number(e.target.value))}
                className="w-full accent-[#FFB800] cursor-pointer"
                aria-label="Major issues count slider"
              />
            </div>
            <p className="text-[11px] text-[#9AA4BF]">Missing alt text, missing H1, unlabeled form controls</p>
          </div>

          {/* Stepper 3: Minor */}
          <div className="space-y-2 bg-[#0B0F1A] p-4 rounded-xl border border-[#1A233A]">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#9AA4BF]">Minor Issues (-1 pt)</span>
              <span className="font-bold text-[#F4F6FB] text-sm">{minorCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="10"
                value={minorCount}
                onChange={(e) => setMinorCount(Number(e.target.value))}
                className="w-full accent-[#9AA4BF] cursor-pointer"
                aria-label="Minor issues count slider"
              />
            </div>
            <p className="text-[11px] text-[#9AA4BF]">Meta description length, missing Open Graph tags</p>
          </div>
        </div>

        {/* Right: Live Calculated Scores */}
        <div className="bg-[#0B0F1A] border border-[#1A233A] rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="border-b border-[#1A233A] pb-3">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB]">
              Calculated Score Results
            </h3>
            <p className="font-mono text-xs text-[#9AA4BF]">
              Total penalty: -{penalty} pts
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#121829] border border-[#1A233A] rounded-xl space-y-1">
              <div className="font-mono text-2xl font-bold text-[#FFB800]">{wcagScore}</div>
              <div className="text-xs font-semibold text-[#F4F6FB]">WCAG</div>
              <div className="text-[10px] font-mono text-[#9AA4BF]">70% Weight</div>
            </div>

            <div className="p-3 bg-[#121829] border border-[#1A233A] rounded-xl space-y-1">
              <div className="font-mono text-2xl font-bold text-[#2DD4BF]">{seoScore}</div>
              <div className="text-xs font-semibold text-[#F4F6FB]">SEO</div>
              <div className="text-[10px] font-mono text-[#9AA4BF]">30% Weight</div>
            </div>

            <div className="p-3 bg-[#121829] border border-[#1A233A] rounded-xl space-y-1">
              <div className="font-mono text-2xl font-bold text-[#F4F6FB]">{overallScore}</div>
              <div className="text-xs font-semibold text-[#F4F6FB]">Overall</div>
              <div className="text-[10px] font-mono text-[#9AA4BF]">Weighted</div>
            </div>
          </div>

          <div className="p-4 bg-[#121829] border border-[#1A233A] rounded-xl text-xs font-mono text-[#9AA4BF] space-y-1">
            <div className="font-bold text-[#F4F6FB]">Real Backend Formula:</div>
            <div>Overall = Math.round(WCAG × 0.70 + SEO × 0.30)</div>
          </div>
        </div>

      </div>

    </section>
  );
}
