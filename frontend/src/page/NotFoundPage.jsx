import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 flex flex-col">
      <LandingHeader />

      <main id="main" className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--accent-text)] font-mono text-2xl font-bold mb-6 shadow-sm">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-md mb-8">
          The page or inspection report you are looking for does not exist or has moved.
        </p>
        <Link
          to="/"
          className="bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-90 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Return to Home
        </Link>
      </main>

      <LandingFooter />
    </div>
  );
}
