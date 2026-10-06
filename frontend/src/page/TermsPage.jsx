import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 flex flex-col">
      <LandingHeader />
      
      <main id="main" className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link to="/" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors">
            ← Back to Home
          </Link>
        </nav>

        <h1 className="text-3xl font-bold mb-4 text-[var(--text-main)]">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Last updated: October 2026 • Honest Usage Terms
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--text-muted)]">
          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">1. Scope of Service</h2>
            <p>
              Accessibility Analyzer provides automated static inspections of publicly accessible web pages for WCAG 2.2 AA guidelines and search engine optimization parameters.
            </p>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">2. Limitations of Automated Audits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Not Legal Advice:</strong> Inspection reports do not constitute legal advice or formal ADA/WCAG compliance certification.
              </li>
              <li>
                <strong>Static HTML Inspection:</strong> The analyzer inspects initial server-rendered HTML. Single Page Applications (SPAs) that require complex client-side JavaScript rendering may report fewer issues.
              </li>
              <li>
                <strong>Public Pages Only:</strong> Scanning behind logins, paywalls, or internal network endpoints is intentionally restricted.
              </li>
            </ul>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">3. Acceptable Use</h2>
            <p>
              You agree to use this tool for lawful web auditing and development purposes only. Automated abuse, denial-of-service attempts, or scanning private internal network hosts is prohibited and blocked by server security.
            </p>
          </section>

          <section className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">4. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranty of any kind. The project author assumes no liability for errors, omitted accessibility checks, or site decisions made based on audit results.
            </p>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
