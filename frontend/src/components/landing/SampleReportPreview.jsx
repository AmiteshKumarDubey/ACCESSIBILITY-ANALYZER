import React, { useState } from 'react';

export default function SampleReportPreview() {
  const [activeTab, setActiveTab] = useState('issues');
  const [showGoodCode, setShowGoodCode] = useState(false);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Report Output</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          What your report includes
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          A preview of the interactive dashboard generated after scanning any URL.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-[#121829] border border-[#1A233A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[#1A233A] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-[#F4F6FB] truncate max-w-xs">
              https://example.com/shop
            </span>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#0B0F1A] border border-[#1A233A] text-[11px] font-mono font-bold text-[#FFB800]">
            Sample report
          </span>
        </div>

        {/* Executive Score Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[#FF5C5C]">72</div>
            <div className="text-xs font-semibold text-[#F4F6FB]">Accessibility</div>
          </div>
          <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[#2DD4BF]">88</div>
            <div className="text-xs font-semibold text-[#F4F6FB]">SEO Score</div>
          </div>
          <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-1">
            <div className="font-mono text-3xl font-bold text-[#FFB800]">77</div>
            <div className="text-xs font-semibold text-[#F4F6FB]">Overall Score</div>
          </div>
        </div>

        {/* Tab & Code Toggle Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1A233A] pb-3">
          <div className="flex gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'issues' ? 'bg-[#FFB800] text-[#0B0F1A]' : 'text-[#9AA4BF] hover:text-[#F4F6FB]'}`}
            >
              Detected Issues (2)
            </button>
            <button
              onClick={() => setActiveTab('heading')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${activeTab === 'heading' ? 'bg-[#FFB800] text-[#0B0F1A]' : 'text-[#9AA4BF] hover:text-[#F4F6FB]'}`}
            >
              Heading Outline Tree
            </button>
          </div>

          {activeTab === 'issues' && (
            <button
              onClick={() => setShowGoodCode(!showGoodCode)}
              className="px-3 py-1.5 rounded-lg bg-[#0B0F1A] border border-[#1A233A] font-mono text-xs font-bold text-[#2DD4BF] hover:border-[#2DD4BF] transition-colors"
            >
              {showGoodCode ? 'View Non-compliant Code' : 'View Recommended Code Fix'}
            </button>
          )}
        </div>

        {/* Tab 1: Issues */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#FF5C5C]">missing-alt (WCAG 1.1.1)</span>
                <span className="px-2 py-0.5 rounded bg-[#FF5C5C]/20 text-[#FF5C5C] font-bold">Critical</span>
              </div>
              <p className="text-xs text-[#9AA4BF] font-medium">Image missing descriptive alt attribute in product grid</p>
              <pre className={`p-3 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#2DD4BF]' : 'bg-[#FF5C5C]/10 border-[#FF5C5C]/30 text-[#FF5C5C]'}`}>
                {showGoodCode ? `<img src="product.jpg" alt="Wireless noise-canceling headphones in black" />` : `<img src="product.jpg" />`}
              </pre>
            </div>

            <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#FFB800]">form-missing-label (WCAG 4.1.2)</span>
                <span className="px-2 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] font-bold">Major</span>
              </div>
              <p className="text-xs text-[#9AA4BF] font-medium">Newsletter email input has no label or aria-label</p>
              <pre className={`p-3 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#2DD4BF]' : 'bg-[#FF5C5C]/10 border-[#FF5C5C]/30 text-[#FF5C5C]'}`}>
                {showGoodCode ? `<label for="newsletter-email">Email Address</label>\n<input id="newsletter-email" type="email" />` : `<input type="email" placeholder="Subscribe" />`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Heading Outline */}
        {activeTab === 'heading' && (
          <div className="p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl space-y-2 font-mono text-xs">
            <div className="text-[#FFB800] font-bold">h1: Storefront Main Catalog</div>
            <div className="pl-4 text-[#9AA4BF]">h2: Featured Audio Gear</div>
            <div className="pl-8 text-[#9AA4BF]">h3: Noise Canceling Headphones</div>
            <div className="pl-4 text-[#9AA4BF]">h2: Customer Reviews</div>
          </div>
        )}

      </div>

    </section>
  );
}
