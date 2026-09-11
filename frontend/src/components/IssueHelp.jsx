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
        className="fixed inset-0 bg-[#0a1024]/40 backdrop-blur-md z-40 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={help.title}
          className="bg-white border border-gray-100 rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.15)] pointer-events-auto flex flex-col animate-in zoom-in-95 duration-200 relative"
        >
          {/* Subtle glow top left */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] pointer-events-none"></div>

          {/* Header */}
          <div className="bg-white border-b border-gray-100 p-8 flex justify-between items-start shrink-0 relative z-10">
            <div>
              <span className="inline-block bg-blue-50 text-[#0047ff] px-3 py-1 rounded-lg text-xs font-black tracking-widest mb-3 border border-blue-100 shadow-sm">
                {help.wcagLevel || "INFO"}
              </span>
              <h2 className="text-3xl font-black text-[#0a1024] tracking-tight">{help.title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close help"
              className="text-gray-400 hover:text-[#0a1024] bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:bg-gray-50 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8 overflow-y-auto relative z-10 bg-gray-50/30">
            <section>
              <h3 className="text-[13px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span> What Does This Mean?
              </h3>
              <p className="text-[#0a1024] font-medium leading-relaxed text-lg">{help.explanation}</p>
            </section>

            <section className="bg-orange-50 border border-orange-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-[13px] font-black text-orange-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span> Why Is This Important?
              </h3>
              <p className="text-[#4b5563] font-medium leading-relaxed">{help.why}</p>
            </section>

            <section className="bg-green-50 border border-green-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-[13px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span> How to Fix It
              </h3>
              <p className="text-[#4b5563] font-medium leading-relaxed">{help.howToFix}</p>
            </section>

            {help.example && (
              <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">💻</span> Example Code Fix
                  </h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(help.example);
                      const btn = document.getElementById(`copy-btn-${issueId}`);
                      if (btn) btn.innerText = "✓ Copied!";
                      setTimeout(() => { if (btn) btn.innerText = "📋 Copy Code"; }, 2000);
                    }}
                    id={`copy-btn-${issueId}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    📋 Copy Code
                  </button>
                </div>
                <pre className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap word-break font-mono border border-gray-200 shadow-inner">
                  {help.example}
                </pre>
              </section>
            )}

            <section className="bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-[13px] font-black text-[#0047ff] uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Pro Tips
              </h3>
              <ul className="text-[#4b5563] space-y-3 font-medium text-[15px]">
                <li className="flex items-start gap-3"><span className="text-[#0047ff] mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Use browser DevTools (F12) to inspect elements and find exact locations</li>
                <li className="flex items-start gap-3"><span className="text-[#0047ff] mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Test with screen readers like NVDA (Windows) or VoiceOver (Mac)</li>
                <li className="flex items-start gap-3"><span className="text-[#0047ff] mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Use tools like WebAIM contrast checker for color issues</li>
                <li className="flex items-start gap-3"><span className="text-[#0047ff] mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Validate HTML with W3C Validator</li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-100 p-6 flex justify-end shrink-0 relative z-10">
            <button
              onClick={onClose}
              className="bg-[#0a1024] hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
