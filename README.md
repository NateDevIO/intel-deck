# Intel Deck

**AI-powered competitive intelligence that transforms competitor websites into actionable battlecards.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://intel-deck.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![Claude AI](https://img.shields.io/badge/Claude-API-orange)](https://anthropic.com)

[Live Demo](https://intel-deck.vercel.app) | [Features](#features) | [Quick Start](#quick-start) | [Screenshots](#screenshots)

---

## The Problem

Sales teams spend **2-3 hours per competitor** manually researching pricing pages, copying information into spreadsheets, and formatting battlecards. This process repeats every time a competitor updates their pricing, and the information quickly becomes stale.

## The Solution

Intel Deck automates competitive intelligence extraction in **under 2 minutes**. Paste a URL, get a structured battlecard with pricing tiers, positioning, features, social proof, and AI-generated insights.

| Metric | Manual Process | Intel Deck |
|--------|---------------|------------|
| Time per competitor | 2-3 hours | < 2 minutes |
| Update frequency | Quarterly (outdated) | On-demand (always current) |
| Consistency | Variable by analyst | Standardized structure |
| Cost per analysis | $50-100 (analyst time) | ~$0.03 (API costs) |

---

## Screenshots

### Analysis View
Extract structured pricing, positioning, and features from any competitor's website.

![Analysis View](docs/screenshots/02-analysis-view.png)

### Comparison View
Compare multiple competitors side-by-side with AI-generated strategic insights.

![Comparison View](docs/screenshots/03-comparison-view.png)

### Dark Mode
Full dark mode support for comfortable viewing in any environment.

![Dark Mode](docs/screenshots/04-dark-mode.png)

### Mobile Responsive
Works seamlessly on mobile devices with dedicated navigation.

<img src="docs/screenshots/05-mobile.png" alt="Mobile View" width="300">

### Keyboard Shortcuts
Power user shortcuts for efficient navigation.

![Keyboard Shortcuts](docs/screenshots/06-keyboard-shortcuts.png)

---

## Features

### Core Intelligence
- **URL Analysis** - Paste any competitor's pricing or product page
- **Batch Analysis** - Analyze up to 10 competitors at once with progress tracking
- **AI Extraction** - Claude AI extracts pricing, positioning, features, and social proof
- **Multi-dimensional Pricing** - Handles complex pricing models (seat-based, usage-based, custom)
- **Confidence Scoring** - Click to see exactly what data was found vs missing

### AI-Powered Insights
- **SWOT Analysis** - Auto-generated strengths, weaknesses, opportunities, threats
- **Sales Talking Points** - AI-generated objection handlers and competitive positioning
- **Comparison Summary** - Strategic analysis when comparing multiple competitors
- **Trend Detection** - Tracks pricing and feature changes over time

### Sales Enablement
- **Win/Loss Tracking** - Log deal outcomes against each competitor with win rate analytics
- **Price History Charts** - Visualize competitor pricing changes over time
- **Positioning Matrix** - 2x2 grid plotting competitors on Price vs Features axes
- **Competitor Library** - Save and organize multiple competitor analyses

### User Experience
- **Dark Mode** - Full dark mode support throughout the application
- **Mobile Responsive** - Dedicated mobile navigation and layouts
- **Keyboard Shortcuts** - Press `?` to see all available shortcuts
- **Onboarding Flow** - First-time user guidance with example URLs
- **Batch Error Recovery** - Failed URLs tracked with retry option

### Export & Integration
- **Markdown** - For docs, wikis, and collaboration tools
- **Slack Message** - Pre-formatted for team channels
- **JSON** - For CRM and tool integrations
- **PDF Battlecard** - Print-ready competitive intelligence

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, Vite 7 |
| Styling | Tailwind CSS v4 |
| AI | Claude API (Anthropic) |
| URL Parsing | Jina AI Reader (primary), Browserless.io (fallback) |
| Deployment | Vercel Serverless Functions |
| Icons | Lucide React |

---

## Quick Start

### Local Development

```bash
# Clone and install
git clone https://github.com/NateDevIO/intel-deck.git
cd intel-deck
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API key:
# VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Start development
npm run dev
```

Open http://localhost:5173

### Getting an API Key

1. Sign up at [console.anthropic.com](https://console.anthropic.com/)
2. Create an API key
3. Add to your `.env.local` file

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**

2. **Import to Vercel**
   - Connect your GitHub repo
   - Framework preset: Vite (auto-detected)

3. **Add Environment Variables**

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `CLAUDE_API_KEY` | Yes | Anthropic API key (no VITE_ prefix) |
   | `BROWSERLESS_TOKEN` | No | For JS-heavy sites |

   **Important:** Use `CLAUDE_API_KEY` (not `VITE_CLAUDE_API_KEY`) for Vercel. This keeps the key server-side and secure.

4. **Deploy** - Auto-deploys on every push to main

---

## Usage Guide

1. **Analyze** - Enter a pricing page URL (e.g., `slack.com/pricing`)
2. **Review** - Check extracted pricing, positioning, and features
3. **Enhance** - SWOT analysis and talking points generate automatically
4. **Save** - Add to your competitor library for tracking
5. **Compare** - Select 2+ competitors for side-by-side analysis
6. **Track** - Log wins/losses to see patterns over time
7. **Export** - Share in your preferred format

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New analysis |
| `Ctrl+S` | Save current analysis |
| `Ctrl+Enter` | Submit URL |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modals |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ URL Input   │  │  Analysis   │  │   Comparison View   │  │
│  │ (Single/    │  │    View     │  │   + AI Summary +    │  │
│  │   Batch)    │  │  + SWOT     │  │ Positioning Matrix  │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────▼─────────────────▼─────────────────────▼──────────┐ │
│  │         State Management (hooks + localStorage)         │ │
│  │  • useCompetitors (CRUD + price history)                │ │
│  │  • useDarkMode, useKeyboardShortcuts                    │ │
│  └──────────────────────────┬──────────────────────────────┘ │
└─────────────────────────────┼───────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Vercel Serverless │
                    │     Functions      │
                    │  ┌──────────────┐  │
                    │  │ /api/claude  │◄─┼── Claude API (secure)
                    │  └──────────────┘  │
                    │  ┌──────────────┐  │
                    │  │/api/fetch-url│◄─┼── Browserless (optional)
                    │  └──────────────┘  │
                    └────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────────┐
        │ Jina AI  │   │  Claude  │   │ Browserless  │
        │ (Free)   │   │   API    │   │  (Optional)  │
        └──────────┘   └──────────┘   └──────────────┘
```

---

## Project Structure

```
.
├── api/                      # Vercel serverless functions
│   ├── claude.js            # Claude API proxy (keeps key secure)
│   └── fetch-url.js         # Browserless proxy for JS-heavy sites
├── src/
│   ├── components/
│   │   ├── analysis/        # Analysis cards, charts, SWOT
│   │   ├── common/          # Button, Modal, Loading states
│   │   ├── comparison/      # Side-by-side view, matrix
│   │   ├── export/          # Export menu, format handlers
│   │   ├── input/           # URL input, batch mode
│   │   └── layout/          # Header, Sidebar
│   ├── hooks/               # useCompetitors, useDarkMode, etc.
│   ├── services/            # Claude API, URL fetching
│   └── utils/               # Export templates, trend analysis
├── docs/
│   ├── screenshots/         # README screenshots
│   └── specs/               # Development specifications
├── scripts/                  # Build & capture scripts
└── public/                   # Static assets
```

---

## API Costs

| Service | Usage | Cost |
|---------|-------|------|
| Claude API | ~4K tokens/analysis | ~$0.01-0.03 |
| Jina AI | URL parsing | Free |
| Browserless | JS rendering (optional) | Pay-as-you-go |

Typical: **~$0.03 per competitor analysis**

---

## Why I Built This

Competitive intelligence is one of the last manual processes in modern sales organizations. CRMs are automated, outreach is sequenced, forecasting uses AI - but battlecard creation still involves copying and pasting from competitor websites.

This project demonstrates:

1. **Full-stack Product Development** - From concept to deployed production application
2. **AI Integration** - Practical use of LLMs for structured data extraction
3. **Sales Domain Knowledge** - Understanding what information sales teams actually need
4. **User Experience Focus** - Making complex data accessible and actionable
5. **Production-Grade Architecture** - Secure API handling, error recovery, responsive design

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Credits

Built by [Nate](https://github.com/NateDevIO)

Powered by [Claude](https://anthropic.com) | [React](https://react.dev) | [Tailwind CSS](https://tailwindcss.com) | [Vercel](https://vercel.com)
