// AI-powered generators for SWOT analysis and talking points

const SWOT_PROMPT = `You are a competitive strategy expert. Given information about a competitor and a user's company, generate a SWOT analysis.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "strengths": ["string - our advantages over this competitor"],
  "weaknesses": ["string - areas where competitor has advantage"],
  "opportunities": ["string - market opportunities we can exploit"],
  "threats": ["string - competitive threats they pose"],
  "summary": "string - 2-3 sentence executive summary"
}

YOUR COMPANY:
{myCompany}

COMPETITOR ANALYSIS:
{competitorData}`;

const TALKING_POINTS_PROMPT = `You are a sales enablement expert. Generate talking points and objection handlers for sales reps competing against this competitor.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "elevatorPitch": "string - 30-second pitch positioning against this competitor",
  "keyDifferentiators": [
    {
      "point": "string - our advantage",
      "proof": "string - evidence or example"
    }
  ],
  "objectionHandlers": [
    {
      "objection": "string - what prospect might say about competitor",
      "response": "string - how to handle this objection"
    }
  ],
  "competitiveQuestions": ["string - questions to ask that expose competitor weaknesses"],
  "winThemes": ["string - main themes that help win against this competitor"]
}

YOUR COMPANY:
{myCompany}

COMPETITOR ANALYSIS:
{competitorData}`;

async function callClaudeAPI(prompt) {
  // Check if we have a direct API key (local development)
  const directApiKey = import.meta.env.VITE_CLAUDE_API_KEY;

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
        model: 'claude-sonnet-4-latest',
        max_tokens: 2048,
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
        maxTokens: 2048
      })
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }

  const data = await response.json();
  const extractedText = data.content[0].text;

  try {
    return JSON.parse(extractedText);
  } catch (e) {
    const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse response');
  }
}

export async function generateSWOT(competitorAnalysis, myCompanyInfo) {
  const myCompany = myCompanyInfo?.name
    ? `Name: ${myCompanyInfo.name}\nDescription: ${myCompanyInfo.description || 'N/A'}\nKey Strengths: ${myCompanyInfo.strengths || 'N/A'}`
    : 'No company information provided - generate general competitive insights';

  const competitorData = JSON.stringify({
    name: competitorAnalysis.companyName,
    pricing: competitorAnalysis.pricing,
    positioning: competitorAnalysis.positioning,
    features: competitorAnalysis.features,
    socialProof: competitorAnalysis.socialProof
  }, null, 2);

  const prompt = SWOT_PROMPT
    .replace('{myCompany}', myCompany)
    .replace('{competitorData}', competitorData);

  return callClaudeAPI(prompt);
}

export async function generateTalkingPoints(competitorAnalysis, myCompanyInfo) {
  const myCompany = myCompanyInfo?.name
    ? `Name: ${myCompanyInfo.name}\nDescription: ${myCompanyInfo.description || 'N/A'}\nKey Strengths: ${myCompanyInfo.strengths || 'N/A'}`
    : 'No company information provided - generate general competitive talking points';

  const competitorData = JSON.stringify({
    name: competitorAnalysis.companyName,
    pricing: competitorAnalysis.pricing,
    positioning: competitorAnalysis.positioning,
    features: competitorAnalysis.features,
    socialProof: competitorAnalysis.socialProof
  }, null, 2);

  const prompt = TALKING_POINTS_PROMPT
    .replace('{myCompany}', myCompany)
    .replace('{competitorData}', competitorData);

  return callClaudeAPI(prompt);
}

const COMPARISON_SUMMARY_PROMPT = `You are a competitive intelligence analyst. Given multiple competitor analyses, generate a strategic summary comparing them.

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):

{
  "executiveSummary": "string - 2-3 sentence high-level summary of the competitive landscape",
  "competitorStrategies": [
    {
      "name": "string - competitor name",
      "strategy": "string - brief description of their competitive strategy",
      "bestFor": "string - what type of customer they're best suited for"
    }
  ],
  "keyDifferences": [
    {
      "dimension": "string - e.g., 'Pricing Model', 'Target Market'",
      "insight": "string - how competitors differ on this dimension"
    }
  ],
  "recommendations": [
    {
      "against": "string - competitor name",
      "emphasize": "string - what to emphasize when competing against them"
    }
  ]
}

YOUR COMPANY:
{myCompany}

COMPETITORS TO COMPARE:
{competitors}`;

export async function generateComparisonSummary(competitors, myCompanyInfo) {
  const myCompany = myCompanyInfo?.name
    ? `Name: ${myCompanyInfo.name}\nDescription: ${myCompanyInfo.description || 'N/A'}\nKey Strengths: ${myCompanyInfo.strengths || 'N/A'}`
    : 'No company information provided - generate general competitive insights';

  const competitorData = competitors.map(c => ({
    name: c.companyName,
    pricing: c.pricing,
    positioning: c.positioning,
    features: c.features?.highlighted || [],
    socialProof: {
      customers: c.socialProof?.customerLogos || [],
      integrations: c.socialProof?.partnerships || []
    }
  }));

  const prompt = COMPARISON_SUMMARY_PROMPT
    .replace('{myCompany}', myCompany)
    .replace('{competitors}', JSON.stringify(competitorData, null, 2));

  return callClaudeAPI(prompt);
}
