# Catalyst — local backend

This lets Catalyst run standalone (no Claude.ai preview needed) so you can present it in Edge
or any browser, on your own laptop or a projector, without exposing your API key to the page.

## Why this exists
The frontend can't call `api.anthropic.com` directly from a browser — there's no way to keep
an API key secret in client-side JS, and Anthropic's API blocks browser CORS requests anyway.
This server sits in between: the browser talks to `localhost:3001`, the server talks to
Anthropic with your real key, and the key never reaches the browser or your slides.

## Setup (once)

```bash
cd catalyst-backend
npm install
cp .env.example .env
```

Open `.env` and paste your real key from https://console.anthropic.com/settings/keys:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
npm start
```

Then open **http://localhost:3001** in Edge. That's it — Library, Search & Read, Notes, AI
Chat, Mind Maps, and Quizzes all work exactly as before, but now talking to your own server.

## Presenting

- Start the server a few minutes before you go on stage (`npm start`), and leave the terminal
  window open in the background.
- Open the app at `http://localhost:3001`, not by double-clicking the HTML file — the AI
  features only work when served by this backend.
- If wifi at the venue is unreliable, note that web search and AI calls still need internet
  access (they hit Anthropic's API); everything else (library, notes, bookmarks, account
  switching) works fully offline.

## Troubleshooting

- **"Server has no ANTHROPIC_API_KEY configured"** → you skipped the `.env` step above.
- **Nothing loads at localhost:3001** → check the terminal for errors; make sure nothing else
  is using port 3001, or set `PORT=3002` (etc.) in `.env`.
- **AI features return an error toast** → the toast now shows the real error message from the
  API (bad key, rate limit, etc.) instead of hanging silently — read it, it'll usually say
  exactly what's wrong.
- **Web search / model errors** → if `claude-sonnet-5` isn't valid for your account yet, try
  setting `ANTHROPIC_MODEL=claude-sonnet-4-5-20250929` (or check
  https://docs.claude.com for the current model id) in `.env`.
