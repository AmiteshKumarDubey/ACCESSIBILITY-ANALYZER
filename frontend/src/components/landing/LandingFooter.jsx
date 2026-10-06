import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] pt-16 pb-12 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Final CTA Section */}
      <div className="max-w-4xl mx-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 text-center space-y-6 shadow-sm">
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
          Ready to inspect your web page?
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto font-medium">
          Enter any public URL below to run an instant WCAG 2.2 AA and SEO accessibility audit.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-2">
          <div className="flex flex-col sm:flex-row gap-2 bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-color)] focus-within:border-[var(--accent-amber)]">
            <input
              type="text"
              aria-label="Enter public webpage URL for final scan"
              placeholder="https://example.com"
              value={footerUrl}
              onChange={(e) => {
                setFooterUrl(e.target.value);
                if (footerError) setFooterError('');
              }}
              className="w-full bg-transparent text-sm font-mono px-3 py-2 outline-none text-[var(--text-main)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[var(--accent-amber)] text-black font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif] hover:opacity-90 transition-opacity cursor-pointer shrink-0"
            >
              {loading ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>
          {footerError && (
            <p className="text-xs font-mono text-[var(--color-issue)] font-semibold" role="alert">
              ⚠️ {footerError}
            </p>
          )}
        </form>
      </div>

      {/* Honest Footer Links & Credits */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-[var(--text-main)]">Accessibility Analyzer</span>
          <span>•</span>
          <Link to="/privacy" className="hover:text-[var(--accent-amber)] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[var(--accent-amber)] transition-colors">Terms of Service</Link>
          <a
            href="https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-amber)] transition-colors inline-flex items-center gap-1"
          >
            GitHub ↗
          </a>
        </div>

        <div className="text-center sm:text-right space-y-1">
          <p>
            Open-source project by{' '}
            <a
              href="https://github.com/AmiteshKumarDubey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-amber)] font-bold hover:underline"
            >
              Amitesh Kumar Dubey
            </a>
          </p>
          <p className="text-[11px] text-[var(--text-muted)]">
            MIT Licensed • Built with React, Node.js & Express
          </p>
        </div>
      </div>

    </footer>
  );
}
