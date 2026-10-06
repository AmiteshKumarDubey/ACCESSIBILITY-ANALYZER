import React, { useState } from 'react';

export default function LandingFooter({ onSubmitScan, loading }) {
  const [footerUrl, setFooterUrl] = useState('');
  const [footerError, setFooterError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setFooterError('');

    let trimmed = footerUrl.trim();
    if (!trimmed) {
      setFooterError('Please enter a website URL.');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
      setFooterUrl(trimmed);
    }

    try {
      new URL(trimmed);
    } catch (_) {
      setFooterError('Please enter a valid URL.');
      return;
    }

    onSubmitScan(trimmed);
  };

  return (
    <footer className="border-t border-[#1A233A] bg-[#0B0F1A] text-[#F4F6FB] pt-16 pb-12 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto bg-[#121829] border border-[#1A233A] rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F6FB]">
          Ready to inspect your web page?
        </h2>
        <p className="text-xs sm:text-sm text-[#9AA4BF] max-w-xl mx-auto font-medium">
          Enter any public URL below to run an instant WCAG 2.2 AA and SEO accessibility audit.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-2">
          <div className="flex flex-col sm:flex-row gap-2 bg-[#0B0F1A] p-2 rounded-xl border border-[#1A233A] focus-within:border-[#FFB800]">
            <input
              type="text"
              aria-label="Enter public webpage URL for final scan"
              placeholder="https://example.com"
              value={footerUrl}
              onChange={(e) => {
                setFooterUrl(e.target.value);
                if (footerError) setFooterError('');
              }}
              className="w-full bg-transparent text-sm font-mono px-3 py-2 outline-none text-[#F4F6FB]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#FFB800] text-[#0B0F1A] font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif] hover:bg-[#FFA800] transition-colors cursor-pointer shrink-0"
            >
              {loading ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>
          {footerError && (
            <p className="text-xs font-mono text-[#FF5C5C] font-semibold" role="alert">
              ⚠️ {footerError}
            </p>
          )}
        </form>
      </div>

      {/* Honest Footer Credits */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#9AA4BF] border-t border-[#1A233A]/60 pt-8">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#F4F6FB]">Accessibility Analyzer</span>
          <span>•</span>
          <span>WCAG 2.2 & SEO Inspector</span>
        </div>

        <div className="text-center sm:text-right space-y-1">
          <p>
            Open-source project by{' '}
            <a
              href="https://github.com/AmiteshKumarDubey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB800] font-bold hover:underline"
            >
              Amitesh Kumar Dubey
            </a>
          </p>
          <p className="text-[11px] text-[#9AA4BF]/70">
            MIT Licensed • Built with React, Node.js, Express & Cheerio
          </p>
        </div>
      </div>

    </footer>
  );
}
