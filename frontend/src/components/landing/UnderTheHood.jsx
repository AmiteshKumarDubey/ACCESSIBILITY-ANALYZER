import React from 'react';

export default function UnderTheHood() {
  const limitations = [
    {
      title: 'Server-Fetched HTML Inspection',
      desc: 'Parses server-rendered HTML. Single Page Applications (SPAs) reliant entirely on dynamic client-side JavaScript rendering may report fewer detected issues.'
    },
    {
      title: 'Automated Checks Are Not Legal Certificates',
      desc: 'Automated scanners detect ~30%–40% of WCAG criteria. A high score does not replace manual screen reader testing or legal compliance auditing.'
    },
    {
      title: 'Public Pages Only',
      desc: 'Only publicly reachable http:// and https:// URLs are analyzed. Pages behind user authentication, paywalls, or internal networks are blocked.'
    }
  ];

  return (
    <section id="limitations-note" className="py-16 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors border-t border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-mono text-[var(--accent-text)] mb-3">
            <span>Scanner Scope</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] mb-3">
            Tool Limitations
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Honest declarations on what static automated inspection can and cannot evaluate.
          </p>
        </div>

        {/* 3 Short Bullets Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {limitations.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent-text)] font-bold flex items-center justify-center text-xs mb-3 font-mono">
                  0{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-[var(--text-main)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
