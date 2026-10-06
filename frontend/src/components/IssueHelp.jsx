import React from 'react';
import { createPortal } from 'react-dom';
import { getIssueHelp } from '../utils/issueExplainer';

export default function IssueHelp({ issueId, onClose }) {
  const help = getIssueHelp(issueId);

  if (typeof document === 'undefined') return null;

  const modal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={help.title}
          className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col animate-in zoom-in-95 duration-200 relative text-[var(--text-main)]"
        >
          {/* Header */}
          <div className="bg-[var(--bg-surface)] border-b border-[var(--border)] p-6 sm:p-8 flex justify-between items-start shrink-0 relative z-10">
            <div>
              <span className="inline-block bg-[var(--accent)]/10 text-[var(--accent-text)] px-3 py-1 rounded-lg text-xs font-black tracking-widest mb-3 border border-[var(--accent)]/30 shadow-sm">
                {help.wcagLevel || "INFO"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight">{help.title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close help"
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-main)] border border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto relative z-10 bg-[var(--bg-main)]">
            <section>
              <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>📝</span> What Does This Mean?
              </h3>
              <p className="text-[var(--text-main)] font-medium leading-relaxed text-base sm:text-lg">{help.explanation}</p>
            </section>

            <section className="bg-[var(--warn)]/10 border border-[var(--warn)]/30 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-[var(--warn-text)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>⚠️</span> Why Is This Important?
              </h3>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed text-sm">{help.why}</p>
            </section>

            <section className="bg-[var(--good)]/10 border border-[var(--good)]/30 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-[var(--good)] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>✅</span> How to Fix It
              </h3>
              <p className="text-[var(--text-muted)] font-medium leading-relaxed text-sm">{help.howToFix}</p>
            </section>

            {help.example && (
              <section className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border)] shadow-sm relative group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <span>💻</span> Example Code Fix
                  </h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(help.example);
                      const btn = document.getElementById(`copy-btn-${issueId}`);
                      if (btn) btn.innerText = "✓ Copied!";
                      setTimeout(() => { if (btn) btn.innerText = "📋 Copy Code"; }, 2000);
                    }}
                    id={`copy-btn-${issueId}`}
                    className="bg-[var(--bg-main)] hover:bg-[var(--bg-elevated)] text-[var(--text-main)] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border border-[var(--border)] cursor-pointer"
                  >
                    📋 Copy Code
                  </button>
                </div>
                <pre className="bg-[var(--bg-main)] p-4 rounded-xl text-xs text-[var(--text-main)] overflow-x-auto whitespace-pre-wrap font-mono border border-[var(--border)]">
                  {help.example}
                </pre>
              </section>
            )}

            <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-black text-[var(--accent-text)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>💡</span> Pro Tips
              </h3>
              <ul className="text-[var(--text-muted)] space-y-2.5 font-medium text-xs sm:text-sm">
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent-text)] mt-0.5">✓</span> Use browser DevTools (F12) to inspect elements and find exact locations</li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent-text)] mt-0.5">✓</span> Test with screen readers like NVDA (Windows) or VoiceOver (Mac)</li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent-text)] mt-0.5">✓</span> Use tools like WebAIM contrast checker for color issues</li>
                <li className="flex items-start gap-2.5"><span className="text-[var(--accent-text)] mt-0.5">✓</span> Validate HTML with W3C Validator</li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-[var(--bg-surface)] border-t border-[var(--border)] p-5 flex justify-end shrink-0 relative z-10">
            <button
              onClick={onClose}
              className="bg-[var(--accent)] text-[var(--on-accent)] hover:opacity-90 px-8 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
