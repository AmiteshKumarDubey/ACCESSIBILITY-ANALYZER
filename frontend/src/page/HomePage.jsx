import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState("signin");
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null); // { title, content }
  const [activeFeatureTab, setActiveFeatureTab] = useState("owners"); // 'owners' | 'partners'
  const [toastMessage, setToastMessage] = useState("");
  
  const urlInputRef = useRef(null);
  const navigate = useNavigate();

  // Toast message trigger
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nav-item')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function runAudit(e) {
    if (e) e.preventDefault();
    if (!url) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned ${resp.status}`);
      }

      const data = await resp.json();
      setLoading(false);
      navigate("/results", { state: data });
    } catch (err) {
      console.error("Audit failed:", err);
      setErrorMsg(err.message || "Failed to scan. Is the backend server running?");
      setLoading(false);
    }
  }

  const scrollToScanner = () => {
    const scannerEl = document.getElementById('scanner-section');
    if (scannerEl) {
      scannerEl.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        if (urlInputRef.current) urlInputRef.current.focus();
      }, 600);
    }
  };

  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const openInfo = (title, content) => {
    setInfoModal({ title, content });
    setActiveDropdown(null);
  };

  return (
    <div className="min-h-screen bg-white text-[#0a1024] font-sans selection:bg-blue-100 overflow-x-hidden relative">
      
      {/* WCAG 2.4.1 Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-white focus:text-[#0047ff] focus:p-4 focus:z-[9999] focus:rounded-xl focus:shadow-2xl focus:font-bold border border-blue-200"
      >
        Skip to main content
      </a>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[1000] bg-[#0a1024] text-white px-6 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-gray-800" role="status" aria-live="polite">
          <span className="text-emerald-400" aria-hidden="true">✓</span> {toastMessage}
        </div>
      )}

      {/* Login & Register Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1024]/50 backdrop-blur-md px-4" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsLoginOpen(false)} aria-label="Close login dialog" className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 mb-6">
              <button 
                id="login-modal-title"
                onClick={() => setLoginTab("signin")} 
                className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors ${loginTab === "signin" ? "border-[#0047ff] text-[#0047ff]" : "border-transparent text-gray-400"}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setLoginTab("signup")} 
                className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors ${loginTab === "signup" ? "border-[#0047ff] text-[#0047ff]" : "border-transparent text-gray-400"}`}
              >
                Create Account
              </button>
            </div>

            {loginTab === "signin" ? (
              <form onSubmit={(e) => { e.preventDefault(); setIsLoginOpen(false); triggerToast("Welcome back! Signed in successfully."); }} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input id="login-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="you@company.com" />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input id="login-password" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-[#0047ff] hover:bg-[#0038cc] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-lg shadow-blue-500/20">
                  Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setIsLoginOpen(false); triggerToast("Account created! Free trial activated."); }} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input id="signup-name" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="Alex Morgan" />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                  <input id="signup-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="alex@company.com" />
                </div>
                <div>
                  <label htmlFor="signup-pass" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input id="signup-pass" type="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="At least 8 characters" />
                </div>
                <button type="submit" className="w-full bg-[#0047ff] hover:bg-[#0038cc] text-white font-bold py-3.5 rounded-xl transition-colors mt-2 shadow-lg shadow-blue-500/20">
                  Start 14-Day Free Trial
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Book a Demo Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1024]/50 backdrop-blur-md px-4" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border-t-8 border-[#0047ff]">
            <button onClick={() => setIsDemoOpen(false)} aria-label="Close demo dialog" className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 id="demo-modal-title" className="text-3xl font-bold mb-2 tracking-tight">Book a Live Demo</h2>
            <p className="text-gray-500 mb-6 text-sm">See how our AI accessibility engine audits and fixes compliance gaps automatically.</p>
            <form onSubmit={(e) => { e.preventDefault(); setIsDemoOpen(false); triggerToast("Demo requested! Our accessibility engineer will contact you shortly."); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="demo-fname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input id="demo-fname" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="demo-lname" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input id="demo-lname" type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <input id="demo-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="john@company.com" />
              </div>
              <div>
                <label htmlFor="demo-url" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input id="demo-url" type="url" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0047ff] outline-none text-sm" placeholder="https://yoursite.com" />
              </div>
              <button type="submit" className="w-full bg-[#0a1024] hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors mt-4 shadow-lg">
                Schedule My Demo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {isPricingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1024]/50 backdrop-blur-md px-4 overflow-y-auto py-10" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border-t-8 border-[#0047ff]">
            <button onClick={() => setIsPricingOpen(false)} aria-label="Close pricing dialog" className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="text-center mb-8">
              <span className="bg-blue-100 text-[#0047ff] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Plans & Pricing</span>
              <h2 className="text-3xl font-bold mt-2">Transparent Accessibility Plans</h2>
              <p className="text-gray-500 text-sm mt-1">Get compliant with WCAG 2.2 AA standards today</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#0a1024]">Starter Scan</h3>
                  <p className="text-xs text-gray-500 mb-4">For personal projects & blogs</p>
                  <div className="text-3xl font-black mb-4">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
                  <ul className="space-y-2 text-xs text-gray-600 mb-6">
                    <li>✓ 1 Page WCAG 2.2 Audit</li>
                    <li>✓ SEO Compliance Check</li>
                    <li>✓ Basic AI Suggestions</li>
                    <li>✓ Community Support</li>
                  </ul>
                </div>
                <button onClick={() => { setIsPricingOpen(false); scrollToScanner(); }} className="w-full bg-[#0a1024] text-white font-bold py-3 rounded-xl text-xs hover:bg-gray-800 transition-colors">
                  Run Free Scan
                </button>
              </div>

              {/* Business Pro */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#0047ff] shadow-xl relative flex flex-col justify-between">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0047ff] text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
                <div>
                  <h3 className="font-bold text-lg text-[#0a1024]">Business Pro</h3>
                  <p className="text-xs text-gray-500 mb-4">For active business websites</p>
                  <div className="text-3xl font-black text-[#0047ff] mb-4">$49 <span className="text-xs font-normal text-gray-500">/ month</span></div>
                  <ul className="space-y-2 text-xs text-gray-600 mb-6">
                    <li>✓ Unlimited Website Scans</li>
                    <li>✓ Automatic Daily Audits</li>
                    <li>✓ AccessiBot AI Code Fixer</li>
                    <li>✓ Exportable PDF/JSON Reports</li>
                    <li>✓ Priority Email Support</li>
                  </ul>
                </div>
                <button onClick={() => { setIsPricingOpen(false); setIsLoginOpen(true); }} className="w-full bg-[#0047ff] text-white font-bold py-3 rounded-xl text-xs hover:bg-[#0038cc] transition-colors shadow-md">
                  Start 14-Day Free Trial
                </button>
              </div>

              {/* Enterprise */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-[#0a1024]">Enterprise</h3>
                  <p className="text-xs text-gray-500 mb-4">For agencies & legal compliance</p>
                  <div className="text-3xl font-black mb-4">Custom</div>
                  <ul className="space-y-2 text-xs text-gray-600 mb-6">
                    <li>✓ Multi-Domain Scanning</li>
                    <li>✓ $15,000 Legal Protection Pledge</li>
                    <li>✓ Dedicated WCAG Engineer</li>
                    <li>✓ Custom API Access</li>
                    <li>✓ SLA & 24/7 Phone Support</li>
                  </ul>
                </div>
                <button onClick={() => { setIsPricingOpen(false); setIsDemoOpen(true); }} className="w-full bg-[#0a1024] text-white font-bold py-3 rounded-xl text-xs hover:bg-gray-800 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Dialog Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1024]/50 backdrop-blur-md px-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setInfoModal(null)} aria-label="Close information dialog" className="absolute top-6 right-6 text-gray-400 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#0a1024]">{infoModal.title}</h2>
            <div className="text-gray-600 leading-relaxed text-sm space-y-3 mb-6">
              {infoModal.content}
            </div>
            <button onClick={() => setInfoModal(null)} className="w-full bg-[#0047ff] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#0038cc]">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Header & Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-b border-gray-100">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto" aria-label="Main Navigation">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center text-xl font-bold tracking-tight text-[#0a1024]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#0047ff] mr-1" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              accessiAnalyzer
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-gray-700 tracking-wider">
            
            {/* SOLUTIONS */}
            <div className="relative nav-item">
              <button onClick={(e) => toggleDropdown('solutions', e)} className={`flex items-center gap-1 transition-colors ${activeDropdown === 'solutions' ? 'text-[#0047ff]' : 'hover:text-[#0047ff]'}`}>
                SOLUTIONS <ChevronDown isOpen={activeDropdown === 'solutions'} />
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => openInfo("Web Accessibility Solution", "Our web accessibility solution provides automated WCAG 2.2 AA scanning, real-time issue identification, and instant code remediation to protect your site against ADA lawsuits.")} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-bold text-[#0a1024]">Web Accessibility</div>
                    <div className="text-gray-500 text-xs mt-1">WCAG 2.2 AA compliant testing</div>
                  </div>
                  <div onClick={() => openInfo("Mobile App Auditing", "Complete audit suite for iOS Swift/SwiftUI and Android Kotlin/Jetpack Compose apps to ensure screen reader (VoiceOver/TalkBack) readiness.")} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-bold text-[#0a1024]">Mobile Apps</div>
                    <div className="text-gray-500 text-xs mt-1">iOS and Android auditing</div>
                  </div>
                  <div onClick={() => openInfo("Legal Protection Package", "Includes a $15,000+ warranty pledge, legal documentation support, and dedicated WCAG attorney consultation.")} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-bold text-[#0a1024]">Legal Protection</div>
                    <div className="text-gray-500 text-xs mt-1">Litigation support package</div>
                  </div>
                </div>
              )}
            </div>

            {/* COMPANY */}
            <div className="relative nav-item">
              <button onClick={(e) => toggleDropdown('company', e)} className={`flex items-center gap-1 transition-colors ${activeDropdown === 'company' ? 'text-[#0047ff]' : 'hover:text-[#0047ff]'}`}>
                COMPANY <ChevronDown isOpen={activeDropdown === 'company'} />
              </button>
              {activeDropdown === 'company' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => openInfo("About AccessiAnalyzer", "AccessiAnalyzer is built by accessibility engineers and AI researchers with a mission to make the web accessible to everyone.")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">About Us</div>
                  <div onClick={() => openInfo("Careers at AccessiAnalyzer", "We are hiring accessibility audit engineers, frontend developers, and AI researchers! Send your resume to careers@accessianalyzer.com")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">Careers</div>
                  <div onClick={() => openInfo("Contact Us", "Have questions? Reach out to support@accessianalyzer.com or call our toll-free support line at 1-800-ACCESSI.")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">Contact</div>
                </div>
              )}
            </div>

            {/* PARTNERS */}
            <div className="relative nav-item">
              <button onClick={(e) => toggleDropdown('partners', e)} className={`flex items-center gap-1 transition-colors ${activeDropdown === 'partners' ? 'text-[#0047ff]' : 'hover:text-[#0047ff]'}`}>
                PARTNERS <ChevronDown isOpen={activeDropdown === 'partners'} />
              </button>
              {activeDropdown === 'partners' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => openInfo("Agency Program", "Join over 500+ web agencies offering client accessibility audits and earning white-label compliance reports.")} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-bold text-[#0a1024]">Agency Program</div>
                    <div className="text-gray-500 text-xs mt-1">For digital agencies</div>
                  </div>
                  <div onClick={() => openInfo("Affiliate Program", "Earn 20% recurring commissions for every business client referred to AccessiAnalyzer Pro.")} className="px-5 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-bold text-[#0a1024]">Affiliates</div>
                    <div className="text-gray-500 text-xs mt-1">Earn commissions</div>
                  </div>
                </div>
              )}
            </div>

            {/* RESOURCES */}
            <div className="relative nav-item">
              <button onClick={(e) => toggleDropdown('resources', e)} className={`flex items-center gap-1 transition-colors ${activeDropdown === 'resources' ? 'text-[#0047ff]' : 'hover:text-[#0047ff]'}`}>
                RESOURCES <ChevronDown isOpen={activeDropdown === 'resources'} />
              </button>
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2">
                  <div onClick={() => openInfo("Accessibility Blog", "Read our latest articles on WCAG 2.2 AA criteria, ADA website lawsuit trends, and ARIA best practices.")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">Blog</div>
                  <div onClick={() => openInfo("Customer Case Studies", "Discover how Fortune 500 companies achieved 100% WCAG AA compliance with AccessiAnalyzer AI.")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">Case Studies</div>
                  <div onClick={() => openInfo("Help Center", "Search our developer knowledge base for HTML, React, and Vue accessibility code samples.")} className="px-5 py-2.5 font-bold hover:bg-gray-50 hover:text-[#0047ff] cursor-pointer">Help Center</div>
                </div>
              )}
            </div>

            {/* PRICING */}
            <button className="hover:text-[#0047ff] transition-colors" onClick={() => setIsPricingOpen(true)}>PRICING</button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm font-bold">
            <button onClick={() => { setLoginTab("signin"); setIsLoginOpen(true); }} className="hover:text-[#0047ff] px-2 text-[13px] tracking-wider transition-colors">LOGIN</button>
            <button onClick={() => setIsDemoOpen(true)} className="border-2 border-gray-200 hover:border-[#0a1024] text-[#0a1024] rounded-full px-6 py-2.5 transition-colors text-[13px] tracking-wider">
              BOOK A DEMO
            </button>
            <button onClick={scrollToScanner} className="bg-[#0047ff] hover:bg-[#0038cc] text-white rounded-full px-6 py-2.5 transition-colors flex items-center gap-2 text-[13px] tracking-wider shadow-md shadow-blue-500/20">
              START FREE TRIAL
              <ArrowRight />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 text-center max-w-5xl mx-auto">
          <p className="text-gray-600 text-lg font-medium tracking-wide mb-6">Expert-driven. AI-powered.</p>
          
          {/* Main Page Title H1 */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#0a1024] leading-[1.1] mb-12 tracking-tight">
            Web accessibility <span className="text-[#0047ff] italic font-serif font-medium">tailored</span><br />
            for your business
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-20 text-[13px] tracking-wider">
            <button onClick={() => setIsDemoOpen(true)} className="border-2 border-gray-200 hover:border-[#0a1024] text-[#0a1024] font-bold rounded-full px-8 py-3.5 transition-colors flex items-center gap-2">
              BOOK A DEMO <ArrowRight />
            </button>
            <button onClick={scrollToScanner} className="bg-[#0047ff] hover:bg-[#0038cc] text-white font-bold rounded-full px-8 py-3.5 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30">
              START FREE TRIAL <ArrowRight />
            </button>
          </div>

          {/* 3 Pills */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div onClick={() => openInfo("ADA & EAA Compliance", "WCAG 2.2 AA guidelines form the basis for ADA Title III and European Accessibility Act (EAA) compliance. Our scanner checks contrast, keyboard navigation, and ARIA labels.")} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <h3 className="font-bold text-[#0a1024] mb-3 text-[13px] tracking-wider">ADA & EAA COMPLIANCE</h3>
              <p className="text-[#4b5563] text-[15px] leading-relaxed">WCAG 2.2 AA-based remediation for legal compliance</p>
            </div>
            <div onClick={() => openInfo("Customizable Audits", "Choose between instant AI remediation, manual expert auditing, or full continuous monitoring suited for your team's stack.")} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <h3 className="font-bold text-[#0a1024] mb-3 text-[13px] tracking-wider">CUSTOMIZABLE</h3>
              <p className="text-[#4b5563] text-[15px] leading-relaxed">Solutions & plans designed to fit every business type</p>
            </div>
            <div onClick={() => openInfo("Heavy-Lifting On Us", "Zero complex installation required. Enter your site URL to generate an actionable audit report and copy-paste code fixes.")} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
              <h3 className="font-bold text-[#0a1024] mb-3 text-[13px] tracking-wider">HEAVY-LIFTING ON US</h3>
              <p className="text-[#4b5563] text-[15px] leading-relaxed">Quick to implement, we take care of the rest</p>
            </div>
          </div>
        </section>

        {/* Floating Mockup Cards Section */}
        <section className="px-4 pb-28 pt-10 overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
          <div className="text-center mb-16">
            <p className="text-[13px] font-bold text-gray-400 tracking-widest uppercase mb-3">See it in action</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a1024] tracking-tight">Everything you need,<br/><span className="text-[#0047ff] italic font-serif font-medium">in one platform</span></h2>
          </div>

          {/* Floating Cards Container */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 md:items-end">
            
            {/* Card 1 */}
            <div className="w-full max-w-[340px] md:max-w-[320px] md:mb-8" style={{ animation: "floatCard1 5s ease-in-out infinite" }}>
              <img
                src="/mockup_score.png"
                alt="Accessibility Score Dashboard showing WCAG 2.2 AA metrics"
                className="w-full rounded-3xl shadow-[0_20px_60px_rgba(0,71,255,0.12)] border border-gray-100 object-cover"
              />
              <p className="text-center mt-4 text-sm font-bold text-gray-500 tracking-wider uppercase">Score Dashboard</p>
            </div>

            {/* Card 2 */}
            <div className="w-full max-w-[360px] md:max-w-[340px] md:-mb-4 z-10" style={{ animation: "floatCard2 4s ease-in-out infinite" }}>
              <img
                src="/mockup_issues.png"
                alt="Accessibility Issues Report displaying detailed WCAG violation breakdown"
                className="w-full rounded-3xl shadow-[0_30px_80px_rgba(0,71,255,0.18)] border border-blue-100 object-cover"
              />
              <p className="text-center mt-4 text-sm font-bold text-[#0047ff] tracking-wider uppercase">Issues Report</p>
            </div>

            {/* Card 3 */}
            <div className="w-full max-w-[340px] md:max-w-[320px] md:mb-8" style={{ animation: "floatCard3 6s ease-in-out infinite" }}>
              <img
                src="/mockup_suggestions.png"
                alt="AI Accessibility Suggestions presenting automated code remediation snippets"
                className="w-full rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.12)] border border-gray-100 object-cover"
              />
              <p className="text-center mt-4 text-sm font-bold text-gray-500 tracking-wider uppercase">AI Suggestions</p>
            </div>
          </div>

          <style>{`
            @keyframes floatCard1 {
              0%, 100% { transform: translateY(0px) rotate(-1deg); }
              50% { transform: translateY(-18px) rotate(-1deg); }
            }
            @keyframes floatCard2 {
              0%, 100% { transform: translateY(-8px) rotate(0deg); }
              50% { transform: translateY(-28px) rotate(0deg); }
            }
            @keyframes floatCard3 {
              0%, 100% { transform: translateY(0px) rotate(1deg); }
              50% { transform: translateY(-14px) rotate(1deg); }
            }
          `}</style>
        </section>

        {/* Logo Cloud Section */}
        <section className="bg-[#030712] py-20 px-4 text-center">
          <h2 className="text-white font-bold text-xl mb-14 tracking-wide">Trusted by businesses and industry leaders worldwide</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 max-w-6xl mx-auto opacity-80">
            <span className="text-white text-3xl font-black tracking-tighter italic">Loacker</span>
            <span className="text-white text-2xl font-serif font-bold tracking-widest">SEIKO</span>
            <span className="text-white text-3xl font-serif italic font-bold">Pillsbury</span>
            <span className="text-white text-2xl font-light tracking-[0.2em]">rag & bone</span>
            <span className="text-white text-2xl font-black tracking-wider">SEGWAY</span>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
            <div className="bg-white/5 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 border border-white/10">
              <span className="text-blue-400 text-lg" aria-hidden="true">G</span> <span className="text-xl">4.6</span> <span className="text-yellow-400" aria-hidden="true">★</span>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 border border-white/10">
              <span className="text-xl">Inc. 5000</span>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-xl text-white font-bold border border-white/10 flex items-center gap-2">
              <span className="text-emerald-400" aria-hidden="true">✓</span> 11 registered patents
            </div>
          </div>
        </section>

        {/* Tabs & Features Section */}
        <section className="py-24 px-6 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center border-b border-gray-200 mb-16">
              <button 
                onClick={() => setActiveFeatureTab("owners")} 
                className={`px-8 py-4 font-bold text-lg transition-colors border-b-2 ${activeFeatureTab === "owners" ? "border-[#0a1024] text-[#0a1024]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                Website Owners
              </button>
              <button 
                onClick={() => setActiveFeatureTab("partners")} 
                className={`px-8 py-4 font-bold text-lg transition-colors border-b-2 ${activeFeatureTab === "partners" ? "border-[#0a1024] text-[#0a1024]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                Partners & Agencies
              </button>
            </div>

            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a1024] mb-6 tracking-tight">It's your choice, our work.</h2>
              <p className="text-[#4b5563] text-xl leading-relaxed max-w-3xl mx-auto">With automated AI, human expertise, or a blend of both—get a tailored<br className="hidden md:block"/>solution that fits your website</p>
            </div>

            {activeFeatureTab === "owners" ? (
              <div className="grid md:grid-cols-3 gap-12 animate-in fade-in duration-300">
                {/* Feature 1 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">Cutting edge automated<br/>AI remediation</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Automated scans and accessibility fixes
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Supports screen readers & keyboard navigation
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Always on with updates every 24 hours
                    </li>
                  </ul>
                  <div onClick={() => scrollToScanner()} className="h-[220px] rounded-3xl bg-gradient-to-br from-[#e6f0ff] to-[#f5f9ff] flex items-center justify-center p-6 shadow-sm overflow-hidden relative border border-blue-50 cursor-pointer group">
                      <div className="relative w-full h-full bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          </div>
                          <span className="text-[#0a1024] font-bold text-lg">AI Scanner Active</span>
                      </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">Expert testing & custom<br/>accessibility fixes</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Manual testing of key user flows
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Custom fixes to close accessibility gaps
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Personalized product adjustments
                    </li>
                  </ul>
                  <div onClick={() => setIsDemoOpen(true)} className="h-[220px] rounded-3xl bg-gradient-to-br from-[#fff0e6] to-[#fffaf5] flex items-center justify-center p-6 shadow-sm overflow-hidden relative border border-orange-50 cursor-pointer group">
                      <div className="relative w-full h-full bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          </div>
                          <span className="text-[#0a1024] font-bold text-lg">Expert Review</span>
                      </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">Litigation support<br/>backed by $15k+ pledge</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Dedicated case manager, start to finish
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> Detailed claims analysis and responses
                    </li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]">
                      <CheckIcon /> ADA attorney consult, plus $15k+ pledge
                    </li>
                  </ul>
                  <div onClick={() => openInfo("Litigation Protection Guarantee", "We guarantee WCAG 2.2 AA audit accuracy. If a legal claim is brought regarding a compliant site audited by AccessiAnalyzer Pro, we provide legal support up to $15,000.")} className="h-[220px] rounded-3xl bg-gradient-to-br from-[#e6ffe6] to-[#f5fff5] flex items-center justify-center p-6 shadow-sm overflow-hidden relative border border-green-50 cursor-pointer group">
                      <div className="relative w-full h-full bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                          </div>
                          <span className="text-[#0a1024] font-bold text-lg">Legal Protection</span>
                      </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-12 animate-in fade-in duration-300">
                {/* Partner Feature 1 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">White-Label Agency<br/>Audit Reports</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> Add agency logo to client reports</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> Unlimited client website audits</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> Custom domain export branding</li>
                  </ul>
                </div>

                {/* Partner Feature 2 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">Recurring Affiliate<br/>Commissions</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> 20% recurring monthly payout</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> Dedicated partner dashboard</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> 60-day cookie window</li>
                  </ul>
                </div>

                {/* Partner Feature 3 */}
                <div>
                  <h3 className="text-[26px] font-bold text-[#0a1024] mb-6 leading-snug">API Integration for<br/>Developers</h3>
                  <ul className="space-y-5 mb-10">
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> RESTful API & Webhooks</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> CI/CD deployment checks</li>
                    <li className="flex items-start gap-3 text-[#4b5563] text-[17px]"><CheckIcon /> High-speed automated scanner</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-28 px-8 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-24">
            
            <div className="flex-1 md:max-w-sm">
              <p className="text-gray-500 text-sm font-semibold tracking-widest uppercase mb-5">More than compliance</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#0a1024] leading-[1.1] tracking-tight mb-10">
                Web accessibility is the right thing to do and good for business
              </h2>
              <button onClick={scrollToScanner} className="bg-[#0a1024] hover:bg-gray-800 text-white font-bold rounded-full px-8 py-4 transition-colors flex items-center gap-3 text-[13px] tracking-widest shadow-lg shadow-gray-200">
                START FREE TRIAL <ArrowRight />
              </button>
            </div>

            <div className="flex-1 space-y-14">
              <div className="border-b border-gray-100 pb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-[#0a1024] mb-3">
                  Demonstrate <span className="italic text-[#0047ff] font-serif">inclusion</span>
                </h3>
                <p className="text-[#4b5563] text-lg leading-relaxed font-medium">
                  Contribute to a more inclusive internet, making a meaningful impact on the lives of millions
                </p>
              </div>

              <div className="border-b border-gray-100 pb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-[#0a1024] mb-3">
                  Tap into new <span className="italic text-[#0047ff] font-serif">opportunity</span>
                </h3>
                <p className="text-[#4b5563] text-lg leading-relaxed font-medium">
                  Unlock over $8 trillion in expendable income that businesses can only tap with an accessible website
                </p>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#0a1024] mb-3">
                  Boost brand <span className="italic text-[#0047ff] font-serif">reputation</span>
                </h3>
                <p className="text-[#4b5563] text-lg leading-relaxed font-medium">
                  Web accessibility isn't just a feature—it reflects leadership and values, elevating brand reputation with every click
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Scanner CTA Section (Blue) */}
        <section id="scanner-section" className="bg-[#0047ff] py-28 px-8 text-white relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-[600px] h-[600px] bg-[#0a1024]/10 rounded-full blur-[80px] pointer-events-none" aria-hidden="true"></div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
            <div className="flex-1 w-full text-center md:text-left">
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Put your website to<br/>the <span className="italic font-serif text-[#a6ffdb]">test</span>
              </h2>
            </div>
            <div className="flex-1 w-full max-w-lg relative">
              
              {/* Form with WCAG 4.1.2 accessible label */}
              <form onSubmit={runAudit} className="relative group">
                <label htmlFor="hero-scanner-url" className="sr-only">Enter website URL for accessibility scan</label>
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${errorMsg ? 'bg-red-500/20 blur-md' : 'bg-white/20 blur-md group-hover:bg-white/30'}`}></div>
                <input 
                  id="hero-scanner-url"
                  ref={urlInputRef}
                  type="url" 
                  aria-label="Enter website URL to test web accessibility"
                  placeholder="https://yoursite.com"
                  required
                  className="relative w-full py-6 pl-8 pr-[160px] rounded-full bg-transparent border-2 border-white text-white placeholder-slate-200 font-semibold outline-none text-xl focus:border-white focus:ring-4 focus:ring-white/30 transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                
                {/* Hero Test button with high contrast text #0038cc & font-extrabold */}
                <button 
                  type="submit"
                  disabled={loading}
                  aria-label="Run accessibility scan"
                  className="absolute right-3 top-3 bottom-3 bg-white hover:bg-gray-100 text-[#0038cc] font-extrabold text-lg rounded-full px-10 transition-all disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] shadow-xl border border-white/50"
                >
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-[#0038cc]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : "Test"}
                </button>
              </form>
              {errorMsg && (
                <div className="absolute -bottom-16 left-0 right-0 bg-red-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2" role="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Modern High-Contrast Footer (WCAG 1.4.3 compliant) */}
      <footer className="bg-[#0a1024] text-white pt-20 pb-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center text-xl font-bold tracking-tight mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#0047ff] mr-1" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              accessiAnalyzer
            </div>
            <p className="text-slate-200 text-sm leading-relaxed max-w-sm font-medium">
              The leading AI-powered web accessibility scanner & WCAG 2.2 AA compliance engine. Making the digital world accessible for everyone.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-4 text-white">Solutions</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><button onClick={() => openInfo("Web Auditing", "Automated WCAG 2.2 AA scanning.")} className="hover:text-white transition-colors">Web Audits</button></li>
              <li><button onClick={() => openInfo("Mobile Testing", "iOS & Android accessibility checks.")} className="hover:text-white transition-colors">Mobile Testing</button></li>
              <li><button onClick={() => openInfo("Legal Protection", "$15,000 warranty pledge.")} className="hover:text-white transition-colors">Litigation Defense</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-4 text-white">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><button onClick={() => openInfo("About Us", "Dedicated to digital inclusion.")} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => openInfo("Careers", "We are hiring!")} className="hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => openInfo("Contact", "support@accessianalyzer.com")} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-wider uppercase mb-4 text-white">Legal & WCAG</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><button onClick={() => openInfo("Privacy Policy", "Your data security and privacy are our top priority.")} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => openInfo("Terms of Service", "Standard SaaS licensing terms.")} className="hover:text-white transition-colors">Terms of Service</button></li>
              <li><button onClick={() => openInfo("Accessibility Statement", "AccessiAnalyzer is committed to 100% WCAG 2.2 AA compliance.")} className="hover:text-white transition-colors">Accessibility Statement</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-gray-800 text-center text-xs text-slate-300 flex flex-col md:flex-row items-center justify-between gap-4 font-medium">
          <p>© {new Date().getFullYear()} AccessiAnalyzer Inc. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with ❤️ for an accessible web</span>
          </p>
        </div>
      </footer>

    </div>
  );
}

// Icon Helpers
function ChevronDown({ isOpen }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
}
function ArrowRight() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}
function CheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0047ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
}
