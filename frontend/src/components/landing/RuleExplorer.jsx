import React, { useState } from 'react';

export default function RuleExplorer() {
  const [activeCategory, setActiveCategory] = useState('Images');
  const [showGoodCode, setShowGoodCode] = useState(true);

  const categories = [
    {
      name: 'Images',
      icon: '🖼️',
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
      icon: '🏷️',
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
      icon: '🔗',
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
      icon: '📝',
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
      icon: '⌨️',
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
      icon: '🎨',
      rules: [
        {
          id: 'color-contrast-low',
          criterion: 'WCAG 1.4.3',
          name: 'Minimum Color Contrast Ratio',
          why: 'Normal text requires at least 4.5:1 contrast against its background so users with low vision or color blindness can read text.',
          badCode: `.muted-text {\n  color: #71717A;\n  background-color: #0B0F1A; /* Low contrast ratio ❌ */\n}`,
          goodCode: `.muted-text {\n  color: #F4F6FB;\n  background-color: #0B0F1A; /* High 14.5:1 contrast ratio ✅ */\n}`
        }
      ]
    },
    {
      name: 'Meta and SEO',
      icon: '⚙️',
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
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121829] border border-[#1A233A] text-xs font-mono text-[#9AA4BF]">
          <span>Rule Explorer</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl sm:text-4xl font-bold text-[#F4F6FB] tracking-tight">
          What we check
        </h2>
        <p className="text-sm text-[#9AA4BF] font-medium">
          Explore real WCAG 2.2 AA criteria and SEO rules inspected by our DOM engine.
        </p>
      </div>

      {/* Accessible Category Tabs */}
      <div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#1A233A] max-w-5xl mx-auto"
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
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${isActive ? 'bg-[#FFB800] text-[#0B0F1A] shadow-md shadow-[#FFB800]/10' : 'bg-[#121829] text-[#9AA4BF] hover:text-[#F4F6FB] border border-[#1A233A]'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Rules Panel */}
      <div 
        id={`category-panel-${currentCategoryObj.name}`}
        role="tabpanel"
        className="max-w-5xl mx-auto bg-[#121829] border border-[#1A233A] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A233A] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentCategoryObj.icon}</span>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-[#F4F6FB]">
                {currentCategoryObj.name} Category Rules
              </h3>
              <p className="font-mono text-xs text-[#9AA4BF]">
                {currentCategoryObj.rules.length} inspection rule{currentCategoryObj.rules.length > 1 ? 's' : ''} in this domain
              </p>
            </div>
          </div>

          {/* Bad vs Good Code Toggle */}
          <div className="flex items-center gap-2 bg-[#0B0F1A] p-1 rounded-xl border border-[#1A233A] font-mono text-xs">
            <button
              onClick={() => setShowGoodCode(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${!showGoodCode ? 'bg-[#FF5C5C] text-white' : 'text-[#9AA4BF] hover:text-[#F4F6FB]'}`}
            >
              Bad Code
            </button>
            <button
              onClick={() => setShowGoodCode(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${showGoodCode ? 'bg-[#2DD4BF] text-[#0B0F1A]' : 'text-[#9AA4BF] hover:text-[#F4F6FB]'}`}
            >
              Good Code
            </button>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          {currentCategoryObj.rules.map((rule, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-[#0B0F1A] border border-[#1A233A] rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-[#F4F6FB]">
                  {rule.name}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#121829] border border-[#1A233A] font-mono text-xs font-bold text-[#FFB800]">
                  {rule.criterion}
                </span>
              </div>

              <p className="text-xs text-[#9AA4BF] font-medium leading-relaxed">
                <strong className="text-[#F4F6FB]">Why it matters:</strong> {rule.why}
              </p>

              <div className="pt-2">
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider mb-1 text-[#9AA4BF]">
                  {showGoodCode ? '✅ Recommended Solution Snippet' : '❌ Non-compliant Code Snippet'}
                </div>
                <pre className={`p-3.5 rounded-xl font-mono text-xs overflow-x-auto border ${showGoodCode ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/30 text-[#2DD4BF]' : 'bg-[#FF5C5C]/10 border-[#FF5C5C]/30 text-[#FF5C5C]'}`}>
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
