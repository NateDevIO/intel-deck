# Intel Deck

AI-powered competitive intelligence tool that transforms competitor websites into structured battlecards for sales teams.

**Live Demo:** [intel-deck.vercel.app](https://intel-deck.vercel.app)

## Features

- **URL Analysis** - Paste any competitor's pricing or product page URL
- **Batch Analysis** - Analyze multiple competitors at once (up to 10 URLs)
- **AI Extraction** - Claude AI extracts pricing, positioning, features, and social proof
- **Multi-dimensional Pricing** - Handles complex pricing (multiple seat types, usage tiers)
- **SWOT Analysis** - Auto-generated strengths, weaknesses, opportunities, threats
- **Sales Talking Points** - AI-generated competitive positioning for sales calls
- **Competitor Library** - Save and organize multiple competitor analyses
- **Side-by-Side Comparison** - Compare two or more competitors directly
- **Dark Mode** - Full dark mode support
- **Mobile Responsive** - Works on mobile devices with dedicated navigation
- **Multiple Export Formats**:
  - Markdown (for docs/wikis)
  - Slack message (formatted for channels)
  - JSON (for integrations)
  - PDF battlecard (print-ready)

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4
- **AI**: Claude API (Anthropic) via Vercel Serverless Functions
- **URL Fetching**: Jina AI Reader (primary) + Browserless.io (fallback for JS-heavy sites)
- **Hosting**: Vercel
- **Icons**: Lucide React

## Quick Start (Local Development)

1. **Clone and install**
   ```bash
   cd intel-deck
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here
   VITE_BROWSERLESS_TOKEN=your-browserless-token (optional)
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:5173

## Deploying to Vercel

The recommended deployment method uses Vercel with serverless functions to keep API keys secure.

1. **Push to GitHub**

2. **Import to Vercel**
   - Connect your GitHub repo to Vercel
   - Set **Root Directory** to `intel-deck`
   - Framework preset: Vite (auto-detected)

3. **Add Environment Variables** (in Vercel Project Settings)

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `CLAUDE_API_KEY` | Yes | Your Anthropic API key (no VITE_ prefix!) |
   | `BROWSERLESS_TOKEN` | No | Browserless.io token for JS-heavy sites |

   **Important:** Use `CLAUDE_API_KEY` (not `VITE_CLAUDE_API_KEY`) for Vercel deployment. This keeps the key server-side and secure.

4. **Deploy** - Vercel will auto-deploy on every push to main

## Environment Variables

### For Local Development (.env.local)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CLAUDE_API_KEY` | Yes | Your Anthropic API key ([get one](https://console.anthropic.com/)) |
| `VITE_BROWSERLESS_TOKEN` | No | Browserless.io token for JS-heavy sites |

### For Vercel Production
| Variable | Required | Description |
|----------|----------|-------------|
| `CLAUDE_API_KEY` | Yes | Your Anthropic API key (server-side, secure) |
| `BROWSERLESS_TOKEN` | No | Browserless.io token (server-side, secure) |

## Usage

1. **Analyze a competitor**: Enter a pricing page URL (e.g., `https://slack.com/pricing`)
2. **Review extraction**: Check the pricing tiers, positioning, and features
3. **Auto-generated insights**: SWOT analysis and talking points generate automatically
4. **Save to library**: Click "Save" to add to your competitor library
5. **Export**: Use the export menu to share in your preferred format
6. **Compare**: With 2+ saved competitors, use the compare feature
7. **Batch analyze**: Use "Batch URLs" tab to analyze multiple competitors at once

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New analysis |
| `Ctrl+S` | Save current analysis |
| `/` | Focus search |

## Project Structure

```
intel-deck/
├── api/                    # Vercel serverless functions
│   ├── claude.js          # Claude API proxy
│   └── fetch-url.js       # Browserless proxy
├── src/
│   ├── components/
│   │   ├── analysis/      # Analysis display components
│   │   ├── common/        # Shared UI components
│   │   ├── comparison/    # Competitor comparison view
│   │   ├── export/        # Export functionality
│   │   ├── input/         # URL input forms
│   │   └── layout/        # Header, Sidebar, layout
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API integrations
│   ├── utils/             # Export templates, helpers
│   └── data/              # Sample data
├── cloudflare-worker/     # Legacy CORS proxy (not needed for Vercel)
└── public/
```

## API Usage & Costs

The app uses:
- **Claude API** - For content analysis (~4K tokens per analysis)
- **Jina AI** - Free URL-to-markdown conversion
- **Browserless** (optional) - Headless Chrome for JS rendering

Typical usage: ~$0.01-0.03 per competitor analysis with Claude.

## Building for Production

```bash
npm run build
npm run preview  # Test production build locally
```

Output is in `dist/` - deploy to Vercel, Netlify, or any static hosting.

## Credits

Coded by Nate

## License

MIT
