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

function extractScreenReaderView($) {
  const announcements = [];
  let headingLevelHistory = 0;

  $('body *').each((_, el) => {
    if (announcements.length >= 120) return false;

    const $el = $(el);
    const tagName = el.tagName ? el.tagName.toLowerCase() : '';

    if (['script', 'style', 'noscript', 'head', 'svg', 'path', 'meta', 'link'].includes(tagName)) {
      return;
    }

    // 1. Landmarks
    const role = $el.attr('role');
    const ariaLabel = $el.attr('aria-label') || $el.attr('aria-labelledby') || '';
    if (['header', 'nav', 'main', 'footer', 'aside'].includes(tagName) || ['navigation', 'main', 'banner', 'contentinfo', 'search', 'complementary'].includes(role)) {
      const landmarkType = role || tagName;
      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'landmark',
        tag: tagName,
        text: ariaLabel ? `${landmarkType.toUpperCase()} landmark ("${ariaLabel}")` : `${landmarkType.toUpperCase()} landmark`,
        status: 'ok',
        reason: null
      });
      return;
    }

    // 2. Headings
    if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName.replace('h', ''), 10);
      const text = $el.text().trim();
      let status = 'ok';
      let reason = null;

      if (!text) {
        status = 'problem';
        reason = 'Empty heading tag (contains no visible text)';
      } else if (headingLevelHistory > 0 && level > headingLevelHistory + 1) {
        status = 'problem';
        reason = `Skipped heading level from H${headingLevelHistory} directly to H${level}`;
      }

      if (text) headingLevelHistory = level;

      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'heading',
        level,
        tag: tagName,
        text: text ? `H${level}: "${text}"` : `H${level}: [Empty heading]`,
        status,
        reason
      });
      return;
    }

    // 3. Links
    if (tagName === 'a') {
      const href = $el.attr('href') || '#';
      const text = $el.text().trim() || $el.find('img').attr('alt') || $el.attr('aria-label') || '';
      let status = 'ok';
      let reason = null;

      if (!text) {
        status = 'problem';
        reason = 'Empty link (lacks accessible text name or image alt)';
      } else if (['click here', 'here', 'read more', 'more', 'link'].includes(text.toLowerCase())) {
        status = 'problem';
        reason = 'Uninformative link text (does not describe destination)';
      }

      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'link',
        tag: 'a',
        href: href.length > 40 ? href.slice(0, 40) + '...' : href,
        text: text ? `Link: "${text}"` : 'Link: [Unlabeled]',
        status,
        reason
      });
      return;
    }

    // 4. Images
    if (tagName === 'img') {
      const alt = $el.attr('alt');
      let status = 'ok';
      let reason = null;

      if (alt === undefined) {
        status = 'problem';
        reason = 'Missing alt attribute (screen reader reads raw image filename)';
      } else if (alt === '') {
        status = 'ok';
        reason = 'Decorative image (alt="") - skipped by screen reader';
      }

      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'image',
        tag: 'img',
        alt: alt ?? null,
        text: alt === undefined ? 'Image: [Unlabeled image]' : alt === '' ? 'Image: [Decorative image]' : `Image: "${alt}"`,
        status,
        reason
      });
      return;
    }

    // 5. Buttons
    if (tagName === 'button' || role === 'button') {
      const text = $el.text().trim() || $el.attr('aria-label') || $el.attr('title') || '';
      let status = 'ok';
      let reason = null;

      if (!text) {
        status = 'problem';
        reason = 'Unlabeled button (no accessible label for screen readers)';
      }

      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'button',
        tag: tagName,
        text: text ? `Button: "${text}"` : 'Button: [Unlabeled button]',
        status,
        reason
      });
      return;
    }

    // 6. Form controls
    if (['input', 'select', 'textarea'].includes(tagName)) {
      const inputType = $el.attr('type') || 'text';
      if (['hidden', 'submit', 'button', 'image'].includes(inputType)) return;

      const id = $el.attr('id');
      const ariaLabel = $el.attr('aria-label') || '';
      let labelText = '';
      if (id) {
        labelText = $(`label[for="${id}"]`).text().trim();
      }
      if (!labelText) {
        labelText = $el.closest('label').text().trim();
      }

      const accessibleName = labelText || ariaLabel || $el.attr('placeholder') || '';
      let status = 'ok';
      let reason = null;

      if (!accessibleName) {
        status = 'problem';
        reason = `Form ${tagName} (${inputType}) lacks an associated <label> or aria-label`;
      }

      announcements.push({
        id: `sr-${announcements.length + 1}`,
        type: 'form-control',
        tag: tagName,
        inputType,
        text: accessibleName ? `Form input (${inputType}): "${accessibleName}"` : `Form input (${inputType}): [Unlabeled]`,
        status,
        reason
      });
    }
  });

  return announcements;
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

  const overall = Math.round(wcagResult.score * 0.7 + seoResult.score * 0.3);

  console.log('➡️ scoring done:', { wcag: wcagResult.score, seo: seoResult.score, overall });

  const pageRanking = generatePageRanking(
    wcagResult.score, 
    seoResult.score, 
    wcagResult.breakdown, 
    seoResult.breakdown
  );

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

  const screenReaderView = extractScreenReaderView($);

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
    suggestions,
    screenReaderView
  };
};
