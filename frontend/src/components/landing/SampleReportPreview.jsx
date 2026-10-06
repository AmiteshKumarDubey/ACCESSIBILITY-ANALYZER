import React, { useState } from 'react';

export default function SampleReportPreview() {
  const [activeTab, setActiveTab] = useState('issues');
  const [showGoodCode, setShowGoodCode] = useState(false);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 border-t border-[var(--border)]">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-mono text-[var(--accent-text)]">
          <span>Report Output</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          What your report includes
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          A preview of the interactive dashboard generated after scanning any URL.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--good)] animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-[var(--text-main)] truncate max-w-xs">
              https://example.com/shop
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-[var(--bg-main)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--accent-text)]">
            Sample report
          </span>
        </div>

        {/* Executive Score Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[var(--warn-text)]">72</div>
            <div className="text-xs font-semibold text-[var(--text-main)]">Accessibility</div>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[var(--good)]">88</div>
            <div className="text-xs font-semibold text-[var(--text-main)]">SEO Score</div>
          </div>
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[var(--warn-text)]">77</div>
            <div className="text-xs font-semibold text-[var(--text-main)]">Overall Score</div>
          </div>
        </div>

        {/* Tab & Code Toggle Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
          <div className="flex gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${activeTab === 'issues' ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Detected Issues (2)
            </button>
            <button
              onClick={() => setActiveTab('heading')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${activeTab === 'heading' ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Heading Outline Tree
            </button>
          </div>

          {activeTab === 'issues' && (
            <button
              onClick={() => setShowGoodCode(!showGoodCode)}
              className="px-3 py-1.5 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] font-mono text-xs font-bold text-[var(--good)] hover:border-[var(--good)] transition-colors cursor-pointer"
            >
              {showGoodCode ? 'View Non-compliant Code' : 'View Recommended Code Fix'}
            </button>
          )}
        </div>

        {/* Tab 1: Issues */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[var(--bad)]">missing-alt (WCAG 1.1.1)</span>
                <span className="px-2 py-0.5 rounded bg-[var(--bad)]/20 text-[var(--bad)] font-bold">Critical</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Image missing descriptive alt attribute in product grid</p>
              <pre className={`p-3 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[var(--good)]/10 border-[var(--good)]/30 text-[var(--good)]' : 'bg-[var(--bad)]/10 border-[var(--bad)]/30 text-[var(--bad)]'}`}>
                {showGoodCode ? `<img src="product.jpg" alt="Wireless noise-canceling headphones in black" />` : `<img src="product.jpg" />`}
              </pre>
            </div>

            <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[var(--warn-text)]">form-missing-label (WCAG 4.1.2)</span>
                <span className="px-2 py-0.5 rounded bg-[var(--warn)]/20 text-[var(--warn-text)] font-bold">Major</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Newsletter email input has no label or aria-label</p>
              <pre className={`p-3 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[var(--good)]/10 border-[var(--good)]/30 text-[var(--good)]' : 'bg-[var(--bad)]/10 border-[var(--bad)]/30 text-[var(--bad)]'}`}>
                {showGoodCode ? `<label for="newsletter-email">Email Address</label>\n<input id="newsletter-email" type="email" />` : `<input type="email" placeholder="Subscribe" />`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Heading Outline */}
        {activeTab === 'heading' && (
          <div className="p-4 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl space-y-2 font-mono text-xs">
            <div className="text-[var(--accent-text)] font-bold">h1: Storefront Main Catalog</div>
            <div className="pl-4 text-[var(--text-muted)]">h2: Featured Audio Gear</div>
            <div className="pl-8 text-[var(--text-muted)]">h3: Noise Canceling Headphones</div>
            <div className="pl-4 text-[var(--text-muted)]">h2: Customer Reviews</div>
          </div>
        )}

      </div>

    </section>
  );
}
