import React from 'react';

export default function SuggestionCard({ s }) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="w-10 h-10 bg-[var(--accent)]/10 text-[var(--accent-text)] rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm border border-[var(--accent)]/30">
          💡
        </div>
        <h3 className="font-extrabold text-base text-[var(--text-main)] leading-snug mt-1">
          {s.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 font-medium relative z-10">
        {s.text}
      </p>

      <div className="grow"></div>

      {/* References/Tags */}
      {s.references && s.references.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)] relative z-10">
          {s.references.map((ref, i) => (
            <span
              key={i}
              className="bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border)] text-[11px] px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider"
            >
              {ref}
            </span>
          ))}
        </div>
      )}

      {/* Source Badge */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] relative z-10">
        {s.source === 'ai' ? (
          <div className="flex items-center gap-2 text-xs text-[var(--accent-text)] font-bold bg-[var(--accent)]/10 border border-[var(--accent)]/30 w-max px-3 py-1.5 rounded-lg">
            <span>✨</span> AI GENERATED
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-bold bg-[var(--bg-main)] border border-[var(--border)] w-max px-3 py-1.5 rounded-lg">
            <span>⚙️</span> AUTOMATED RULE
          </div>
        )}
      </div>
    </div>
  );
}
