import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import HeroInspection from '../components/landing/HeroInspection';
import ScanPipeline from '../components/landing/ScanPipeline';
import RuleExplorer from '../components/landing/RuleExplorer';
import ScoringPlayground from '../components/landing/ScoringPlayground';
import SampleReportPreview from '../components/landing/SampleReportPreview';
import TargetAudience from '../components/landing/TargetAudience';
import UnderTheHood from '../components/landing/UnderTheHood';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFooter from '../components/landing/LandingFooter';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Exact submit handler & API call reusing current audit pipeline
  async function runAudit(targetUrl) {
    if (!targetUrl) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned ${resp.status}`);
      }

      const data = await resp.json();
      setLoading(false);
      navigate('/results', { state: data });
    } catch (err) {
      console.error('Audit failed:', err);
      setErrorMsg(err.message || 'Failed to scan. Is the backend server running?');
      setLoading(false);
    }
  }

  const handleNavScroll = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusHeroInput = () => {
    handleNavScroll('hero-scan');
    const inputEl = document.getElementById('hero-url-input');
    if (inputEl) {
      inputEl.focus();
    }
  };

  return (
    <div className="landing-dark-theme min-h-screen bg-[#0B0F1A] text-[#F4F6FB] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FFB800] selection:text-[#0B0F1A] overflow-x-hidden">
      
      {/* Skip to main content link for keyboard accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-[#FFB800] focus:text-[#0B0F1A] focus:px-4 focus:py-2.5 focus:z-[9999] focus:rounded-lg focus:font-bold border border-white"
      >
        Skip to main content
      </a>

      {/* 1. Header */}
      <LandingHeader
        onScanClick={handleFocusHeroInput}
        onNavScroll={handleNavScroll}
      />

      <main id="main-content" className="space-y-8">
        {/* 2. Hero Section */}
        <HeroInspection
          onSubmitScan={runAudit}
          loading={loading}
          errorMsg={errorMsg}
        />

        {/* 3. Pipeline Steps */}
        <ScanPipeline />

        {/* 4. Rule Explorer */}
        <RuleExplorer />

        {/* 5. Scoring Playground */}
        <ScoringPlayground />

        {/* 6. Sample Report Preview */}
        <SampleReportPreview />

        {/* 7. Target Audience */}
        <TargetAudience />

        {/* 8. Under The Hood */}
        <UnderTheHood />

        {/* 9. FAQ Accordion */}
        <LandingFAQ />
      </main>

      {/* 10. Final CTA & Footer */}
      <LandingFooter
        onSubmitScan={runAudit}
        loading={loading}
      />

    </div>
  );
}
