import React from 'react';

export default function UnderTheHood() {
  const stack = [
    { name: 'React 18', role: 'Frontend UI Components' },
    { name: 'Vite 5', role: 'Fast ESM Asset Bundler' },
    { name: 'Node.js + Express', role: 'Backend API Server' },
    { name: 'Cheerio', role: 'Server-side HTML DOM Parser' },
    { name: 'Axios', role: 'HTTPS Request Fetcher' },
    { name: 'TailwindCSS 4', role: 'Utility-First Styling' },
    { name: 'Framer Motion', role: 'Smooth 200-500ms Animations' },
    { name: 'jsPDF', role: 'PDF Report Generator' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Architecture & Transparency</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          Under the hood
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          Open-source stack and honest technical boundaries.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Left: Tech Stack */}
        <div className="bg-[#121829] border border-[#1A233A] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1A233A] pb-3">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB]">
              Technology Stack
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 font-mono text-[10px] font-bold uppercase">
              100% Open Source
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            {stack.map((item, i) => (
              <div key={i} className="p-2.5 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-0.5">
                <div className="font-bold text-[#FFB800]">{item.name}</div>
                <div className="text-[10px] text-[#9AA4BF]">{item.role}</div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#FFB800] hover:underline"
            >
              <span>View Source Code on GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Right: Honest Limitations */}
        <div className="bg-[#121829] border border-[#1A233A] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-[#1A233A] pb-3">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB]">
              Honest Technical Limitations
            </h3>
            <p className="font-mono text-xs text-[#9AA4BF] mt-0.5">Clear boundaries on what automated DOM inspection can do</p>
          </div>

          <ul className="space-y-3 text-xs text-[#9AA4BF] font-medium leading-relaxed">
            <li className="flex items-start gap-2.5 p-2 bg-[#0B0F1A] rounded-xl border border-[#1A233A]">
              <span className="text-[#FFB800] font-bold shrink-0">1.</span>
              <span><strong>Server-Fetched HTML:</strong> Analyzes raw server HTML. Single Page Applications (SPAs) that generate DOM nodes entirely on the client via JavaScript without SSR may yield reduced results.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2 bg-[#0B0F1A] rounded-xl border border-[#1A233A]">
              <span className="text-[#FFB800] font-bold shrink-0">2.</span>
              <span><strong>Automated Check:</strong> Provides static structural validation, not an official legal ADA/WCAG compliance certificate.</span>
            </li>
            <li className="flex items-start gap-2.5 p-2 bg-[#0B0F1A] rounded-xl border border-[#1A233A]">
              <span className="text-[#FFB800] font-bold shrink-0">3.</span>
              <span><strong>Public Pages Only:</strong> Scanning is limited to public HTTP/HTTPS pages; login-protected or intranet URLs cannot be accessed.</span>
            </li>
          </ul>
        </div>

      </div>

    </section>
  );
}
