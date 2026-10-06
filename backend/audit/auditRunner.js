const axios = require('axios');
const cheerio = require('cheerio');
const { runWCAGChecks } = require('./wcagChecks');
const { runSEOChecks } = require('./seoChecks');
const { calculateScore } = require('./scoring');
const { generatePageRanking } = require('./pageRanking');
const suggestionEngine = require('../suggestions/suggestionEngine');

const URL_MODULE = require('url');

const dns = require('dns').promises;

function isPrivateOrLoopbackHost(hostname) {
  if (!hostname) return true;
  const host = hostname.toLowerCase().trim();

  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true;
  }

  // IPv4 range checks
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    if (a === 127) return true; // Loopback
    if (a === 10) return true; // Class A Private
    if (a === 169 && b === 254) return true; // Link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // Class B Private
    if (a === 192 && b === 168) return true; // Class C Private
    if (a === 0) return true;
  }

  // IPv6 checks
  if (host.startsWith('fe80:') || host.startsWith('fc00:') || host.startsWith('fd00:') || host === '::1') {
    return true;
  }

  return false;
}

async function verifyDNSHost(hostname) {
  if (isPrivateOrLoopbackHost(hostname)) return false;
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (isPrivateOrLoopbackHost(addr.address)) {
        return false;
      }
    }
  } catch (err) {
    return false; // If DNS lookup fails, treat as unreachable
  }
  return true;
}

module.exports = async function runAudit(url) {
  let parsedUrl;
  try {
    parsedUrl = new URL_MODULE.URL(url);
  } catch (_) {
    throw new Error('Invalid URL format. Please provide a valid web URL (e.g., https://example.com)');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Only http:// and https:// web URLs are supported.');
  }

  const isValidHost = await verifyDNSHost(parsedUrl.hostname);
  if (!isValidHost) {
    throw new Error('Scanning localhost, private IP ranges, or unreachable hostnames is blocked for security.');
  }

  const resp = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: 15000,
    maxContentLength: 5 * 1024 * 1024, // Limit response to 5MB max
    maxRedirects: 3
  });
  const html = resp.data;
  console.log('➡️ fetched HTML length:', html.length);
  const $ = cheerio.load(html);

  const wcagIssues = runWCAGChecks($) || [];
  console.log('➡️ wcagIssues count:', wcagIssues.length);

  const seoIssues = runSEOChecks($) || [];
  console.log('➡️ seoIssues count:', seoIssues.length);

  const wcagResult = calculateScore(wcagIssues, 'wcag');
  const seoResult = calculateScore(seoIssues, 'seo');

  // Precise overall calculation: 70% WCAG, 30% SEO
  // WCAG is more important for accessibility
  const overall = Math.round(wcagResult.score * 0.7 + seoResult.score * 0.3);

  console.log('➡️ scoring done:', { wcag: wcagResult.score, seo: seoResult.score, overall });

  // Generate page ranking and grading
  const pageRanking = generatePageRanking(
    wcagResult.score, 
    seoResult.score, 
    wcagResult.breakdown, 
    seoResult.breakdown
  );

  // Build audit object to pass to suggestion engine
  const auditForSuggestions = {
    url,
    wcag: { score: wcagResult.score, breakdown: wcagResult.breakdown, issues: wcagIssues },
    seo: { score: seoResult.score, breakdown: seoResult.breakdown, issues: seoIssues }
  };

  let suggestions = [];
  try {
    suggestions = await suggestionEngine(auditForSuggestions);
  } catch (e) {
    console.error('Failed to generate suggestions:', e.message || e);
    suggestions = [];
  }

  return {
    url,
    wcag: { 
      score: wcagResult.score, 
      breakdown: wcagResult.breakdown, 
      issues: wcagIssues 
    },
    seo: { 
      score: seoResult.score, 
      breakdown: seoResult.breakdown,
      issues: seoIssues 
    },
    overall: { 
      score: overall,
      wcagWeight: 70,
      seoWeight: 30
    },
    ranking: pageRanking,
    suggestions
  };
};
