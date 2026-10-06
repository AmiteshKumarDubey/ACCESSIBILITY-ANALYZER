import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ScanPipeline() {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      step: '01',
      title: 'Fetch Page HTML',
      category: 'Network Fetch',
      desc: 'Requests the target public URL over a secure connection to retrieve document markup.'
    },
    {
      step: '02',
      title: 'Parse DOM Tree',
      category: 'Structure Analysis',
      desc: 'Builds a document tree to inspect element tags, ARIA attributes, form controls, and metadata.'
    },
    {
      step: '03',
      title: 'Evaluate WCAG Rules',
      category: 'Rules Engine',
      desc: 'Runs automated accessibility checks and SEO parameters against standard guidelines.'
    },
    {
      step: '04',
      title: 'Generate Fix Report',
      category: 'Report Synthesis',
      desc: 'Summarizes score metrics, categorizes issue severities, and prepares plain-English fix recommendations.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 border-t border-[var(--border)]">
      
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-mono text-[var(--accent-text)]">
          <span>Inspection Pipeline</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          What happens when you scan
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          The 4-stage inspection workflow executed for every website analysis.
        </p>
      </div>

      {/* 4 Pipeline Steps Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] p-6 rounded-2xl space-y-4 shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-[var(--accent-text)]">
                {item.step}
              </span>
              <span className="px-2 py-0.5 rounded bg-[var(--bg-main)] border border-[var(--border)] font-mono text-[10px] text-[var(--good)] font-semibold">
                {item.category}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[var(--text-main)] group-hover:text-[var(--accent-text)] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
