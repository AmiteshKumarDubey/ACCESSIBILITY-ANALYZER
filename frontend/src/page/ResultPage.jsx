import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import ScoreChart from "../components/ScoreChart";
import IssueCard from "../components/IssueCard";
import SuggestionCard from "../components/SuggestionCard";
import { exportAuditPDF } from "../utils/pdfExport";
import { useTheme } from "../context/ThemeContext";
import { SHOW_SCORING_DETAILS } from "../config/scoringConfig";

export default function ResultPage() {
  const location = useLocation();
  const audit = location.state;
  const { theme, toggleTheme } = useTheme();

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleExportPDF = () => {
    if (!audit) return;
    try {
      exportAuditPDF(audit);
      triggerToast("📄 PDF Audit Report downloaded successfully!");
    } catch (err) {
      console.error("PDF Export failed:", err);
      triggerToast("❌ Failed to generate PDF report.");
    }
  };

  const handleExportJSON = () => {
    if (!audit) return;
    
    const exportData = JSON.parse(JSON.stringify(audit));
    if (!SHOW_SCORING_DETAILS && exportData.overall) {
      delete exportData.overall.wcagWeight;
      delete exportData.overall.seoWeight;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `accessibility-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast("📥 JSON data downloaded (Dev Option).");
  };

  if (!audit) return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col items-center justify-center font-sans">
      <p className="text-xl text-[var(--text-muted)] mb-4">No audit data found</p>
      <Link to="/" className="text-[var(--accent-text)] font-bold hover:underline flex items-center gap-2">
        ← Back to Home
      </Link>
    </div>
  );

  const filterIssue = (issue) => {
    const idLower = (issue.id || "").toLowerCase();
    const descLower = (issue.desc || "").toLowerCase();
    const queryLower = searchQuery.toLowerCase();

    const matchesSearch = !searchQuery || idLower.includes(queryLower) || descLower.includes(queryLower);

    let isCritical = idLower.includes("missing-alt") || idLower.includes("missing-lang") || idLower.includes("missing-title") || idLower.includes("noindex") || idLower.includes("missing-viewport");
    let isMajor = idLower.includes("h1") || idLower.includes("meta-desc") || idLower.includes("canonical") || idLower.includes("og-tags");
    
    let matchesSeverity = true;
    if (severityFilter === "critical") matchesSeverity = isCritical;
    else if (severityFilter === "major") matchesSeverity = isMajor && !isCritical;
    else if (severityFilter === "minor") matchesSeverity = !isCritical && !isMajor;

    return matchesSearch && matchesSeverity;
  };

  const filteredWcagIssues = audit.wcag?.issues?.filter(filterIssue) || [];
  const filteredSeoIssues = audit.seo?.issues?.filter(filterIssue) || [];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-20 relative transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border)] px-6 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4" role="status" aria-live="polite">
          <span className="text-[var(--good)]" aria-hidden="true">✓</span> {toastMessage}
        </div>
      )}

      {/* Demo Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-surface)] rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border-t-8 border-[var(--accent)] border-x border-b border-[var(--border)]">
            <button onClick={() => setIsDemoOpen(false)} aria-label="Close modal" className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-[var(--text-main)]">Schedule a Demo</h2>
            <p className="text-[var(--text-muted)] mb-8">Consult with an accessibility engineer regarding your WCAG scan results.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="demo-res-fname" className="block text-sm font-medium text-[var(--text-muted)] mb-1">First Name</label>
                  <input id="demo-res-fname" type="text" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-main)] outline-none" placeholder="Jane" />
                </div>
                <div>
                  <label htmlFor="demo-res-lname" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Last Name</label>
                  <input id="demo-res-lname" type="text" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-main)] outline-none" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label htmlFor="demo-res-email" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Work Email</label>
                <input id="demo-res-email" type="email" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-main)] outline-none" placeholder="jane@company.com" />
              </div>
              <div>
                <label htmlFor="demo-res-url" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Scanned URL</label>
                <input id="demo-res-url" type="url" defaultValue={audit.url} className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-muted)] font-mono text-sm outline-none" readOnly />
              </div>
              <button onClick={() => { setIsDemoOpen(false); triggerToast("📅 Meeting requested! Our accessibility expert will email you within 24 hours."); }} className="w-full bg-[var(--accent)] text-[var(--on-accent)] font-bold py-4 rounded-xl transition-colors mt-6 shadow-lg">
                Confirm Demo Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO HEADER AREA (Seamless bg-hero gradient without hardcoded two-tone seam) */}
      <header className="bg-[var(--bg-hero)] border-b border-[var(--border)] pt-4 pb-12 px-6">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-2 md:px-6 py-2 w-full mb-8 max-w-7xl mx-auto" aria-label="Results Header Navigation">
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="flex items-center text-xl font-black tracking-tight text-[var(--text-main)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[var(--accent)] mr-2" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Accessibility Analyzer
            </div>
          </Link>
          
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-full flex items-center px-4 py-2 text-[var(--text-main)] shadow-xs">
              <span className="text-[var(--text-muted)] mr-2" aria-hidden="true">🌐</span>
              <span className="text-[var(--text-main)] text-sm truncate font-mono font-medium">{audit.url}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-4 h-4 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            {/* Primary PDF Export Button */}
            <button
              onClick={handleExportPDF}
              className="bg-[var(--accent)] text-[var(--on-accent)] text-xs font-extrabold px-5 py-2.5 rounded-full transition-all shadow-md hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
            >
              📄 EXPORT PDF REPORT
            </button>

            {/* Secondary JSON Export Button */}
            <button
              onClick={handleExportJSON}
              className="bg-[var(--bg-surface)] text-[var(--text-main)] text-xs font-bold px-3.5 py-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-1 cursor-pointer"
              title="Secondary Dev Option"
            >
              📥 JSON
            </button>

            <Link to="/" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors tracking-wider ml-2">
              ✕ CLOSE
            </Link>
          </div>
        </nav>

        {/* Header Title */}
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text-main)] tracking-tight mb-3">
            Accessibility Scan Results
          </h1>
          <p className="text-[var(--text-muted)] text-base md:text-lg">
            Detailed breakdown of WCAG 2.2 and SEO compliance for your website.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT SECTION */}
      <main className="max-w-6xl mx-auto px-6 pt-8 relative z-10">
        
        {/* Score Rings Card */}
        <section className="bg-[var(--bg-surface)] rounded-2xl shadow-sm p-8 sm:p-10 mb-8 border border-[var(--border)] flex flex-col md:flex-row items-center justify-around gap-8">
          <ScoreChart score={audit.wcag?.score || 80} label="Accessibility Score" />
          <div className="hidden md:block w-px h-36 bg-[var(--border)]" aria-hidden="true"></div>
          <ScoreChart score={audit.seo?.score || 80} label="SEO Score" />
          <div className="hidden md:block w-px h-36 bg-[var(--border)]" aria-hidden="true"></div>
          <ScoreChart score={audit.overall?.score || 80} label="Overall Score" />
        </section>

        {/* Issue Summary Cards & Filters */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => setSeverityFilter(severityFilter === "critical" ? "all" : "critical")}
            className={`bg-[var(--bg-surface)] border cursor-pointer p-6 rounded-xl flex items-center justify-between group transition-all ${
              severityFilter === "critical" ? "border-[var(--bad)] ring-2 ring-[var(--bad)]/20 shadow-sm" : "border-[var(--border)] hover:border-[var(--bad)]/50"
            }`}
          >
            <div>
              <p className="text-[var(--text-main)] font-bold text-lg mb-1 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--bad)] flex items-center justify-center text-[9px] text-white font-bold" aria-hidden="true">!</span>
                Critical Issues
              </p>
              <p className="text-sm text-[var(--text-muted)] font-medium">Must fix immediately (Click to filter)</p>
            </div>
            <p className="text-5xl font-black text-[var(--bad)] font-mono">
              {(audit.wcag?.breakdown?.critical || 0) + (audit.seo?.breakdown?.critical || 0)}
            </p>
          </div>
          
          <div 
            onClick={() => setSeverityFilter(severityFilter === "major" ? "all" : "major")}
            className={`bg-[var(--bg-surface)] border cursor-pointer p-6 rounded-xl flex items-center justify-between group transition-all ${
              severityFilter === "major" ? "border-[var(--warn)] ring-2 ring-[var(--warn)]/20 shadow-sm" : "border-[var(--border)] hover:border-[var(--warn)]/50"
            }`}
          >
            <div>
              <p className="text-[var(--text-main)] font-bold text-lg mb-1 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--warn)] flex items-center justify-center text-[9px] text-black font-bold" aria-hidden="true">!</span>
                Major Issues
              </p>
              <p className="text-sm text-[var(--text-muted)] font-medium">Fix as soon as possible (Click to filter)</p>
            </div>
            <p className="text-5xl font-black text-[var(--warn-text)] font-mono">
              {(audit.wcag?.breakdown?.major || 0) + (audit.seo?.breakdown?.major || 0)}
            </p>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-8 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="relative w-full md:w-96">
            <label htmlFor="search-audit-issues" className="sr-only">Search issues by name or keyword</label>
            <input
              id="search-audit-issues"
              type="text"
              placeholder="Search issues by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-main)] text-sm outline-none focus:border-[var(--focus)]"
            />
            <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Filter:</span>
            {["all", "critical", "major", "minor"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-xs"
                    : "bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-main)]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </section>

        {/* Accessibility Issues List */}
        <section className="mb-12 bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--bg-main)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-main)]">Accessibility Issues ({filteredWcagIssues.length})</h2>
            <span className="bg-[var(--accent)]/10 text-[var(--accent-text)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--accent)]/30">
              WCAG 2.2 AA
            </span>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-1 gap-4">
              {filteredWcagIssues.length > 0 ? (
                filteredWcagIssues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))
              ) : (
                <div className="bg-[var(--good)]/10 border border-[var(--good)]/30 p-6 rounded-xl text-center text-[var(--good)] font-bold flex items-center justify-center gap-3">
                  <span className="text-2xl" aria-hidden="true">✅</span>
                  No accessibility issues matching filter criteria.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO Issues List */}
        <section className="mb-12 bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--bg-main)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-main)]">SEO Issues ({filteredSeoIssues.length})</h2>
            <span className="bg-[var(--accent)]/10 text-[var(--accent-text)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--accent)]/30">
              BEST PRACTICES
            </span>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-1 gap-4">
              {filteredSeoIssues.length > 0 ? (
                filteredSeoIssues.map((issue, i) => (
                  <IssueCard key={i} issue={issue} />
                ))
              ) : (
                <div className="bg-[var(--good)]/10 border border-[var(--good)]/30 p-6 rounded-xl text-center text-[var(--good)] font-bold flex items-center justify-center gap-3">
                  <span className="text-2xl" aria-hidden="true">✅</span>
                  No SEO issues matching filter criteria.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Suggestions */}
        <section className="mb-12 bg-[var(--bg-surface)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--bg-main)] border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <span aria-hidden="true">✨</span> Actionable Suggestions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {audit.suggestions?.length > 0 ? (
                audit.suggestions.map((s, i) => (
                  <SuggestionCard key={i} s={s} />
                ))
              ) : (
                <div className="col-span-2 text-[var(--text-muted)] text-center bg-[var(--bg-main)] border border-[var(--border)] p-6 rounded-xl">No suggestions available.</div>
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
