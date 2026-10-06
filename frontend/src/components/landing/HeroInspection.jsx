import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function HeroInspection({ onSubmitScan, loading, errorMsg }) {
  const [urlInput, setUrlInput] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [activePin, setActivePin] = useState(null);

  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef(null);

  const exampleUrls = [
    'https://example.com',
    'https://www.w3.org',
    'https://developer.mozilla.org',
    'https://react.dev'
  ];

  // Typing animation for placeholder
  useEffect(() => {
    let urlIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId = null;

    function typeLoop() {
      const targetUrl = exampleUrls[urlIdx];
      if (isDeleting) {
        setPlaceholderText(targetUrl.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setPlaceholderText(targetUrl.substring(0, charIdx + 1));
        charIdx++;
      }

      if (!isDeleting && charIdx === targetUrl.length) {
        timeoutId = setTimeout(() => { isDeleting = true; typeLoop(); }, 1800);
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        urlIdx = (urlIdx + 1) % exampleUrls.length;
        timeoutId = setTimeout(typeLoop, 500);
      } else {
        timeoutId = setTimeout(typeLoop, isDeleting ? 40 : 80);
      }
    }

    typeLoop();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    setInlineError('');

    let trimmed = urlInput.trim();
    if (!trimmed) {
      setInlineError('Please enter a website URL.');
      return;
    }

    // Auto-prefix https:// if protocol is missing
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = `https://${trimmed}`;
      setUrlInput(trimmed);
    }

    // Validate URL format
    try {
      new URL(trimmed);
    } catch (_) {
      setInlineError('Please enter a valid URL (e.g. https://example.com)');
      return;
    }

    onSubmitScan(trimmed);
  };

  const handleChipClick = (targetUrl) => {
    setUrlInput(targetUrl);
    setInlineError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const pins = [
    { id: 1, title: 'Missing Alt Text', criterion: 'WCAG 1.1.1', top: '22%', left: '18%', severity: 'Coral (#FF5C5C)' },
    { id: 2, title: 'Low Color Contrast', criterion: 'WCAG 1.4.3', top: '48%', left: '68%', severity: 'Coral (#FF5C5C)' },
    { id: 3, title: 'Unlabeled Form Input', criterion: 'WCAG 4.1.2', top: '72%', left: '32%', severity: 'Amber (#FFB800)' },
    { id: 4, title: 'Skipped Heading Level', criterion: 'WCAG 1.3.1', top: '35%', left: '45%', severity: 'Amber (#FFB800)' }
  ];

  return (
    <section id="hero-scan" className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Grid background texture */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 bg-[radial-gradient(#FFB800_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Main Headline & Subhead */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]"></span>
          <span>DOM Inspection Engine • WCAG 2.2 AA</span>
        </div>

        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F4F6FB] tracking-tight leading-[1.08]">
          See your website the way a <span className="text-[#FFB800] underline decoration-[#FFB800]/40 decoration-wavy underline-offset-8">screen reader</span> does.
        </h1>

        <p className="text-base sm:text-lg text-[#9AA4BF] font-medium max-w-2xl mx-auto leading-relaxed">
          Scan any public web page for WCAG 2.2 and SEO issues. Get scores, plain-English fix suggestions, and a report you can export.
        </p>
      </div>

      {/* Hero Scanner Form */}
      <div className="max-w-2xl mx-auto space-y-4">
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div className="relative flex flex-col sm:flex-row gap-2 bg-[#121829] p-2 sm:p-2.5 rounded-2xl border-2 border-[#1A233A] focus-within:border-[#FFB800] shadow-xl shadow-black/40 transition-all">
            <div className="flex-1 flex items-center px-3 gap-3">
              <span className="font-mono text-sm text-[#9AA4BF] select-none">🌐</span>
              <label htmlFor="hero-url-input" className="sr-only">Enter website URL to scan</label>
              <input
                ref={inputRef}
                id="hero-url-input"
                type="text"
                value={urlInput}
                placeholder={placeholderText ? `e.g. ${placeholderText}` : 'https://example.com'}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (inlineError) setInlineError('');
                }}
                className="w-full bg-transparent border-none text-[#F4F6FB] placeholder-[#9AA4BF]/50 text-sm sm:text-base font-mono font-medium outline-none py-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA800] text-[#0B0F1A] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base transition-all shadow-md shadow-[#FFB800]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-sm">
                  <svg className="animate-spin h-5 w-5 text-[#0B0F1A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Scanning...
                </span>
              ) : (
                <>
                  <span>Scan</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>

          {(inlineError || errorMsg) && (
            <div className="p-3 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-xl text-xs font-mono text-[#FF5C5C] font-semibold flex items-center gap-2" role="alert">
              <span>⚠️</span> {inlineError || errorMsg}
            </div>
          )}
        </form>

        {/* Try an Example Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="text-[#9AA4BF]">Try an example:</span>
          {exampleUrls.slice(0, 3).map((url, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(url)}
              className="px-2.5 py-1 rounded-lg bg-[#121829] border border-[#1A233A] text-[#F4F6FB] hover:border-[#FFB800] hover:text-[#FFB800] transition-colors"
            >
              {url.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Page Under Inspection Illustration */}
      <div className="pt-6 max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#9AA4BF] px-2">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFB800]"></span>
            Page Under Inspection Visualizer
          </span>
          <span className="px-2 py-0.5 rounded bg-[#121829] border border-[#1A233A] text-[10px]">
            Illustration
          </span>
        </div>

        {/* Mock Web Page Div Frame */}
        <div className="relative bg-[#121829] border border-[#1A233A] rounded-2xl p-6 sm:p-8 min-h-[340px] overflow-hidden shadow-2xl space-y-6">
          
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between border-b border-[#1A233A] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5C5C]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFB800]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#2DD4BF]/80"></div>
            </div>
            <div className="font-mono text-xs text-[#9AA4BF]/60 bg-[#0B0F1A] px-4 py-1 rounded-md border border-[#1A233A] max-w-xs truncate">
              https://target-site-inspection.internal
            </div>
            <div className="w-12"></div>
          </div>

          {/* Mock Page Content Wireframe */}
          <div className="space-y-6 opacity-75">
            <div className="h-6 w-1/3 bg-[#1A233A] rounded-md"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-[#1A233A] rounded-xl flex items-center justify-center text-xs font-mono text-[#9AA4BF]">
                [Image Node]
              </div>
              <div className="col-span-2 space-y-2">
                <div className="h-4 w-5/6 bg-[#1A233A] rounded"></div>
                <div className="h-4 w-4/6 bg-[#1A233A] rounded"></div>
                <div className="h-4 w-2/6 bg-[#1A233A] rounded"></div>
              </div>
            </div>
            <div className="h-10 w-full bg-[#1A233A] rounded-xl"></div>
          </div>

          {/* Repeated Amber Scan Beam Sweep */}
          {!shouldReduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent shadow-[0_0_15px_#FFB800] pointer-events-none"
              animate={{ top: ['5%', '90%', '5%'] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Interactive Issue Pins */}
          {pins.map((pin) => (
            <div
              key={pin.id}
              style={{ top: pin.top, left: pin.left }}
              className="absolute z-20 group"
            >
              <button
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
                onFocus={() => setActivePin(pin.id)}
                onBlur={() => setActivePin(null)}
                aria-label={`Issue pin: ${pin.title} (${pin.criterion})`}
                className="w-7 h-7 rounded-full bg-[#FF5C5C] text-white font-mono font-bold text-xs flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#FFB800] cursor-pointer"
              >
                !
              </button>

              {/* Pin Tooltip */}
              {activePin === pin.id && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 bg-[#0B0F1A] border border-[#FFB800]/50 p-3 rounded-xl shadow-2xl text-xs space-y-1 animate-in fade-in duration-150 z-30 pointer-events-none">
                  <div className="font-mono font-bold text-[#FFB800]">{pin.title}</div>
                  <div className="font-mono text-[10px] text-[#2DD4BF] font-semibold">{pin.criterion}</div>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

    </section>
  );
}
