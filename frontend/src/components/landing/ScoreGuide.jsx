import React from 'react';
import { motion } from 'framer-motion';

export default function ScoreGuide() {
  const scoreRanges = [
    {
      range: '90 – 100',
      label: 'Good / High Compliance',
      color: 'border-[#2DD4BF] text-[#2DD4BF] bg-[#2DD4BF]/10',
      dot: 'bg-[#2DD4BF]',
      description: 'Clean accessibility baseline and high SEO health. Minimal or no critical barriers detected.'
    },
    {
      range: '70 – 89',
      label: 'Needs Attention',
      color: 'border-[#FFB800] text-[#FFB800] bg-[#FFB800]/10',
      dot: 'bg-[#FFB800]',
      description: 'Moderate accessibility or structural issues found. Some user groups may experience difficulty.'
    },
    {
      range: '0 – 69',
      label: 'Critical Remediation Needed',
      color: 'border-[#FF5C5C] text-[#FF5C5C] bg-[#FF5C5C]/10',
      dot: 'bg-[#FF5C5C]',
      description: 'Severe accessibility barriers detected (missing labels, broken heading order, missing alt text).'
    }
  ];

  return (
    <section id="scoring-explained" className="py-20 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors border-t border-[var(--border-color)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with pill count <= 2 */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-amber)] mb-4">
            <span>Score Interpretation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)] mb-4">
            How to read your score
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Plain-language guidance on what your Accessibility, SEO, and Overall scores mean for site usability.
          </p>
        </div>

        {/* 3 Score Cards Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <h3 className="text-base font-bold text-[var(--text-main)] mb-2">Accessibility Score</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Reflects WCAG 2.2 AA compliance checks (alt text, ARIA roles, form labels, color contrast, and heading structure).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-pass)]/10 text-[var(--color-pass)] flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h3 className="text-base font-bold text-[var(--text-main)] mb-2">SEO Score</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Measures document metadata, viewport configuration, canonical tags, open graph tags, and document title completeness.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 className="text-base font-bold text-[var(--text-main)] mb-2">Overall Score</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Unified indicator combining overall accessibility and SEO evaluation into a single clear index.
            </p>
          </div>
        </div>

        {/* Score Threshold Reading Guide */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--text-muted)] mb-4">
            Score Reading Thresholds
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {scoreRanges.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xl font-extrabold text-[var(--text-main)]">
                      {item.range}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.color} flex items-center gap-1.5`}>
                      <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
