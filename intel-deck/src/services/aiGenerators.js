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

async function callClaudeAPI(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
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

export async function generateSWOT(competitorAnalysis, myCompanyInfo, apiKey) {
  if (!apiKey) {
    throw new Error('API key required');
  }

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

  return callClaudeAPI(prompt, apiKey);
}

export async function generateTalkingPoints(competitorAnalysis, myCompanyInfo, apiKey) {
  if (!apiKey) {
    throw new Error('API key required');
  }

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

  return callClaudeAPI(prompt, apiKey);
}
