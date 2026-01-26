# Browserless CORS Proxy (Cloudflare Worker)

This Cloudflare Worker acts as a proxy for Browserless.io API calls, adding the necessary CORS headers to allow browser-side requests.

## Why is this needed?

Browserless.io's API doesn't include CORS headers, so it can't be called directly from a browser. This worker proxies the request and adds the appropriate headers.

## Deployment Steps

1. **Create a Cloudflare account** (if you don't have one)
   - Go to https://workers.cloudflare.com/
   - Sign up for free

2. **Create a new Worker**
   - Click "Create a Worker"
   - Replace the default code with the contents of `worker.js`
   - Click "Save and Deploy"

3. **Copy your Worker URL**
   - It will look like: `https://battlecard-proxy.your-subdomain.workers.dev`

4. **Add to your .env.local**
   ```
   VITE_BROWSERLESS_PROXY_URL=https://battlecard-proxy.your-subdomain.workers.dev
   ```

5. **Restart the dev server**
   ```
   npm run dev
   ```

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests/day
- 10ms CPU time per request

This is more than enough for Intel Deck usage.

## Security Note

The worker expects the Browserless token to be passed in the request body (not stored in the worker), so your token stays in your local environment.
