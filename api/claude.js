// Vercel Serverless Function - proxies Claude API calls
// API key stays server-side, never exposed to browser
// Auto-discovers the latest Sonnet model from Anthropic's API

let cachedModel = null;
let cacheExpiry = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getLatestSonnetModel(apiKey) {
  if (cachedModel && Date.now() < cacheExpiry) {
    return cachedModel;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });

    if (!response.ok) {
      return cachedModel || 'claude-sonnet-4-6-latest';
    }

    const { data } = await response.json();
    const sonnetModels = data
      .filter(m => m.id.includes('sonnet') && !m.id.includes('latest'))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (sonnetModels.length > 0) {
      cachedModel = sonnetModels[0].id;
      cacheExpiry = Date.now() + CACHE_TTL;
      return cachedModel;
    }
  } catch (err) {
    console.error('Model discovery failed, using fallback:', err.message);
  }

  return cachedModel || 'claude-sonnet-4-6-latest';
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { prompt, maxTokens = 4096 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const model = process.env.CLAUDE_MODEL || await getLatestSonnetModel(apiKey);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Claude API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
