require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const runAudit = require('./audit/auditRunner');
const suggestionEngine = require('./suggestions/suggestionEngine');

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
});

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
app.options('*', (req, res) => res.sendStatus(200));

app.use((req,res,next)=>{
  console.log('🔥 Incoming request:', req.method, req.url);
  next();
});

app.get('/api/ai-status', (req, res) => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
  res.json({ aiAvailable: hasKey });
});

app.post('/api/audit', async (req,res)=>{
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing url' });
  console.log('🔍 AUDIT REQUEST:', url);
  try {
    const audit = await runAudit(url);
    res.json(audit);
  } catch (err) {
    console.error('❌ BACKEND AUDIT ERROR:', err && (err.stack || err.message));
    res.status(500).json({ error: 'Audit failed', detail: String(err && err.message) });
  }
});

app.post('/api/explain-issue', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return res.status(200).json({
      available: false,
      error: 'OPENAI_API_KEY env variable is not configured on the server.'
    });
  }

  const { issueId, desc, snippet, location } = req.body || {};
  if (!issueId && !desc) {
    return res.status(400).json({ error: 'Missing issue information' });
  }

  try {
    const payload = {
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert accessibility & SEO developer. Provide a clear, friendly, plain-English 2-3 sentence explanation of the problem, why it matters, and a clean code fix snippet.'
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
    console.error('❌ AI Explain issue failed:', err?.response?.data || err.message);
    res.status(200).json({
      available: false,
      error: err?.response?.data?.error?.message || err.message || 'Failed to generate AI explanation.'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('🚀 Server running on port', PORT));
