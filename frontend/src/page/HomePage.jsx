import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import HeroInspection from '../components/landing/HeroInspection';
import ScanPipeline from '../components/landing/ScanPipeline';
import RuleExplorer from '../components/landing/RuleExplorer';
import ScoreGuide from '../components/landing/ScoreGuide';
import SampleReportPreview from '../components/landing/SampleReportPreview';
import TargetAudience from '../components/landing/TargetAudience';
import UnderTheHood from '../components/landing/UnderTheHood';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFooter from '../components/landing/LandingFooter';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 overflow-x-hidden">
      
      {/* 1. Header */}
      <LandingHeader
        onScanClick={handleFocusHeroInput}
        onNavScroll={handleNavScroll}
      />

      <main id="main" className="space-y-8">
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

        {/* 5. Score Guide */}
        <ScoreGuide />

        {/* 6. Sample Report Preview */}
        <SampleReportPreview />

        {/* 7. Target Audience */}
        <TargetAudience />

        {/* 8. Limitations Note */}
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
