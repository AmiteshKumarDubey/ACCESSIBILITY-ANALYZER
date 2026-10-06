import React from 'react';

export default function TargetAudience() {
  const audiences = [
    {
      title: 'Developers',
      icon: '💻',
      desc: 'Inspect server-rendered DOM nodes against WCAG criteria without bloating dev environments.',
      span: 'sm:col-span-2'
    },
    {
      title: 'Students & Learners',
      icon: '🎓',
      desc: 'Learn practical web accessibility standards through real before/after HTML code fixes.',
      span: 'sm:col-span-1'
    },
    {
      title: 'Freelancers & Agencies',
      icon: '⚡',
      desc: 'Export clear PDF and JSON audit reports to deliver transparent client site handoffs.',
      span: 'sm:col-span-1'
    },
    {
      title: 'Small Site Owners',
      icon: '🌐',
      desc: 'Run instant, automated checks to catch obvious contrast, alt text, and SEO heading gaps.',
      span: 'sm:col-span-2'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Target Users</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          Who it is for
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          Built for anyone looking to build a more inclusive, well-structured web.
        </p>
      </div>

      {/* Asymmetric 4 Card Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {audiences.map((aud, idx) => (
          <div
            key={idx}
            className={`bg-[#121829] border border-[#1A233A] hover:border-[#FFB800]/40 p-6 rounded-2xl space-y-3 shadow-xl transition-all ${aud.span}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{aud.icon}</span>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#F4F6FB]">
                {aud.title}
              </h3>
            </div>
            <p className="text-xs text-[#9AA4BF] font-medium leading-relaxed">
              {aud.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
