// Vercel Serverless Function - proxies Browserless API calls
// Token stays server-side, never exposed to browser

const BROWSERLESS_API = 'https://chrome.browserless.io/content';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessToken) {
    return res.status(200).json({
      available: false,
      error: 'Browserless token not configured'
    });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch(`${BROWSERLESS_API}?token=${browserlessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        waitFor: 3000,
      })
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({ error: 'Invalid Browserless token' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Browserless rate limit exceeded' });
      }
      return res.status(response.status).json({ error: `Browserless error: ${response.status}` });
    }

    const html = await response.text();
    return res.status(200).json({ html, available: true });

  } catch (error) {
    console.error('Browserless API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
