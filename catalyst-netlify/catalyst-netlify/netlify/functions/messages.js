// Netlify Function — proxies frontend requests to the real Anthropic API.
// The API key lives only in Netlify's environment variables, never in the browser.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: { message: 'Method not allowed' } }),
    };
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: { message: 'Server has no ANTHROPIC_API_KEY configured. Set it in Netlify → Site settings → Environment variables.' },
      }),
    };
  }

  let payload;
  try {
    payload = { ...JSON.parse(event.body || '{}'), model: MODEL };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: { message: 'Invalid request body' } }) };
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });
    const data = await upstream.text(); // pass through as-is
    return {
      statusCode: upstream.status,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: { message: 'Could not reach the Anthropic API: ' + err.message } }),
    };
  }
};
