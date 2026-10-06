import React, { useState } from 'react';

export default function RuleExplorer() {
  const [activeCategory, setActiveCategory] = useState('Images');
  const [showGoodCode, setShowGoodCode] = useState(true);

  const categories = [
    {
      name: 'Images',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
      rules: [
        {
          id: 'missing-alt',
          criterion: 'WCAG 1.1.1',
          name: 'Non-text Content (Alt Text)',
          why: 'Screen readers read alt text aloud to visually impaired users. Without alt text, screen readers announce generic filenames like "image123.jpg".',
          badCode: `<img src="hero-banner.png" />`,
          goodCode: `<img src="hero-banner.png" alt="Developer team inspecting accessibility audit report" />`
        },
        {
          id: 'decorative-image-alt',
          criterion: 'WCAG 1.1.1',
          name: 'Decorative Image Alt Handling',
          why: 'Decorative images should use an empty alt="" attribute so screen readers cleanly skip them.',
          badCode: `<img src="decorative-divider.png" alt="divider line" />`,
          goodCode: `<img src="decorative-divider.png" alt="" role="presentation" />`
        }
      ]
    },
    {
      name: 'Headings',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>,
      rules: [
        {
          id: 'missing-h1',
          criterion: 'WCAG 1.3.1',
          name: 'Page H1 Heading Structure',
          why: 'A single top-level <h1> heading establishes the main topic for screen reader navigation and SEO crawlers.',
          badCode: `<main>\n  <h2>Welcome to our app</h2>\n</main>`,
          goodCode: `<main>\n  <h1>Accessibility Analyzer</h1>\n  <h2>WCAG Inspection Dashboard</h2>\n</main>`
        },
        {
          id: 'heading-hierarchy',
          criterion: 'WCAG 1.3.1',
          name: 'Sequential Heading Levels',
          why: 'Skipping heading levels (e.g. h1 -> h3) confuses users who jump between document sections using screen reader heading shortcuts.',
          badCode: `<h1>Page Title</h1>\n<h3>Section Subtitle</h3> <!-- Skipped H2 ❌ -->`,
          goodCode: `<h1>Page Title</h1>\n<h2>Section Title</h2>\n<h3>Section Subtitle</h3> <!-- Sequential ✅ -->`
        }
      ]
    },
    {
      name: 'Links and buttons',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>,
      rules: [
        {
          id: 'link-empty-text',
          criterion: 'WCAG 2.4.4',
          name: 'Link Purpose (In Context)',
          why: 'Links with generic text like "click here" or empty icon-only links provide no context when screen readers list links on a page.',
          badCode: `<a href="/download"><svg>...</svg></a>`,
          goodCode: `<a href="/download" aria-label="Download WCAG audit PDF report"><svg>...</svg></a>`
        }
      ]
    },
    {
      name: 'Forms',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
      rules: [
        {
          id: 'form-missing-label',
          criterion: 'WCAG 4.1.2',
          name: 'Input Control Labels',
          why: 'Form inputs require explicit <label for="..."> or aria-label attributes so assistive technology announces input purpose on focus.',
          badCode: `<input type="email" id="user-email" placeholder="Enter email" />`,
          goodCode: `<label for="user-email">Work Email</label>\n<input type="email" id="user-email" name="email" />`
        }
      ]
    },
    {
      name: 'Keyboard and focus',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>,
      rules: [
        {
          id: 'focus-not-visible',
          criterion: 'WCAG 2.4.7',
          name: 'Visible Focus Ring',
          why: 'Keyboard users rely on Tab key focus indicators to see which element is currently active.',
          badCode: `button:focus {\n  outline: none; /* Removes focus indicator ❌ */\n}`,
          goodCode: `button:focus-visible {\n  outline: 3px solid #FFB800;\n  outline-offset: 2px;\n}`
        },
        {
          id: 'missing-skip-link',
          criterion: 'WCAG 2.4.1',
          name: 'Bypass Blocks (Skip Link)',
          why: 'Skip links allow keyboard users to skip repetitive header navigation links and jump directly to main content.',
          badCode: `<body>\n  <header><nav>...</nav></header>`,
          goodCode: `<body>\n  <a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>\n  <header><nav>...</nav></header>`
        }
      ]
    },
    {
      name: 'Color and contrast',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 000 20v-20z"/></svg>,
      rules: [
        {
          id: 'color-contrast-low',
          criterion: 'WCAG 1.4.3',
          name: 'Minimum Color Contrast Ratio',
          why: 'Normal text requires at least 4.5:1 contrast against its background so users with low vision or color blindness can read text.',
          badCode: `.muted-text {\n  color: #71717A;\n  background-color: #0B0F1A; /* Low contrast ratio ❌ */\n}`,
          goodCode: `.muted-text {\n  color: #F4F6FB;\n  background-color: #0B0F1A; /* High contrast ratio ✅ */\n}`
        }
      ]
    },
    {
      name: 'Meta and SEO',
      iconSvg: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
      rules: [
        {
          id: 'missing-meta-desc',
          criterion: 'SEO Snippet',
          name: 'Page Meta Description',
          why: 'Meta descriptions serve as search engine result previews and improve click-through rates.',
          badCode: `<head>\n  <title>My Website</title>\n</head>`,
          goodCode: `<head>\n  <title>My Website</title>\n  <meta name="description" content="Automated WCAG 2.2 AA accessibility and SEO inspection tool." />\n</head>`
        },
        {
          id: 'missing-canonical',
          criterion: 'SEO Duplicate',
          name: 'Canonical Tag Declaration',
          why: 'Canonical link tags prevent search engines from penalizing duplicate URLs or URL parameters.',
          badCode: `<head>\n  <title>Home</title>\n</head>`,
          goodCode: `<head>\n  <link rel="canonical" href="https://example.com/" />\n</head>`
        }
      ]
    }
  ];

  const currentCategoryObj = categories.find(c => c.name === activeCategory) || categories[0];

  return (
    <section id="rules-checked" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Section Header with <= 2 pill labels */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--accent-amber)]">
          <span>Rule Explorer</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[var(--text-main)] tracking-tight">
          What we check
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium">
          Explore real WCAG 2.2 AA criteria and SEO rules inspected by our DOM engine.
        </p>
      </div>

      {/* Accessible Category Tabs with hidden scrollbar */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[var(--border-color)] max-w-5xl mx-auto"
        role="tablist"
        aria-label="Inspection categories"
      >
        {categories.map((cat, idx) => {
          const isActive = cat.name === activeCategory;
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={isActive}
              aria-controls={`category-panel-${cat.name}`}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent-amber)] ${isActive ? 'bg-[var(--accent-amber)] text-black shadow-md' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'}`}
            >
              <span>{cat.iconSvg}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Rules Panel */}
      <div 
        id={`category-panel-${currentCategoryObj.name}`}
        role="tabpanel"
        className="max-w-5xl mx-auto bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]">
              {currentCategoryObj.iconSvg}
            </span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[var(--text-main)]">
                {currentCategoryObj.name} Category Rules
              </h3>
              <p className="font-mono text-xs text-[var(--text-muted)]">
                {currentCategoryObj.rules.length} inspection rule{currentCategoryObj.rules.length > 1 ? 's' : ''} in this domain
              </p>
            </div>
          </div>

          {/* Bad vs Good Code Toggle */}
          <div className="flex items-center gap-2 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)] font-mono text-xs">
            <button
              onClick={() => setShowGoodCode(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${!showGoodCode ? 'bg-[var(--color-issue)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Bad Code
            </button>
            <button
              onClick={() => setShowGoodCode(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${showGoodCode ? 'bg-[var(--color-pass)] text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              Good Code
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          {currentCategoryObj.rules.map((rule, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[var(--text-main)]">
                  {rule.name}
                </span>
                <span className="px-2.5 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-xs font-bold text-[var(--accent-amber)]">
                  {rule.criterion}
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                <strong className="text-[var(--text-main)]">Why it matters:</strong> {rule.why}
              </p>

              <div className="pt-2">
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider mb-1 text-[var(--text-muted)]">
                  {showGoodCode ? '✅ Recommended Solution Snippet' : '❌ Non-compliant Code Snippet'}
                </div>
                <pre className={`p-3.5 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[var(--color-pass)]/10 border-[var(--color-pass)]/30 text-[var(--color-pass)]' : 'bg-[var(--color-issue)]/10 border-[var(--color-issue)]/30 text-[var(--color-issue)]'}`}>
                  {showGoodCode ? rule.goodCode : rule.badCode}
                </pre>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
