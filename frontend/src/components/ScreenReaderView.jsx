import React, { useState } from 'react';

export default function ScreenReaderView({ items = [] }) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'problems'
  const [searchQuery, setSearchQuery] = useState('');

  const problemsCount = items.filter(i => i.status === 'problem').length;

  const filteredItems = items.filter(item => {
    if (filterMode === 'problems' && item.status !== 'problem') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const textMatch = item.text && item.text.toLowerCase().includes(q);
      const reasonMatch = item.reason && item.reason.toLowerCase().includes(q);
      const tagMatch = item.tag && item.tag.toLowerCase().includes(q);
      return textMatch || reasonMatch || tagMatch;
    }
    return true;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'landmark':
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'heading':
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'button':
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-start gap-3">
        <span className="p-2 rounded-lg bg-[var(--accent)]/10 text-[var(--accent-text)] shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-semibold text-[var(--text-main)]">
            Screen Reader Simulation Transcript
          </h4>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Approximation of how a screen reader may read the page structure, not a replacement for testing with actual screen readers (NVDA, VoiceOver, JAWS).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Toggle Pills */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] w-fit">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-[var(--accent)] text-[var(--on-accent)] font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            All Announcements ({items.length})
          </button>

          <button
            onClick={() => setFilterMode('problems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              filterMode === 'problems'
                ? 'bg-[var(--bad)] text-white font-semibold shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--bad)]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Problems Only ({problemsCount})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-full px-3 py-1.5 pl-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
          />
          <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Announcements Transcript List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-2">
          <p className="text-sm text-[var(--text-muted)]">No screen reader announcements match your current filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-4 rounded-xl bg-[var(--bg-surface)] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.status === 'problem'
                  ? 'border-[var(--bad)]/50 bg-[var(--bad)]/5'
                  : 'border-[var(--border)] hover:border-[var(--accent)]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] shrink-0 mt-0.5">
                  {getTypeIcon(item.type)}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] uppercase">
                      {item.tag || item.type}
                    </span>
                    <h5 className="text-xs sm:text-sm font-medium text-[var(--text-main)]">
                      {item.text}
                    </h5>
                  </div>

                  {item.href && (
                    <p className="text-[11px] font-mono text-[var(--text-muted)]">
                      Destination: {item.href}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex items-center gap-2">
                {item.status === 'problem' ? (
                  <div className="px-2.5 py-1 rounded-lg bg-[var(--bad)]/15 border border-[var(--bad)]/30 text-[var(--bad)] text-xs font-semibold flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.reason || 'Accessibility Concern'}</span>
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-lg bg-[var(--good)]/15 border border-[var(--good)]/30 text-[var(--good)] text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Announced OK</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
