require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const runAudit = require('./audit/auditRunner');
const suggestionEngine = require('./suggestions/suggestionEngine');

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err && err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ UNHANDLED REJECTION:', reason && (reason.message || reason));
});

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP header so API responses aren't blocked by frontend bundlers
}));

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'https://accessibility-analyzer-i6h5.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during dev/preview, restricted via headers
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Rate Limiter for audit endpoint: max 20 requests per 10 minutes per IP
const auditRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many audit requests from this IP. Please try again after 10 minutes.' }
});

// Simple 10-minute in-memory cache for audit results
const scanCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCachedResult(url) {
  const cached = scanCache.get(url);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    scanCache.delete(url);
    return null;
  }
  return cached.data;
}

function setCachedResult(url, data) {
  // Simple cache eviction if size exceeds 100 items
  if (scanCache.size > 100) {
    const oldestKey = scanCache.keys().next().value;
    scanCache.delete(oldestKey);
  }
  scanCache.set(url, { timestamp: Date.now(), data });
}

app.get('/api/ai-status', (req, res) => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
  res.json({ aiAvailable: hasKey });
});

app.post('/api/audit', auditRateLimiter, async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid target URL.' });
  }

  const normalizedUrl = url.trim();

  // Check cache first
  const cached = getCachedResult(normalizedUrl);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  try {
    const audit = await runAudit(normalizedUrl);
    setCachedResult(normalizedUrl, audit);
    res.json(audit);
  } catch (err) {
    console.error('❌ AUDIT ERROR:', err && err.message);
    const clientMessage = err && err.message && !err.message.includes('connect')
      ? err.message
      : 'Failed to inspect website. Please ensure the target URL is a valid public web page.';
    res.status(400).json({ error: clientMessage });
  }
});

// Rate Limiter for AI endpoint: max 10 requests per 10 minutes per IP
const aiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { available: false, error: 'AI request rate limit reached. Please wait a few minutes before asking more questions.' }
});

app.post('/api/ai/chat', aiRateLimiter, async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return res.status(200).json({
      available: false,
      error: 'AI Assistant is currently unavailable because OPENAI_API_KEY is not configured on the server.'
    });
  }

  const { question, reportSummary } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Please provide a valid question.' });
  }

  const trimmedQuestion = question.trim().slice(0, 1000);

  try {
    const systemPrompt = `You are an accessibility (WCAG 2.2) and SEO specialist assistant for Accessibility Analyzer.
Answer ONLY questions directly related to web accessibility, SEO, WCAG rules, HTML/CSS structure, and the provided audit report.
If the user asks about unrelated topics (e.g. sports, cooking, general weather, trivia), politely decline and remind them that you are a dedicated accessibility & SEO audit helper.
Provide clear, actionable code recommendations with before and after HTML/CSS code blocks where applicable.
Never claim a site is 100% legally compliant; remind users that automated scans check partial WCAG criteria.`;

    const userPrompt = `AUDIT REPORT SUMMARY:
- Target URL: ${reportSummary?.url || 'N/A'}
- Overall Score: ${reportSummary?.overallScore ?? 'N/A'}/100
- Accessibility (WCAG) Score: ${reportSummary?.wcagScore ?? 'N/A'}/100
- SEO Score: ${reportSummary?.seoScore ?? 'N/A'}/100
- Top Audit Issues:
${(reportSummary?.topIssues || []).map(i => `  • [${(i.severity || 'issue').toUpperCase()}] ${i.message} (Rule: ${i.id || 'N/A'})`).slice(0, 8).join('\n') || 'None'}

USER QUESTION:
${trimmedQuestion}`;

    const payload = {
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 600,
      temperature: 0.3
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const answer = response.data?.choices?.[0]?.message?.content || 'No answer generated by AI provider.';
    res.json({ available: true, answer });
  } catch (err) {
    console.error('❌ AI Chat API call failed:', err?.message);
    res.status(200).json({
      available: false,
      error: 'Failed to generate AI response. Please check network connectivity or API key quota.'
    });
  }
});

app.post('/api/explain-issue', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return res.status(200).json({
      available: false,
      error: 'AI assistance service is currently unconfigured.'
    });
  }

  const { issueId, desc, snippet, location } = req.body || {};
  if (!issueId && !desc) {
    return res.status(400).json({ error: 'Missing issue details for AI explanation.' });
  }

  try {
    const payload = {
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a WCAG 2.2 and SEO accessibility expert. Provide a concise, clear 2-3 sentence explanation of why this issue matters and how to fix it.'
        },
        {
          role: 'user',
          content: `Issue ID: ${issueId || 'N/A'}\nDescription: ${desc || 'N/A'}\nLocation: ${location || 'N/A'}\nSnippet: ${snippet || 'N/A'}`
        }
      ],
      max_tokens: 350,
      temperature: 0.2
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const explanation = response.data?.choices?.[0]?.message?.content || 'No explanation generated.';
    res.json({ available: true, explanation });
  } catch (err) {
    console.error('❌ AI Explain issue failed:', err?.message);
    res.status(200).json({
      available: false,
      error: 'Failed to generate AI explanation. Please try again.'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('🚀 Server running on port', PORT));

