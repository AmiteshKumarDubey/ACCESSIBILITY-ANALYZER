import React, { useState, useRef, useEffect } from "react";

export default function AiChatbot({ currentAudit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm **AccessiBot**, your AI Accessibility & WCAG assistant. How can I help you improve your website accessibility or fix scan issues today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "What is WCAG 2.2 AA compliance?",
    "How do I fix missing image alt text?",
    "How to fix poor color contrast?",
    "Explain screen reader accessibility"
  ];

  // Smart Knowledge Base Engine
  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    if (q.includes("wcag") || q.includes("compliance") || q.includes("standard")) {
      return `### 📜 WCAG 2.2 AA Guidelines Summary

**Web Content Accessibility Guidelines (WCAG)** are structured around 4 core principles (**POUR**):
1. **Perceivable**: Text alternatives for non-text content, subtitles for audio, minimum 4.5:1 color contrast.
2. **Operable**: All functionality accessible via Keyboard, no seizure-inducing flashes, clear navigation.
3. **Understandable**: Readable text, predictable web page operations, input error prevention.
4. **Robust**: Compatible with current & future user tools, including assistive screen readers.

*Tip: Level AA is the global legal standard required by the US ADA, European Accessibility Act (EAA), and international law.*`;
    }

    if (q.includes("alt") || q.includes("image")) {
      return `### 🖼️ Fixing Missing Image Alt Text

All non-decorative \`<img>\` elements **MUST** have an \`alt\` attribute.

**Good Code Example:**
\`\`\`html
<!-- For informative images -->
<img src="logo.png" alt="Company Name Logo" />

<!-- For decorative images (ignored by screen readers) -->
<img src="divider.png" alt="" role="presentation" />
\`\`\`

**Why it matters:** Screen reader users rely on alt text to understand visual content.`;
    }

    if (q.includes("contrast") || q.includes("color")) {
      return `### 🎨 Color Contrast Remediation

Under **WCAG 2.2 AA**:
- **Normal text** must have a contrast ratio of at least **4.5:1** against its background.
- **Large text** (18pt+ or 14pt bold) requires at least **3.0:1**.

**CSS Code Fix:**
\`\`\`css
/* Bad: Low contrast */
.text-element { color: #888888; background-color: #ffffff; } /* Ratio: 3.5:1 ❌ */

/* Good: High contrast */
.text-element { color: #333333; background-color: #ffffff; } /* Ratio: 12.6:1 ✅ */
\`\`\``;
    }

    if (q.includes("screen reader") || q.includes("aria") || q.includes("keyboard")) {
      return `### ⌨️ Screen Reader & Keyboard Accessibility

Key elements for screen reader compatibility:
1. **Focusable Elements**: Use semantic tags (\`<button>\`, \`<a>\`, \`<input>\`) instead of \`<div onClick>\`.
2. **Visible Focus Rings**: Never use \`outline: none\` without providing a distinct focus style.
3. **ARIA Labels**: Use \`aria-label\` or \`aria-labelledby\` when an icon has no visible text.

\`\`\`html
<!-- Good Icon Button -->
<button aria-label="Close modal">
  <svg>...</svg>
</button>
\`\`\``;
    }

    if (q.includes("h1") || q.includes("heading")) {
      return `### 🏷️ Heading Hierarchy Fix

Each page should contain **exactly one \`<h1>\` heading** to establish the primary page topic. Headings must follow a logical nested order (\`<h1>\` → \`<h2>\` → \`<h3>\`).

\`\`\`html
<h1>Main Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection Title</h3>
</section>
\`\`\``;
    }

    if (q.includes("audit") || q.includes("scan") || q.includes("score") || q.includes("result")) {
      if (currentAudit) {
        const criticalCount = (currentAudit.wcag?.breakdown?.critical || 0) + (currentAudit.seo?.breakdown?.critical || 0);
        return `### 📊 Scan Insights for ${currentAudit.url || 'your website'}

- **Overall Score**: ${currentAudit.overall?.score || 80}/100
- **Accessibility Score**: ${currentAudit.wcag?.score || 80}/100
- **SEO Score**: ${currentAudit.seo?.score || 80}/100
- **Critical Issues Found**: ${criticalCount}

*Action Plan:* Focus on resolving critical issues first, such as missing alt text or missing page titles, as these carry the highest legal risk!`;
      }
      return `To analyze your website, enter your URL in the input scanner on the home page and click **"Test"**. AccessiAnalyzer will perform an instant WCAG 2.2 scan!`;
    }

    return `I can help you audit and fix accessibility issues! You can ask me about:
- **WCAG 2.2 AA Guidelines & ADA compliance**
- **How to fix color contrast or font readability**
- **Adding ARIA attributes and screen reader support**
- **HTML structure & heading hierarchy**
- **Explaining audit scan results**

What specific accessibility topic or issue would you like assistance with?`;
  };

  const handleSend = (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    const userMsg = {
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateBotReply(messageText);
      const botMsg = {
        sender: "bot",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-[#0047ff] hover:bg-[#0038cc] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(0,71,255,0.4)] transition-all duration-300 hover:scale-105 flex items-center gap-3 pr-6"
          aria-label="Open AccessiBot AI Chatbot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl">
            🤖
          </div>
          <span className="font-bold text-sm tracking-wide">AccessiBot AI</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-gray-100 w-[380px] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#0a1024] text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0047ff] flex items-center justify-center text-xl shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  AccessiBot AI
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Online
                  </span>
                </h3>
                <p className="text-gray-400 text-xs">Accessibility & WCAG Specialist</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#0047ff] text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#0047ff] text-white rounded-br-none shadow-md shadow-blue-500/10"
                      : "bg-white text-[#0a1024] border border-gray-100 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="prose prose-sm max-w-none break-words space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('```')) {
                        const codeContent = paragraph.replace(/```[a-z]*/g, '').trim();
                        return (
                          <pre key={pIdx} className="bg-gray-900 text-gray-100 p-3 rounded-xl text-xs overflow-x-auto font-mono my-2">
                            <code>{codeContent}</code>
                          </pre>
                        );
                      }
                      return (
                        <p key={pIdx} className="m-0 font-medium">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                  <span className={`block text-[10px] mt-2 font-semibold ${msg.sender === "user" ? "text-blue-100 text-right" : "text-gray-400"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-gray-400 text-xs">
                <div className="w-7 h-7 rounded-full bg-[#0047ff] text-white flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-xs bg-white hover:bg-blue-50 hover:text-[#0047ff] hover:border-blue-200 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask AccessiBot about WCAG or code fixes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#0047ff] focus:bg-white text-sm px-4 py-3 rounded-2xl outline-none font-medium text-[#0a1024] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#0047ff] hover:bg-[#0038cc] disabled:bg-gray-200 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-colors shrink-0 shadow-md shadow-blue-500/20 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
