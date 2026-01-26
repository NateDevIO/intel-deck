# Quick Start Guide

This guide gets you from zero to working app in under 30 minutes.

## Step 1: Project Setup (5 minutes)

```bash
# Create project
npm create vite@latest intel-deck -- --template react
cd intel-deck

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional packages
npm install lucide-react  # Icons
npm install uuid          # For generating IDs
```

## Step 2: Configure Tailwind (2 minutes)

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          600: '#4F46E5',
          700: '#4338CA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

## Step 3: Environment Setup (1 minute)

Create `.env.local` in project root:

```
VITE_CLAUDE_API_KEY=your-api-key-here
```

Add to `.gitignore`:
```
.env.local
```

## Step 4: Create Core Files

### API Service (`src/services/claudeApi.js`)

```javascript
const EXTRACTION_PROMPT = `You are a competitive intelligence analyst. Analyze the following content from a competitor's website and extract structured information.

Return ONLY valid JSON matching this schema (no markdown, no explanation):

{
  "companyName": "string",
  "pricing": {
    "tiers": [
      {
        "name": "string",
        "price": "string",
        "billingPeriod": "string or null",
        "priceModel": "free | per_seat | flat | usage_based | contact_sales",
        "targetCustomer": "string",
        "keyFeatures": ["string"],
        "limitations": ["string"],
        "confidence": "high | medium | low"
      }
    ],
    "hasFreeTier": "boolean",
    "hasEnterpriseTier": "boolean",
    "trialAvailable": "boolean",
    "trialDuration": "string or null"
  },
  "positioning": {
    "tagline": "string or null",
    "targetCustomers": ["string"],
    "differentiators": ["string"],
    "valuePropositions": ["string"]
  },
  "socialProof": {
    "customerLogos": ["string"],
    "metricsClaimed": ["string"],
    "partnerships": ["string"]
  },
  "callsToAction": {
    "primary": "string",
    "secondary": ["string"]
  }
}

SOURCE CONTENT:
---
{content}
---`;

export async function analyzeContent(content) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
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
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  
  // Parse JSON, handling potential markdown wrapping
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse response');
  }
}
```

### Main App (`src/App.jsx`)

```javascript
import { useState } from 'react';
import { analyzeContent } from './services/claudeApi';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeContent(input);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Intel Deck</h1>
          <p className="text-sm text-gray-500">Competitive Intelligence Extractor</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste competitor content
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste pricing page content, product descriptions, or marketing copy..."
            className="w-full h-48 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Analyze Content
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Analysis Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">{analysis.companyName}</h2>
              {analysis.positioning?.tagline && (
                <p className="text-gray-600 mt-1">"{analysis.positioning.tagline}"</p>
              )}
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis.pricing?.tiers?.map((tier, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{tier.price}</p>
                    {tier.billingPeriod && (
                      <p className="text-xs text-gray-500">{tier.billingPeriod}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">{tier.targetCustomer}</p>
                    <ul className="mt-3 space-y-1">
                      {tier.keyFeatures?.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-xs text-gray-600">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Positioning Card */}
            {analysis.positioning && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Positioning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Target Customers</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.positioning.targetCustomers?.map((customer, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {customer}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Differentiators</h4>
                    <ul className="space-y-1">
                      {analysis.positioning.differentiators?.map((diff, i) => (
                        <li key={i} className="text-sm text-gray-600">• {diff}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Social Proof Card */}
            {analysis.socialProof && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Proof</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.socialProof.customerLogos?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Logos</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.socialProof.customerLogos.map((logo, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                            {logo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.socialProof.metricsClaimed?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Metrics Claimed</h4>
                      <ul className="space-y-1">
                        {analysis.socialProof.metricsClaimed.map((metric, i) => (
                          <li key={i} className="text-sm text-gray-600">{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.socialProof.partnerships?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Partnerships</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.socialProof.partnerships.map((partner, i) => (
                          <span key={i} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

## Step 5: Run It

```bash
npm run dev
```

Open http://localhost:5173 and paste this test content:

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

## What You've Built

After these steps, you have:
- ✅ Working text input → AI extraction pipeline
- ✅ Structured display of pricing, positioning, social proof
- ✅ Clean, professional UI
- ✅ Error handling

## Next Steps

Refer to `DEVELOPMENT_SOP.md` for:
- Adding localStorage persistence
- Building comparison mode
- Export functionality
- Advanced features
