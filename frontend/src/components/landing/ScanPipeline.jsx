import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ScanPipeline() {
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      step: '01',
      title: 'Fetch Page HTML',
      tech: 'Axios HTTP Engine',
      desc: 'Requests the target public page over HTTPS with custom browser User-Agent headers, enforce 20s timeouts, and SSRF security checks.'
    },
    {
      step: '02',
      title: 'Parse DOM Structure',
      tech: 'Cheerio Parser',
      desc: 'Builds a server-side virtual document object model (DOM) tree to inspect HTML tags, element attributes, hierarchy, and metadata.'
    },
    {
      step: '03',
      title: 'Evaluate Rules',
      tech: 'WCAG 2.2 + SEO Modules',
      desc: 'Runs automated accessibility checks (alt text, lang, contrast, form labels, headings) and SEO parameters (meta tags, viewport, canonical).'
    },
    {
      step: '04',
      title: 'Score & Generate Fixes',
      tech: 'Weighted Index (70/30)',
      desc: 'Calculates Lighthouse-style scores, maps W3C criteria to before/after code fixes, and optionally generates server-side AI explanations.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Pipeline Architecture</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          What happens when you scan
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          The exact 4-stage inspection pipeline executed on our server.
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
            className="bg-[#121829] border border-[#1A233A] hover:border-[#FFB800]/50 p-6 rounded-2xl space-y-4 shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-bold text-[#FFB800]">
                {item.step}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#0B0F1A] border border-[#1A233A] font-mono text-[10px] text-[#2DD4BF] font-semibold">
                {item.tech}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB] group-hover:text-[#FFB800] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#9AA4BF] leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
