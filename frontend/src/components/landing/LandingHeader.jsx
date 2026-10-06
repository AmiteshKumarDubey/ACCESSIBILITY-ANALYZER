import React, { useState, useEffect, useRef } from 'react';

export default function LandingHeader({ onScanClick, onNavScroll }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll('button, a');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F1A]/90 backdrop-blur-md border-b border-[#1A233A] text-[#F4F6FB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a 
          href="#main-content" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#FFB800] rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFB800] text-[#0B0F1A] flex items-center justify-center font-bold shadow-md shadow-[#FFB800]/10 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <circle cx="11.5" cy="14.5" r="2.5"/>
              <path d="M13.25 16.25 16 19"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base sm:text-lg leading-tight tracking-tight text-[#F4F6FB]">
              Accessibility Analyzer
            </span>
            <span className="text-[11px] font-mono text-[#9AA4BF] font-medium tracking-wide">
              WCAG 2.2 Inspection Lab
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#9AA4BF]" aria-label="Main Landing Navigation">
          <button 
            onClick={() => onNavScroll('hero-scan')} 
            className="hover:text-[#FFB800] transition-colors focus:outline-none focus:text-[#FFB800]"
          >
            Scan
          </button>
          <button 
            onClick={() => onNavScroll('how-it-works')} 
            className="hover:text-[#FFB800] transition-colors focus:outline-none focus:text-[#FFB800]"
          >
            How it works
          </button>
          <button 
            onClick={() => onNavScroll('rules-checked')} 
            className="hover:text-[#FFB800] transition-colors focus:outline-none focus:text-[#FFB800]"
          >
            Rules
          </button>
          <button 
            onClick={() => onNavScroll('scoring-explained')} 
            className="hover:text-[#FFB800] transition-colors focus:outline-none focus:text-[#FFB800]"
          >
            Scoring
          </button>
          <a 
            href="https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#F4F6FB] transition-colors flex items-center gap-1.5 focus:outline-none focus:text-[#F4F6FB]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onScanClick}
            className="px-5 py-2.5 rounded-xl bg-[#FFB800] text-[#0B0F1A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm hover:bg-[#FFA800] transition-all shadow-md shadow-[#FFB800]/20 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span>Scan a website</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl border border-[#1A233A] text-[#F4F6FB] hover:bg-[#121829] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
          aria-label={mobileMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden border-b border-[#1A233A] bg-[#0B0F1A] px-4 py-6 space-y-4 animate-in slide-in-from-top-2"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-[#9AA4BF]">
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavScroll('hero-scan'); }}
              className="text-left py-2 hover:text-[#FFB800] transition-colors"
            >
              Scan
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavScroll('how-it-works'); }}
              className="text-left py-2 hover:text-[#FFB800] transition-colors"
            >
              How it works
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavScroll('rules-checked'); }}
              className="text-left py-2 hover:text-[#FFB800] transition-colors"
            >
              Rules
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onNavScroll('scoring-explained'); }}
              className="text-left py-2 hover:text-[#FFB800] transition-colors"
            >
              Scoring
            </button>
            <a 
              href="https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2 hover:text-[#F4F6FB] flex items-center gap-2"
            >
              GitHub Repository ↗
            </a>
          </nav>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onScanClick(); }}
              className="w-full py-3 rounded-xl bg-[#FFB800] text-[#0B0F1A] font-bold text-sm text-center shadow-md shadow-[#FFB800]/20"
            >
              Scan a website
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
