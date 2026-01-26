const EXTRACTION_PROMPT = `You are a competitive intelligence analyst. Analyze the following content from a competitor's website and extract structured information.

IMPORTANT: For pricing tiers, you MUST extract the actual numerical price if present (e.g., "$10", "$15/month", "€99/year"). Look for patterns like:
- Dollar/currency amounts: $10, €15, £20
- Per-unit pricing: $10/user, $15/seat, $99/member
- Monthly/annual: $10/month, $120/year, $8 billed annually
If a price appears as both monthly and annual, prefer the monthly price.

MULTI-DIMENSIONAL PRICING: Some products have multiple pricing dimensions (e.g., different seat types like "Viewer", "Editor", "Full seat" OR different modules). When you detect this:
1. Set "hasSeatTypes" to true and list all seat/license types in "seatTypes"
2. For each tier, include ALL seat type prices in the "seatPrices" object
3. Use the most comprehensive seat type (full access) as the main "price" field

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "companyName": "string - inferred company name",
  "pricing": {
    "tiers": [
      {
        "name": "string",
        "price": "string (include currency symbol) - use most comprehensive seat type if multiple exist",
        "billingPeriod": "string or null (e.g., 'per user/month')",
        "priceModel": "free | per_seat | flat | usage_based | contact_sales",
        "targetCustomer": "string - who this tier is for",
        "keyFeatures": ["string"],
        "limitations": ["string"],
        "confidence": "high | medium | low",
        "seatPrices": "object or null - e.g., {'Full seat': '$15', 'Editor': '$10', 'Viewer': 'Free'}"
      }
    ],
    "hasSeatTypes": "boolean - true if multiple seat/license types exist",
    "seatTypes": ["string - list of seat types if hasSeatTypes is true, e.g., 'Full seat', 'Dev seat', 'Viewer'"],
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

export async function analyzeContent(content) {
  // Check if we have a direct API key (local development)
  const directApiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  const prompt = EXTRACTION_PROMPT.replace('{content}', content);

  let response;

  if (directApiKey) {
    // Direct API call (local development)
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': directApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });
  } else {
    // Proxy call (production on Vercel)
    response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        maxTokens: 4096
      })
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
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
