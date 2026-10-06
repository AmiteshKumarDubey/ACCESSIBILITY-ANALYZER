import { useState } from 'react';
import IssueHelp from './IssueHelp';

export default function IssueCard({ issue, onExplainWithAi }) {
  const [showHelp, setShowHelp] = useState(false);
  
  const getSeverity = (id) => {
    const idLower = (id || "").toLowerCase();
    if (
      idLower.includes("missing-alt") ||
      idLower.includes("missing-lang") ||
      idLower.includes("missing-title") ||
      idLower.includes("noindex") ||
      idLower.includes("missing-viewport")
    ) {
      return "critical";
    }
    if (
      idLower.includes("h1") ||
      idLower.includes("meta-desc") ||
      idLower.includes("canonical") ||
      idLower.includes("og-tags")
    ) {
      return "major";
    }
    return "minor";
  };

  const severity = getSeverity(issue.id);
  const severityConfig = {
    critical: {
      topBorder: "border-t-[var(--bad)]",
      badge: "bg-[var(--bad)]/10 text-[var(--bad)] border border-[var(--bad)]/30",
      iconSvg: (
        <svg className="w-4 h-4 text-[var(--bad)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2.5" />
          <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      label: "Critical"
    },
    major: {
      topBorder: "border-t-[var(--warn)]",
      badge: "bg-[var(--warn)]/10 text-[var(--warn-text)] border border-[var(--warn)]/30",
      iconSvg: (
        <svg className="w-4 h-4 text-[var(--warn-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      label: "Major"
    },
    minor: {
      topBorder: "border-t-[var(--good)]",
      badge: "bg-[var(--good)]/10 text-[var(--good)] border border-[var(--good)]/30",
      iconSvg: (
        <svg className="w-4 h-4 text-[var(--good)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2.5" />
          <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      label: "Minor"
    }
  };

  const config = severityConfig[severity];

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border)] border-t-4 ${config.topBorder} p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center shrink-0">
            {config.iconSvg}
          </div>
          <h3 className="font-extrabold text-base text-[var(--text-main)] leading-tight word-break line-clamp-2">
            {issue.id?.replace(/-/g, " ").toUpperCase()}
          </h3>
        </div>
      </div>

      {/* Badge with icon + text + color */}
      <div className="mb-5">
        <span className={`${config.badge} px-3 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5`}>
          {config.iconSvg}
          <span>{config.label} Issue</span>
        </span>
      </div>

      {/* Description */}
      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5 font-medium">{issue.desc}</p>

      {/* Location */}
      {issue.location && (
        <div className="mb-4 p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl">
          <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-widest mb-1.5 uppercase flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Location
          </p>
          <p className="text-[var(--text-main)] font-mono break-all text-[12px] line-clamp-1 font-semibold">{issue.location}</p>
        </div>
      )}

      {/* Code Snippet */}
      {issue.snippet && (
        <div className="mb-4 p-3 bg-[var(--bg-main)] border border-[var(--border)] rounded-xl overflow-hidden">
          <p className="text-[var(--text-muted)] text-[11px] font-bold tracking-widest mb-1.5 uppercase flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Snippet
          </p>
          <pre className="bg-[var(--bg-surface)] p-3 rounded-lg text-xs text-[var(--text-main)] overflow-auto max-h-24 border border-[var(--border)] font-mono">
            {issue.snippet.slice(0, 150)}
          </pre>
        </div>
      )}

      <div className="grow"></div>

      {/* Footer */}
      <div className="mt-4 pt-5 border-t border-[var(--border)] flex items-center justify-between gap-2">
        {onExplainWithAi && (
          <button
            onClick={() => onExplainWithAi(issue)}
            className="text-[var(--accent-text)] bg-[var(--bg-main)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-[var(--focus)] focus:outline-none"
            title="Ask AI Assistant about this issue"
          >
            <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Explain with AI</span>
          </button>
        )}
        <button
          onClick={() => setShowHelp(true)}
          className="text-[var(--on-accent)] bg-[var(--accent)] hover:opacity-90 shadow-md px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-[var(--focus)] focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Learn More
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && <IssueHelp issueId={issue.id} onClose={() => setShowHelp(false)} />}
    </div>
  );
}
