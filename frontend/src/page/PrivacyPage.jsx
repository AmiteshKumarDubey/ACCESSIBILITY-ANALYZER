import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 flex flex-col">
      <LandingHeader />
      
      <main id="main" className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link to="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors">
            ← Back to Home
          </Link>
        </nav>

        <h1 className="text-3xl font-bold mb-4 text-[var(--text-main)]">Privacy Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Last updated: October 2026 • Plain-English & Transparent
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--text-muted)]">
          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">1. What Data We Process</h2>
            <p className="mb-2">
              Accessibility Analyzer is designed with privacy by default. When you submit a URL for inspection:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Our server fetches the target public page's HTML to perform automated WCAG 2.2 and SEO rule checks.</li>
              <li>We do <strong>not</strong> track, log, or sell your personal identity or browsing history.</li>
              <li>Scan result scores are cached temporarily in server memory for 10 minutes strictly to prevent duplicate network traffic and abuse.</li>
            </ul>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">2. Local Browser Storage</h2>
            <p className="mb-2">
              The application uses your browser's <code>localStorage</code> solely for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Storing your theme preference (Dark or Light mode).</li>
              <li>Saving local scan score history so you can track score deltas across scans.</li>
            </ul>
            <p className="mt-2">
              No cookies or cross-site tracking scripts are used.
            </p>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">3. Automated Audits Disclaimer</h2>
            <p>
              Audits are strictly automated static analyses of server-rendered HTML. Automated tools detect roughly 30%–40% of WCAG criteria. They do not constitute legal advice, official compliance certification, or a guarantee against legal claims.
            </p>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">4. Contact & Code</h2>
            <p>
              This is an open resume portfolio project. You can inspect the source code on{' '}
              <a 
                href="https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--accent-text)] underline"
              >
                GitHub
              </a>.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
