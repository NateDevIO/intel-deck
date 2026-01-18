# Intel Deck

AI-powered competitive intelligence tool that transforms competitor websites into structured battlecards for sales teams.

## Features

- **URL Analysis** - Paste any competitor's pricing or product page URL
- **AI Extraction** - Claude AI extracts pricing, positioning, features, and social proof
- **Multi-dimensional Pricing** - Handles complex pricing (multiple seat types, usage tiers)
- **SWOT Analysis** - Auto-generated strengths, weaknesses, opportunities, threats
- **Sales Talking Points** - AI-generated competitive positioning for sales calls
- **Competitor Library** - Save and organize multiple competitor analyses
- **Side-by-Side Comparison** - Compare two competitors directly
- **Multiple Export Formats**:
  - Markdown (for docs/wikis)
  - Slack message (formatted for channels)
  - JSON (for integrations)
  - PDF battlecard (print-ready)

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **AI**: Claude API (Anthropic)
- **URL Fetching**: Jina AI Reader (primary) + Browserless.io (fallback for JS-heavy sites)
- **Icons**: Lucide React

## Quick Start

1. **Clone and install**
   ```bash
   cd intel-deck
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Claude API key:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:5173

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CLAUDE_API_KEY` | Yes | Your Anthropic API key ([get one](https://console.anthropic.com/)) |
| `VITE_BROWSERLESS_TOKEN` | No | Browserless.io token for JS-heavy sites ([get one](https://www.browserless.io/)) |
| `VITE_BROWSERLESS_PROXY_URL` | No* | Cloudflare Worker proxy URL (required if using Browserless) |

*See [Browserless Setup](#browserless-setup-optional) below.

## Browserless Setup (Optional)

Some websites (like Notion, Linear) render pricing with JavaScript. Browserless.io provides headless Chrome rendering as a fallback.

1. Get a free Browserless token at https://www.browserless.io/ (1000 requests/month)

2. Deploy the CORS proxy (Browserless doesn't support browser requests directly):
   - Go to https://workers.cloudflare.com/
   - Create a new Worker
   - Paste the code from `cloudflare-worker/worker.js`
   - Deploy and copy your Worker URL

3. Add to `.env.local`:
   ```
   VITE_BROWSERLESS_TOKEN=your-token-here
   VITE_BROWSERLESS_PROXY_URL=https://your-worker.workers.dev
   ```

## Usage

1. **Analyze a competitor**: Paste a pricing page URL (e.g., `https://slack.com/pricing`)
2. **Review extraction**: Check the pricing tiers, positioning, and features
3. **Generate insights**: SWOT analysis and talking points are auto-generated
4. **Save to library**: Click "Save" to add to your competitor library
5. **Export**: Use the export menu to share in your preferred format
6. **Compare**: With 2+ saved competitors, use the compare feature

## Project Structure

```
intel-deck/
├── src/
│   ├── components/
│   │   ├── analysis/       # Analysis display components
│   │   ├── common/         # Shared UI components
│   │   ├── comparison/     # Competitor comparison view
│   │   ├── export/         # Export functionality
│   │   ├── input/          # URL input form
│   │   └── layout/         # Header, Sidebar, layout
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API integrations (Claude, URL fetching)
│   └── utils/              # Export templates, helpers
├── cloudflare-worker/      # CORS proxy for Browserless
└── public/
```

## API Usage

The app makes direct API calls to:
- **Claude API** - For content analysis (~4K tokens per analysis)
- **Jina AI** - Free URL-to-markdown conversion
- **Browserless** (optional) - Headless Chrome for JS rendering

Typical usage: ~$0.01-0.03 per competitor analysis with Claude.

## Building for Production

```bash
npm run build
npm run preview  # Test production build locally
```

Output is in `dist/` - deploy to any static hosting (Vercel, Netlify, Cloudflare Pages).

## License

MIT
