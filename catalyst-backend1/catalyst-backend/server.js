// Catalyst backend — minimal proxy so the frontend never touches your API key.
// Run: npm install && npm start   (then open http://localhost:3001)

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

if (!API_KEY) {
  console.warn('\n⚠️  No ANTHROPIC_API_KEY found. Copy .env.example to .env and add your key from https://console.anthropic.com/settings/keys\n');
}

app.use(express.json({ limit: '15mb' })); // generous limit for pasted note/PDF text
app.use(express.static(path.join(__dirname, 'public')));

// Frontend calls this exact path — see callClaude() in index.html
app.post('/v1/messages', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: { message: 'Server has no ANTHROPIC_API_KEY configured. Add one to .env and restart.' } });
  }
  try {
    const payload = { ...req.body, model: MODEL }; // server always decides the real model id
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error('Upstream request failed:', err);
    res.status(502).json({ error: { message: 'Could not reach the Anthropic API from the server: ' + err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`\nCatalyst running → http://localhost:${PORT}\n`);
});
