# Competitive Intel Extractor - Development SOP

## Project Overview

**App Name:** Competitive Intel Extractor (working title: "Intel Deck")

**Purpose:** A web application that analyzes competitor websites, pricing pages, and marketing materials to extract structured competitive intelligence. Users input a URL, paste text, or upload documents, and the app returns a structured "battlecard" with pricing, features, positioning, and social proof—ready for sales teams to use.

**Target Users:** Sales engineers, account executives, product marketers, competitive intelligence analysts.

**Portfolio Story:** "Sales teams waste hours manually reading competitor pages and building battlecards. This tool does it in seconds, with structured output you can export and share."

---

## Core Features

### 1. Input Methods

| Method | Description | Priority |
|--------|-------------|----------|
| Paste Text | User pastes content from any source | P0 (MVP) |
| URL Fetch | User provides URL, app scrapes content | P1 |
| File Upload | Accept PDF, DOCX, TXT files | P2 |

### 2. Extraction Categories

The AI extracts and structures the following from input content:

#### Pricing Intelligence
- Tier names and prices
- Billing models (monthly/annual, per-seat, usage-based, flat rate)
- Enterprise/custom pricing signals ("Contact Sales")
- Free tier or trial availability
- Price anchoring tactics

#### Feature Claims
- Features listed per tier
- Feature limitations by tier
- Highlighted/promoted features
- Coming soon or beta features

#### Positioning & Messaging
- Target customer descriptions
- Differentiator statements ("Unlike X, we...")
- Value propositions
- Taglines and key phrases

#### Social Proof
- Customer logos mentioned
- Metrics and statistics cited ("10,000+ teams")
- Case study references
- Awards or recognition
- Integration partnerships

#### Calls to Action
- Primary CTA (what they want users to do)
- Secondary CTAs
- Urgency language

### 3. Comparison Mode

- Save multiple competitor analyses
- Generate side-by-side comparison matrix
- Highlight gaps and overlaps
- Track changes over time ("Last analyzed X days ago")

### 4. Export Options

| Format | Use Case |
|--------|----------|
| Copy as Markdown | Paste into Notion, docs |
| Copy as Slack Message | Quick team sharing |
| Download PDF Battlecard | Formal documentation |
| Export JSON | Integration with other tools |

---

## Technical Architecture

### Stack

```
Frontend:  React 18 + Vite
Styling:   Tailwind CSS
AI:        Claude API (Sonnet)
Storage:   localStorage (MVP) → Supabase (future)
Scraping:  Cheerio (static) or paste-only for MVP
```

### Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Container.jsx
│   ├── input/
│   │   ├── InputPanel.jsx
│   │   ├── UrlInput.jsx
│   │   ├── TextPasteArea.jsx
│   │   └── FileUpload.jsx
│   ├── analysis/
│   │   ├── AnalysisView.jsx
│   │   ├── PricingCard.jsx
│   │   ├── FeaturesCard.jsx
│   │   ├── PositioningCard.jsx
│   │   ├── SocialProofCard.jsx
│   │   ├── CtaCard.jsx
│   │   └── ConfidenceBadge.jsx
│   ├── comparison/
│   │   ├── ComparisonTable.jsx
│   │   ├── CompetitorColumn.jsx
│   │   └── AddCompetitorButton.jsx
│   ├── export/
│   │   ├── ExportMenu.jsx
│   │   ├── BattlecardPreview.jsx
│   │   └── CopyButton.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── LoadingSpinner.jsx
│       ├── EmptyState.jsx
│       └── Toast.jsx
├── hooks/
│   ├── useAnalysis.js
│   ├── useCompetitors.js
│   ├── useExport.js
│   └── useLocalStorage.js
├── services/
│   ├── claudeApi.js
│   ├── scraper.js
│   └── pdfParser.js
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── exportTemplates.js
├── data/
│   ├── sampleAnalysis.json
│   └── demoContent.js
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```

### Data Schema

```javascript
// Single competitor analysis
{
  id: "uuid-v4",
  companyName: "Notion",
  sourceUrl: "https://notion.so/pricing",
  sourceType: "url" | "paste" | "file",
  analyzedAt: "2025-01-13T10:30:00Z",
  
  extraction: {
    pricing: {
      tiers: [
        {
          name: "Free",
          price: "$0",
          billingPeriod: null,
          priceModel: "free",
          targetCustomer: "Individuals",
          keyFeatures: ["Unlimited pages", "Share with 5 guests"],
          limitations: ["7-day page history", "10 file uploads"],
          confidence: "high"
        },
        {
          name: "Plus",
          price: "$10",
          billingPeriod: "per user/month",
          priceModel: "per_seat",
          targetCustomer: "Small teams",
          keyFeatures: ["Unlimited file uploads", "30-day page history"],
          limitations: [],
          confidence: "high"
        }
        // ... more tiers
      ],
      hasFreeTier: true,
      hasEnterpriseTier: true,
      trialAvailable: true,
      trialDuration: "14 days"
    },
    
    features: {
      highlighted: ["AI-powered search", "Real-time collaboration"],
      byTier: {
        "Free": ["Basic blocks", "Templates"],
        "Plus": ["Everything in Free", "Unlimited file uploads"]
      }
    },
    
    positioning: {
      tagline: "Your wiki, docs, & projects. Together.",
      targetCustomers: ["Startups", "Remote teams", "Product teams"],
      differentiators: [
        "All-in-one workspace replacing multiple tools",
        "Flexible building blocks for any workflow"
      ],
      valuePropositions: [
        "Replace your scattered tools with one workspace"
      ]
    },
    
    socialProof: {
      customerLogos: ["Toyota", "Spotify", "IBM"],
      metricsClaimed: ["10M+ users", "50,000+ teams"],
      caseStudies: ["How Spotify built their design system in Notion"],
      awards: [],
      partnerships: ["Slack", "Google Drive", "Zapier"]
    },
    
    callsToAction: {
      primary: "Get Notion free",
      secondary: ["Request a demo", "Contact sales"],
      urgencyLanguage: null
    },
    
    extractedQuotes: [
      {
        text: "Your wiki, docs, & projects. Together.",
        category: "positioning",
        location: "Hero section"
      }
    ]
  },
  
  rawContent: "..." // Original text for re-analysis
}
```

---

## Claude API Integration

### Extraction Prompt Template

```javascript
const EXTRACTION_PROMPT = `You are a competitive intelligence analyst. Analyze the following content from a competitor's website and extract structured information.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "companyName": "string - inferred company name",
  "pricing": {
    "tiers": [
      {
        "name": "string",
        "price": "string (include currency symbol)",
        "billingPeriod": "string or null (e.g., 'per user/month')",
        "priceModel": "free | per_seat | flat | usage_based | contact_sales",
        "targetCustomer": "string - who this tier is for",
        "keyFeatures": ["string"],
        "limitations": ["string"],
        "confidence": "high | medium | low"
      }
    ],
    "hasFreeTier": boolean,
    "hasEnterpriseTier": boolean,
    "trialAvailable": boolean,
    "trialDuration": "string or null"
  },
  "features": {
    "highlighted": ["string - features they emphasize"],
    "byTier": {
      "TierName": ["string - features in this tier"]
    }
  },
  "positioning": {
    "tagline": "string or null",
    "targetCustomers": ["string"],
    "differentiators": ["string - what they claim makes them unique"],
    "valuePropositions": ["string"]
  },
  "socialProof": {
    "customerLogos": ["string - company names"],
    "metricsClaimed": ["string - statistics they cite"],
    "caseStudies": ["string - case study titles or references"],
    "awards": ["string"],
    "partnerships": ["string - integration partners"]
  },
  "callsToAction": {
    "primary": "string - main CTA",
    "secondary": ["string"],
    "urgencyLanguage": "string or null"
  },
  "extractedQuotes": [
    {
      "text": "string - exact quote from source",
      "category": "pricing | positioning | social_proof | feature",
      "location": "string - where on page (if determinable)"
    }
  ]
}

If a field cannot be determined from the content, use null for strings, empty arrays for lists, or "low" confidence and your best inference.

SOURCE CONTENT:
---
{content}
---`;
```

### API Service

```javascript
// src/services/claudeApi.js

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function analyzeContent(content, apiKey) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: EXTRACTION_PROMPT.replace('{content}', content)
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const extractedText = data.content[0].text;
  
  // Parse JSON from response
  try {
    return JSON.parse(extractedText);
  } catch (e) {
    // Handle cases where Claude adds explanation
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse extraction response');
  }
}
```

---

## Visual Design System

### Design Principles

1. **Professional & Trustworthy** - This is a business tool, not a toy. Clean, minimal, confident.
2. **Data-Dense but Scannable** - Show a lot of information without overwhelming.
3. **Credibility Through Transparency** - Show sources, confidence levels, timestamps.

### Color Palette

```css
:root {
  /* Primary */
  --color-primary-600: #4F46E5; /* Indigo - primary actions */
  --color-primary-700: #4338CA; /* Hover state */
  --color-primary-50: #EEF2FF;  /* Light backgrounds */

  /* Neutrals */
  --color-gray-900: #111827;    /* Primary text */
  --color-gray-700: #374151;    /* Secondary text */
  --color-gray-500: #6B7280;    /* Tertiary text */
  --color-gray-200: #E5E7EB;    /* Borders */
  --color-gray-100: #F3F4F6;    /* Card backgrounds */
  --color-gray-50: #F9FAFB;     /* Page background */

  /* Semantic */
  --color-success: #059669;     /* High confidence, positive */
  --color-warning: #D97706;     /* Medium confidence */
  --color-error: #DC2626;       /* Low confidence, errors */

  /* Accents for competitor comparison */
  --color-competitor-1: #8B5CF6; /* Purple */
  --color-competitor-2: #06B6D4; /* Cyan */
  --color-competitor-3: #F59E0B; /* Amber */
  --color-competitor-4: #EC4899; /* Pink */
}
```

### Typography

```css
/* Use Inter font family */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-gray-900);
}

h1 { font-size: 24px; font-weight: 700; }
h2 { font-size: 18px; font-weight: 600; }
h3 { font-size: 16px; font-weight: 600; }
h4 { font-size: 14px; font-weight: 600; }

.text-secondary { color: var(--color-gray-700); }
.text-tertiary { color: var(--color-gray-500); }
```

### Component Styling

#### Cards
```css
.card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-gray-100);
}
```

#### Confidence Badges
```css
.confidence-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.confidence-high {
  background: #D1FAE5;
  color: #065F46;
}

.confidence-medium {
  background: #FEF3C7;
  color: #92400E;
}

.confidence-low {
  background: #FEE2E2;
  color: #991B1B;
}
```

#### Tables (for comparison view)
```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th {
  text-align: left;
  padding: 12px 16px;
  background: var(--color-gray-50);
  border-bottom: 2px solid var(--color-gray-200);
  font-weight: 600;
}

.comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: top;
}

.comparison-table tr:hover td {
  background: var(--color-gray-50);
}
```

---

## UX Features & Improvements

### 1. Empty State with Example

Before any analysis, show a pre-loaded example analysis so users immediately understand the value. Use a fake company or a cached analysis of a well-known pricing page.

```jsx
// Show this when no analyses exist
<EmptyState
  icon={<SearchIcon />}
  title="Analyze your first competitor"
  description="Paste a competitor's pricing page content or enter a URL to generate a structured battlecard."
  action={<Button onClick={loadExample}>See Example Analysis</Button>}
/>
```

### 2. Loading State with Progress

Don't just show a spinner. Show what's happening:

```
[████████░░░░░░░░] Extracting pricing information...
[████████████░░░░] Analyzing positioning language...
[████████████████] Structuring battlecard...
```

### 3. Inline Source Citations

Every extracted data point should be traceable:

```jsx
<ExtractedItem>
  <Value>$10/user/month</Value>
  <Citation onClick={highlightSource}>
    "Plus plan starts at $10 per member, per month"
  </Citation>
</ExtractedItem>
```

### 4. Quick Copy Interactions

Each card should have a "Copy" button that copies just that section in a formatted way:

```
📊 Notion Pricing
- Free: $0 (Individuals)
- Plus: $10/user/mo (Small teams)  
- Business: $18/user/mo (Companies)
- Enterprise: Contact sales
```

### 5. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + V` | Focus paste area (when empty) |
| `Cmd/Ctrl + Enter` | Submit for analysis |
| `Cmd/Ctrl + E` | Open export menu |
| `Cmd/Ctrl + N` | New analysis |

### 6. Comparison Diff Highlighting

When viewing comparison table, visually highlight:
- **Green**: Features/pricing unique to this competitor
- **Red**: Features they're missing that others have
- **Yellow**: Significant price differences

### 7. Change Tracking

When re-analyzing a previously saved competitor:

```jsx
<ChangeIndicator type="price_increase">
  Plus tier: $8/mo → $10/mo (+25%)
  Changed since last analysis (Dec 15, 2024)
</ChangeIndicator>
```

### 8. Smart Defaults

- Auto-detect company name from URL (notion.so → "Notion")
- Remember last used export format
- Auto-save analyses to localStorage
- Suggest re-analysis after 30 days

### 9. Error Recovery

If extraction partially fails, show what was successfully extracted and offer to retry failed sections:

```jsx
<PartialResult>
  <SuccessSection>Pricing extracted successfully</SuccessSection>
  <FailedSection>
    Could not extract social proof
    <RetryButton>Retry this section</RetryButton>
  </FailedSection>
</PartialResult>
```

### 10. Onboarding Tooltip Tour

First-time users see a brief tooltip tour:
1. "Paste competitor content here"
2. "View structured extraction in these cards"
3. "Save and compare multiple competitors"
4. "Export as battlecard when ready"

---

## Build Sequence

### Phase 1: Core Extraction (MVP)

1. Set up React + Vite + Tailwind project
2. Build text paste input component
3. Implement Claude API integration with extraction prompt
4. Create display cards for each extraction category
5. Add loading and error states
6. Test with Notion pricing page content

**Deliverable:** Working app that accepts pasted text and displays structured analysis.

### Phase 2: Polish & Storage

1. Add localStorage persistence for analyses
2. Build saved competitors list/sidebar
3. Implement delete and re-analyze functions
4. Add confidence badges throughout
5. Create empty state with example
6. Refine visual design

**Deliverable:** Usable single-user app with persistence.

### Phase 3: Comparison Features

1. Build comparison table component
2. Implement multi-select for comparison
3. Add visual diff highlighting
4. Create comparison export format

**Deliverable:** Full comparison functionality.

### Phase 4: Export & Sharing

1. Build export menu component
2. Implement Markdown export
3. Implement Slack-formatted export
4. Create PDF battlecard template
5. Add copy-to-clipboard with toast feedback

**Deliverable:** Complete export suite.

### Phase 5: Advanced Features (Post-MVP)

1. URL scraping with Puppeteer/API
2. File upload (PDF, DOCX)
3. Change tracking between analyses
4. Supabase backend for cloud sync
5. Team sharing features

---

## Testing Approach

### Manual Testing Checklist

For each release, test with:

1. **Notion pricing page** - Clean, well-structured (baseline)
2. **HubSpot pricing page** - Complex, multi-product (stress test)
3. **Slack pricing page** - Medium complexity (standard case)
4. **Poorly formatted content** - Test error handling
5. **Empty/minimal content** - Test edge cases

### Key Test Scenarios

- [ ] Paste valid pricing page content → structured extraction appears
- [ ] Paste irrelevant content → graceful error/partial result
- [ ] Submit empty input → validation error
- [ ] API key missing/invalid → helpful error message
- [ ] Save analysis → persists after refresh
- [ ] Delete analysis → removed from storage
- [ ] Compare 2+ competitors → table renders correctly
- [ ] Export to each format → correct output

---

## Demo Script

When presenting this project (interview, portfolio review):

### Opening (10 seconds)
"Sales teams spend hours manually reviewing competitor websites to build battlecards. This tool does it in seconds."

### Demo Flow (60 seconds)
1. Show empty state with example analysis (credibility)
2. Paste Notion pricing page content
3. Click analyze, show loading states
4. Walk through extraction cards (pricing, positioning, social proof)
5. Show confidence indicators and source citations
6. Quick demo of comparison view with pre-loaded competitor
7. Export as Markdown, show formatted output

### Closing (10 seconds)
"Built with React and Claude's API. The structured extraction prompt is the interesting technical piece—happy to walk through that."

---

## Environment Variables

```env
# .env.local (do not commit)
VITE_CLAUDE_API_KEY=sk-ant-xxxxx
```

---

## Resources

- [Claude API Documentation](https://docs.anthropic.com/en/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Inter Font](https://fonts.google.com/specimen/Inter)

---

## Appendix: Sample Content for Testing

### Notion Pricing Page (Paste this for testing)

```
Notion Pricing

Free
$0
For individuals organizing their work and life.
- Unlimited pages & blocks
- Share with up to 5 guests
- Sync across devices
- 7-day page history

Plus
$10 per seat/month billed annually
$12 billed monthly
For small teams and professionals.
- Everything in Free
- Unlimited file uploads
- 30-day page history
- Invite up to 100 guests

Business
$18 per seat/month billed annually
For companies using Notion to connect teams.
- Everything in Plus
- SAML SSO
- Private teamspaces
- 90-day page history
- PDF export with subpages

Enterprise
Contact sales
For organizations needing advanced controls.
- Everything in Business
- Unlimited page history
- User provisioning (SCIM)
- Advanced security controls
- Dedicated success manager

Trusted by teams at Toyota, Spotify, IBM, and 50,000+ organizations worldwide.
"Notion is the connective tissue that keeps our fully remote team in sync." - Head of Operations, Figma
```
