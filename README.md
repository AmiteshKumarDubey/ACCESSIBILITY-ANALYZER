# Accessibility Analyzer

A fast, developer-focused web accessibility (WCAG 2.2 AA) and SEO inspection tool built with React, Node.js, Express, and Cheerio.

Live Demo: [https://accessibility-analyzer-i6h5.vercel.app/](https://accessibility-analyzer-i6h5.vercel.app/)

---

## Overview

I built **Accessibility Analyzer** as a lightweight, honest alternative to commercial overlay widgets and generic blue SaaS templates. Instead of claiming automated legal protection or injecting overlay widgets into third-party sites, this tool performs server-side DOM parsing to inspect public web pages against WCAG 2.2 AA criteria and search engine optimization best practices.

It generates an instant breakdown of WCAG and SEO issues, extracts the document heading hierarchy tree (`h1`–`h6`), provides plain-English remediation instructions with before/after code blocks, and allows exporting reports to PDF or JSON.

---

## Features

- **DOM Inspection Engine**: Parses HTML using Cheerio and Axios to inspect element attributes, heading hierarchy, contrast hints, image descriptions, link text clarity, form control labeling, and meta declarations.
- **Heading Outline Tree Visualizer**: Generates an interactive visual tree of all headings on the page, highlighting missing H1 tags or skipped heading levels.
- **Categorized & Deduplicated Issues**: Merges accessibility and SEO findings without duplicate entries, assigning calibrated severities (Critical, Major, Moderate, Minor).
- **Before/After Code Fixes & W3C Links**: Includes exact code remediation snippets, one-click copy buttons, and direct links to official W3C WCAG Understanding documentation.
- **Optional Server-Side AI Explanations**: If an `OPENAI_API_KEY` is configured on the backend, users can click "Explain with AI" inside any issue card for custom explanations. The key remains safely hidden on the server.
- **Local Scan History**: Tracks previous scores in `localStorage` per URL, displaying progress deltas (e.g. `+5 since last scan`) without storing data on third-party servers.
- **PDF & JSON Export**: Download full audit reports formatted for team reviews or developer workflows.
- **Accessible UI**: Built with AA contrast ratios, dark mode toggle (with zero flash on load), semantic HTML landmarks, visible focus rings, and ARIA live progress updates.

---

## How Scoring Works

Scores start at 100 points and apply weighted penalties based on issue severity:

| Severity | Penalty | Description |
| :--- | :--- | :--- |
| **Critical** | -20 pts | Screen reader blockers (missing `lang`, missing `title`, `noindex` tag, low contrast) |
| **Major** | -10 pts | Structural failures (missing `alt` text, missing `h1`, unlabeled form controls, missing canonical) |
| **Moderate** | -4 pts | Navigation issues (skipped heading hierarchy, empty or generic link text) |
| **Minor** | -1 pt | Best practice recommendations (meta description length, missing Open Graph tags) |

The **Overall Score** combines WCAG and SEO performance using a 70/30 weighted index:

$$\text{Overall Score} = \text{Math.round}(\text{WCAG Score} \times 0.70 + \text{SEO Score} \times 0.30)$$

---

## Rules Checked

| Rule ID | Category | WCAG / Standard | Severity | Description |
| :--- | :--- | :--- | :--- | :--- |
| `missing-lang` | Accessibility | WCAG 3.1.1 | Critical | Missing `lang` attribute on `<html>` |
| `missing-title` | Accessibility / SEO | WCAG 2.4.2 | Critical | Missing or empty `<title>` tag |
| `color-contrast-low` | Accessibility | WCAG 1.4.3 | Critical | Text contrast below 4.5:1 ratio |
| `missing-viewport` | Accessibility / SEO | WCAG 1.4.10 | Critical | Missing mobile viewport meta tag |
| `missing-alt` | Accessibility | WCAG 1.1.1 | Major | Images missing descriptive `alt` text |
| `missing-h1` | Accessibility / SEO | WCAG 1.3.1 | Major | Document skips top-level `<h1>` |
| `form-missing-label` | Accessibility | WCAG 4.1.2 | Major | Form input lacks `<label>` or ARIA name |
| `heading-hierarchy` | Accessibility | WCAG 1.3.1 | Moderate | Non-sequential heading levels |
| `link-empty-text` | Accessibility | WCAG 2.4.4 | Moderate | Empty links or generic text ("click here") |
| `focus-not-visible` | Accessibility | WCAG 2.4.7 | Moderate | Missing visible focus ring styles |
| `missing-skip-link` | Accessibility | WCAG 2.4.1 | Minor | Missing skip-to-main content link |
| `noindex-tag` | SEO | SEO Crawling | Critical | Robots meta tag blocking search indexing |
| `missing-meta-desc` | SEO | SEO Snippet | Major | Missing page meta description |
| `missing-canonical` | SEO | SEO Duplicate | Major | Missing canonical link tag |

---

## Architecture

```
ACCESSIBILITY-ANALYZER/
├── backend/
│   ├── audit/
│   │   ├── auditRunner.js      # Main audit orchestrator & heading tree generator
│   │   ├── wcagChecks.js       # Cheerio WCAG 2.2 AA rule evaluations
│   │   ├── seoChecks.js        # Cheerio SEO metadata rule evaluations
│   │   ├── scoring.js          # Calibrated 70/30 scoring engine
│   │   └── scoring.test.js     # Unit test suite for scoring logic
│   ├── suggestions/
│   │   └── suggestionEngine.js # Rule-based & Hugging Face suggestion provider
│   ├── server.js               # Express API (/api/audit, /api/explain-issue)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, ScoreRing, IssueCard, HeadingTreeViewer, etc.
    │   ├── page/               # HomePage & ResultPage
    │   ├── utils/              # wcagMapping dictionary & pdfExport generator
    │   ├── index.css           # Theme variables (Warm Paper & Ink Dark)
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone repository

```bash
git clone https://github.com/AmiteshKumarDubey/ACCESSIBILITY-ANALYZER.git
cd ACCESSIBILITY-ANALYZER
```

### 2. Install dependencies

```bash
# Install root, backend, and frontend dependencies
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
# Optional: Enable server-side "Explain with AI" button on issue cards
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is omitted, the tool operates normally and disables the optional AI explanation button gracefully.

### 4. Run Development Servers

```bash
npm run dev
```

This starts:
- Frontend Vite dev server at `http://localhost:5173`
- Backend Express API server at `http://localhost:4000`

---

## Unit Testing

Run unit tests for the scoring engine:

```bash
npm test --prefix backend
```

---

## Screenshots

*(Screenshots of Hero URL Scanner, Interactive Mini Demo, Score Rings, Heading Tree, and Expandable Issue Cards can be added here.)*

---

## Known Limitations

1. **Client-rendered SPAs**: Pages that render content purely on the client side via JavaScript (without SSR or pre-rendering) will return static initial HTML output.
2. **Login-Protected Pages**: The scanner inspects public web pages only and cannot bypass authentication walls or CAPTCHAs.
3. **Cross-Origin Stylesheet Computed Styles**: Exact pixel-level color contrast calculation for complex canvas or background image gradients requires dynamic browser headless rendering (e.g. Playwright/Puppeteer). Cheerio performs color heuristic checks on static HTML/CSS.

---

## Roadmap

- [ ] Add Playwright headless browser mode option for SPA DOM execution and canvas contrast rendering.
- [ ] Add batch multi-page sitemap crawler for site-wide accessibility auditing.
- [ ] Add GitHub Actions CI/CD workflow to run automated accessibility checks on pull requests.
