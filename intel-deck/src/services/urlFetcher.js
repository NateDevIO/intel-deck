// Fetch URL content with Jina AI as primary and Browserless as fallback
const JINA_READER_API = 'https://r.jina.ai/';

// Check if content likely contains ACTUAL pricing data (dollar amounts, not just tier names)
function hasPricingIndicators(content) {
  // These patterns indicate actual price numbers exist
  const pricePatterns = [
    /\$\d+/i,                           // Dollar amounts ($10, $99)
    /€\d+/i,                            // Euro amounts
    /£\d+/i,                            // Pound amounts
    /\d+\s*\/\s*(mo|month|year|yr)/i,   // Per month/year (10/month)
    /\d+\s*per\s+(user|seat|member)/i,  // Per user pricing (10 per user)
  ];

  // Count how many actual price patterns we find
  const priceMatchCount = pricePatterns.filter(p => p.test(content)).length;

  // We need at least 1 actual price pattern to consider it has pricing
  // This ensures we don't accept pages that just have tier names without prices
  return priceMatchCount >= 1;
}

// Fetch via Jina Reader API
async function fetchViaJina(url) {
  const readerUrl = JINA_READER_API + url;

  const response = await fetch(readerUrl, {
    headers: {
      'Accept': 'text/plain',
    }
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limited by Jina AI.');
    }
    throw new Error(`Jina fetch failed: ${response.status}`);
  }

  return await response.text();
}

// Fetch via Browserless API (renders JavaScript) - through server-side proxy
async function fetchViaBrowserless(url) {
  const response = await fetch('/api/fetch-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  if (!data.available) {
    throw new Error('Browserless not configured on server');
  }

  if (!response.ok) {
    throw new Error(data.error || `Browserless fetch failed: ${response.status}`);
  }

  return extractTextFromHtml(data.html);
}

// Extract text from HTML
function extractTextFromHtml(html) {
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');

  // Convert common elements to readable format
  text = text
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' | ')
    .replace(/<\/th>/gi, ' | ');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

export async function fetchUrlContent(url) {
  // Validate URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  let jinaContent = null;
  let jinaError = null;

  // Try Jina first
  try {
    jinaContent = await fetchViaJina(url);
  } catch (err) {
    jinaError = err;
  }

  // Check if Jina content has actual pricing data
  const jinaHasPricing = jinaContent && jinaContent.length >= 100 && hasPricingIndicators(jinaContent);
  console.log(`[URL Fetcher] Jina content: ${jinaContent?.length || 0} chars, has pricing: ${jinaHasPricing}`);

  // If Jina succeeded and has good pricing data, use it
  if (jinaHasPricing) {
    console.log('[URL Fetcher] Using Jina content (has pricing data)');
    return { url, content: jinaContent, source: 'jina' };
  }

  // Try Browserless as fallback (server checks if token is configured)
  console.log('[URL Fetcher] Jina lacks pricing data, trying Browserless fallback...');
  try {
    const browserlessContent = await fetchViaBrowserless(url);
    const browserlessHasPricing = browserlessContent && browserlessContent.length >= 100 && hasPricingIndicators(browserlessContent);
    console.log(`[URL Fetcher] Browserless content: ${browserlessContent?.length || 0} chars, has pricing: ${browserlessHasPricing}`);

    if (browserlessContent && browserlessContent.length >= 100) {
      // If Browserless has better pricing indicators, use it
      if (browserlessHasPricing) {
        console.log('[URL Fetcher] Using Browserless content (has pricing data)');
        return { url, content: browserlessContent, source: 'browserless' };
      }
    }
  } catch (err) {
    console.warn('[URL Fetcher] Browserless fallback failed:', err.message);
    // Continue with Jina content if available
  }

  // Fall back to Jina content if available
  if (jinaContent && jinaContent.length >= 100) {
    return { url, content: jinaContent, source: 'jina' };
  }

  // If we have Jina error, throw it
  if (jinaError) {
    throw jinaError;
  }

  throw new Error('Could not extract meaningful content from this URL. Try copying the page content manually.');
}
