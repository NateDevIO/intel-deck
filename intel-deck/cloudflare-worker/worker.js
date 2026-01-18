// Cloudflare Worker - Browserless Proxy
// Deploy this at: https://workers.cloudflare.com/
// Then update BROWSERLESS_PROXY_URL in your .env.local

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { url, token } = await request.json();

      if (!url || !token) {
        return new Response('Missing url or token', { status: 400 });
      }

      // Call Browserless API
      const browserlessResponse = await fetch(
        `https://chrome.browserless.io/content?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url,
            gotoOptions: { waitUntil: 'networkidle0' },
          }),
        }
      );

      const content = await browserlessResponse.text();

      return new Response(content, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/html',
        },
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};
