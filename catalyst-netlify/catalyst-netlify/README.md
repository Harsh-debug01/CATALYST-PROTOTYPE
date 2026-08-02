# Catalyst — Netlify deployment

This deploys Catalyst as a real, public website: the frontend is served as a static
site from Netlify's CDN, and the one AI-calling endpoint (`/v1/messages`) runs as a
Netlify Function — a small serverless proxy that holds your Anthropic API key so it
never reaches the browser.

## One-time setup

**1. Install the Netlify CLI** (in PowerShell, anywhere):
```bash
npm install -g netlify-cli
```

**2. Log in:**
```bash
netlify login
```
This opens your browser to sign in / sign up (free, no card needed).

**3. Go into this folder:**
```bash
cd catalyst-netlify
```

**4. Link/create the site:**
```bash
netlify init
```
- Choose **"Create & configure a new site"**
- Pick your team (your personal account is fine)
- Give it a name — e.g. `catalyst` (if taken, try `catalyst-yourname`) — this becomes
  part of your URL: `https://catalyst.netlify.app`
- When asked about build command / publish directory, you can leave build command
  blank and confirm publish directory as `public` (already set in `netlify.toml`,
  so it should autodetect).

**5. Set your API key** (this stores it securely on Netlify's servers, not in your code):
```bash
netlify env:set ANTHROPIC_API_KEY sk-ant-your-real-key-here
```

## Deploy

**Test deploy (draft URL, safe to check first):**
```bash
netlify deploy
```

**Go live (real public URL):**
```bash
netlify deploy --prod
```

You'll get a URL like:
```
https://catalyst.netlify.app
```

Open that anywhere, on any device — it's live on the real internet now.

## Updating after a code change

Whenever you get a new `index.html` from me, drop it into `public/index.html`
(replacing the old one), then just run:
```bash
netlify deploy --prod
```
again.

## Presenting

- Netlify Functions "cold start" if unused for a while (a few extra seconds on the
  very first request) — visit the live URL yourself a few minutes before presenting
  to warm it up.
- The site itself (Library, Notes, Bookmarks, account switching) works with zero
  latency and zero cost from Netlify's CDN — only the AI-calling function touches
  Anthropic's API and costs API credits.

## Troubleshooting

- **"Server has no ANTHROPIC_API_KEY configured"** → re-run the `netlify env:set`
  command above, then redeploy with `netlify deploy --prod` (env var changes need
  a redeploy to take effect on already-deployed functions... actually Netlify picks
  up new env vars on the next function invocation automatically, but if in doubt,
  redeploy).
- **Blank page / 404** → make sure you're in the `catalyst-netlify` folder when
  running `netlify` commands, and that `public/index.html` exists.
- **AI features error out** → same as the local version: check the toast message,
  it'll show the real error (bad key, no credits, etc.) from Anthropic's API.

## Renaming your site later

`netlify.app` subdomain names can be changed anytime for free:
Netlify dashboard → your site → **Site settings → Domain management → Options →
Edit site name**. A fully custom domain like `catalyst.com` requires buying a
domain separately (~$10–20/year) and pointing it here — optional, not required
for presenting.
