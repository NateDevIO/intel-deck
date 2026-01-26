# Intel Deck

**Competitive Intelligence Extractor**

A web application that analyzes competitor websites, pricing pages, and marketing materials to extract structured competitive intelligence. Built as a portfolio project demonstrating AI integration, modern React development, and product thinking.

---

## The Problem

Sales teams spend hours manually reading competitor websites, copying information into spreadsheets, and creating battlecards. This tool automates that process—paste content, get structured intelligence in seconds.

## The Solution

Intel Deck uses Claude's API to intelligently extract:

- **Pricing structure** — Tiers, models, enterprise options
- **Positioning** — Target customers, differentiators, value props
- **Social proof** — Customer logos, metrics, partnerships
- **CTAs** — What competitors want visitors to do

Output is structured, exportable, and comparable across competitors.

---

## Documentation

| File | Purpose |
|------|---------|
| `DEVELOPMENT_SOP.md` | Complete development guide with architecture, schemas, and build sequence |
| `QUICK_START.md` | Get running in 30 minutes |
| `COMPONENT_SPECS.md` | Detailed UI component specifications |
| `EXPORT_TEMPLATES.md` | Templates for all export formats |
| `sample-data/notion-analysis.json` | Example extraction output for testing |

---

## Quick Start

```bash
# Clone and install
npm create vite@latest intel-deck -- --template react
cd intel-deck
npm install
npm install -D tailwindcss postcss autoprefixer lucide-react

# Configure
echo "VITE_CLAUDE_API_KEY=your-key" > .env.local

# Run
npm run dev
```

See `QUICK_START.md` for complete setup instructions.

---

## Features

### MVP (Phase 1-2)
- [x] Text paste input
- [ ] Claude API extraction
- [ ] Structured display cards
- [ ] Local storage persistence
- [ ] Confidence indicators

### Enhanced (Phase 3-4)
- [ ] Multi-competitor comparison table
- [ ] Markdown export
- [ ] Slack format export
- [ ] PDF battlecard generation
- [ ] Copy-to-clipboard

### Future (Phase 5+)
- [ ] URL scraping
- [ ] File upload (PDF, DOCX)
- [ ] Change tracking
- [ ] Cloud sync
- [ ] Team sharing

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Claude API (Sonnet)
- **Storage:** localStorage → Supabase

---

## Demo Content

Test the app with this sample (Notion pricing):

```
Notion Pricing

Free - $0
For individuals organizing their work and life.
- Unlimited pages & blocks
- Share with up to 5 guests

Plus - $10 per seat/month
For small teams and professionals.
- Everything in Free
- Unlimited file uploads
- 30-day page history

Business - $18 per seat/month
For companies using Notion to connect teams.
- SAML SSO
- Private teamspaces

Enterprise - Contact sales
For organizations needing advanced controls.
- Unlimited page history
- Dedicated success manager

Trusted by Toyota, Spotify, and 50,000+ teams worldwide.
```

---

## Portfolio Context

This project demonstrates:

1. **AI Integration** — Structured extraction with prompt engineering
2. **Product Thinking** — Solving a real business problem
3. **Modern React** — Hooks, components, state management
4. **UX Design** — Professional, data-dense interfaces
5. **Full-Stack Awareness** — API integration, data schemas, export formats

Target roles: Sales Engineer, Business Analyst, Frontend Developer

---

## License

MIT
