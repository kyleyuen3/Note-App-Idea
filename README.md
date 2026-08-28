# AI Note Organizer

Log free-form notes, then let Claude sort them into categories, tag them, and
write a short summary of each one.

## How it works

- **Client** (`client/`) — a React + Vite app. Notes are stored only in your
  browser's `localStorage`; there's no database and no accounts.
- **Server** (`server/`) — a small Express API with one endpoint
  (`POST /api/organize`) that calls the Claude API. The server holds your
  Anthropic API key so it never reaches the browser; the client only ever
  sends note text to *your own* server, which forwards it to Claude.

When you click **"Organize with AI"** on a note, or **"Organize all"**, the
client sends the relevant notes' title + content to the server, which asks
Claude to return, per note:

- a `category` (reusing existing categories where they fit)
- up to 5 `tags`
- a 1–2 sentence `summary`

Those get written back onto the note and saved to `localStorage`.

## Setup

You'll need [Node.js](https://nodejs.org/) 18+ and an
[Anthropic API key](https://console.anthropic.com/settings/keys).

```bash
# 1. Install dependencies for both the server and client
npm run install:all

# 2. Configure your API key
cp server/.env.example server/.env
# then edit server/.env and paste in your ANTHROPIC_API_KEY

# 3. Run both the API server and the web app
npm run dev
```

This starts:

- the API server at `http://localhost:3001`
- the web app at `http://localhost:5173` (open this in your browser)

The Vite dev server proxies `/api/*` requests to the Express server, so the
app "just works" against `http://localhost:5173`.

## Production build

```bash
npm run build   # builds server (dist/) and client (client/dist)
npm start       # runs the Express server, which also serves the built client
```

Then visit `http://localhost:3001` (or whatever `PORT` you set in
`server/.env`).

## Project layout

```
client/                  React + Vite frontend
  src/
    App.tsx               main app state & layout
    components/            NoteEditor, NoteCard, Sidebar
    lib/storage.ts         localStorage read/write
    lib/api.ts              calls the /api/organize endpoint

server/                  Express API
  src/
    index.ts               app entrypoint
    anthropic.ts            Claude prompt + response parsing
    routes/organize.ts      POST /api/organize
```

## Notes on privacy

Your notes never leave your browser except when you explicitly click
"Organize with AI" / "Organize all" — at that point the title and content of
the selected note(s) are sent to your server and then to the Claude API to be
organized. Nothing is stored outside your browser's `localStorage`.
