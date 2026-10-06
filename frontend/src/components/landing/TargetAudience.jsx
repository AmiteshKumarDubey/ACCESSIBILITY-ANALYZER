import React from 'react';

export default function TargetAudience() {
  const audiences = [
    {
      title: 'Developers',
      iconSvg: <svg className="w-5 h-5 text-[var(--accent-amber)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>,
      desc: 'Inspect server-rendered DOM nodes against WCAG criteria without bloating dev environments.',
      span: 'sm:col-span-2'
    },
    {
      title: 'Students & Learners',
      iconSvg: <svg className="w-5 h-5 text-[var(--accent-amber)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>,
      desc: 'Learn practical web accessibility standards through real before/after HTML code fixes.',
      span: 'sm:col-span-1'
    },
    {
      title: 'Freelancers & Agencies',
      iconSvg: <svg className="w-5 h-5 text-[var(--accent-amber)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
      desc: 'Export clear PDF and JSON audit reports to deliver transparent client site handoffs.',
      span: 'sm:col-span-1'
    },
    {
      title: 'Small Site Owners',
      iconSvg: <svg className="w-5 h-5 text-[var(--accent-amber)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
      desc: 'Run instant, automated checks to catch obvious contrast, alt text, and SEO heading gaps.',
      span: 'sm:col-span-2'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[var(--border-color)]">
      
      {/* Section Header with <= 2 pill badges */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-amber)]">
          <span>Target Users</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          Who it is for
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Built for anyone looking to build a more inclusive, well-structured web.
        </p>
      </div>

      {/* Asymmetric 4 Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {audiences.map((aud, idx) => (
          <div
            key={idx}
            className={`bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--accent-amber)] p-6 rounded-2xl space-y-3 shadow-sm transition-all ${aud.span}`}
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                {aud.iconSvg}
              </span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[var(--text-main)]">
                {aud.title}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
              {aud.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
