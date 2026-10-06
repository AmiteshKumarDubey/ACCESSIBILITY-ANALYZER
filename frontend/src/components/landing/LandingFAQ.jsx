import React, { useState } from 'react';

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'Is Accessibility Analyzer completely free?',
      a: 'Yes, 100% free and open-source portfolio tool. There are no paid tiers, subscription traps, or trial limits.'
    },
    {
      q: 'Do you store or log my scanned URLs?',
      a: 'No. Scanned URLs are processed strictly in memory to evaluate the HTML. Previous scan history is stored locally in your browser via localStorage.'
    },
    {
      q: 'Which web pages can I scan?',
      a: 'You can scan any publicly accessible web page over http:// or https://. Private IP ranges, loopback addresses (localhost), and link-local addresses are blocked for security.'
    },
    {
      q: 'Why do some client-rendered SPA pages show fewer results?',
      a: 'Accessibility Analyzer inspects server-rendered HTML. Pages built with client-only JavaScript frameworks that render HTML dynamically after initial load will only expose their initial HTML markup.'
    },
    {
      q: 'Is this an official legal compliance certificate?',
      a: 'No. Automated DOM scanning is an engineering inspection tool that catches structural WCAG violations. It does not replace manual assistive technology testing by human accessibility specialists.'
    },
    {
      q: 'How is the overall score calculated?',
      a: 'Scores evaluate detected accessibility and SEO issues based on severity, combining evaluated criteria into a unified score.'
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[var(--border-color)]">
      
      {/* Section Header with <= 2 pill labels */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-amber)]">
          <span>FAQ</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Truthful answers based strictly on our open-source codebase.
        </p>
      </div>

      {/* Accessible Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm sm:text-base text-[var(--text-main)] hover:text-[var(--accent-amber)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] cursor-pointer"
              >
                <span>{faq.q}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transform transition-transform duration-200 shrink-0 text-[var(--accent-amber)] ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--text-muted)] font-medium leading-relaxed border-t border-[var(--border-color)] animate-in fade-in duration-150"
                >
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
}
