import React, { useState, useEffect, useRef } from 'react';

export default function AiAssistantDrawer({ isOpen, onClose, reportData, initialQuestion = '' }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Accessibility & SEO AI assistant. How can I help you improve this report?'
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialQuestion) {
      setInputQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ai-status')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.aiAvailable === 'boolean') {
            setAiAvailable(data.aiAvailable);
          }
        })
        .catch(() => setAiAvailable(true));
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (questionToSend) => {
    const q = questionToSend || inputQuestion;
    if (!q || !q.trim() || loading) return;

    const userMsg = { sender: 'user', text: q.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    const topIssues = [
      ...(reportData?.wcag?.issues || []),
      ...(reportData?.seo?.issues || [])
    ].map(i => ({
      id: i.id || i.type,
      severity: i.severity || 'warning',
      message: i.message || i.description || ''
    }));

    const reportSummary = {
      url: reportData?.url,
      overallScore: reportData?.overall?.score,
      wcagScore: reportData?.wcag?.score,
      seoScore: reportData?.seo?.score,
      topIssues
    };

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.trim(), reportSummary })
      });
      const data = await res.json();

      if (!data.available) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.error || 'AI Assistant is currently unavailable on the server.'
          }
        ]);
        setAiAvailable(false);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: data.answer }]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Network error contacting AI Assistant service. Please try again later.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const quickPrompts = [
    'What should I fix first?',
    'Explain my top issue',
    'Give me a code fix'
  ];

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-2xl flex flex-col transition-all duration-300"
      role="dialog"
      aria-label="AI Accessibility Assistant"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent-text)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          <div>
            <h3 className="font-bold text-base text-[var(--text-main)]">
              AI Assistant
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              Report Specialist
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] focus:ring-2 focus:ring-[var(--focus)] focus:outline-none"
          aria-label="Close AI Assistant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!aiAvailable && (
        <div className="p-3 bg-[var(--warn)]/10 border-b border-[var(--border)] text-xs text-[var(--warn-text)] flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>OPENAI_API_KEY is not configured. AI assistant features are currently disabled.</span>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-[var(--accent)] text-[var(--on-accent)] font-medium rounded-br-none'
                  : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-main)] rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              {msg.sender === 'ai' && (
                <div className="pt-2 border-t border-[var(--border)]/40 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                  <span>AI-generated, please verify</span>
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="hover:text-[var(--text-main)] flex items-center gap-1 font-mono"
                    title="Copy AI Response"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedIdx === idx ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--bg-elevated)] text-xs text-[var(--text-muted)] w-fit animate-pulse">
            <svg className="w-4 h-4 animate-spin text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span>Analyzing report context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-[var(--bg-elevated)] border-t border-[var(--border)] flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            disabled={loading || !aiAvailable}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-text)] hover:border-[var(--accent)]/50 transition-all disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-[var(--border)] bg-[var(--bg-surface)] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={aiAvailable ? "Ask AI about this report..." : "AI unavailable (Key required)"}
          disabled={loading || !aiAvailable}
          className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim() || !aiAvailable}
          className="px-3.5 py-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
        >
          Send
        </button>
      </form>
    </div>
  );
}
