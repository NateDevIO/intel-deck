import { useState } from 'react';
import { Link, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { fetchUrlContent } from '../../services/urlFetcher';

export function UrlInput({ onContentFetched, isLoading: externalLoading }) {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [fetchSource, setFetchSource] = useState(null);

  const isLoading = isFetching || externalLoading;

  const handleFetch = async () => {
    if (!url.trim() || isLoading) return;

    setIsFetching(true);
    setError(null);
    setFetchSource(null);

    try {
      const result = await fetchUrlContent(url.trim());
      setFetchSource(result.source);
      onContentFetched(result.content, result.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      handleFetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Link className="w-5 h-5" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://competitor.com/pricing"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Enter a competitor's pricing or product page URL
        </p>
        <Button
          onClick={handleFetch}
          disabled={!url.trim() || isLoading}
          isLoading={isFetching}
        >
          {isFetching ? 'Fetching...' : 'Fetch & Analyze'}
        </Button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Note:</strong> Analysis typically takes 20-30 seconds per URL. SWOT and Talking Points generate afterward and may take an additional 20-30 seconds.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example URLs:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'asana.com/pricing',
            'slack.com/pricing',
            'monday.com/pricing',
            'notion.so/pricing',
            'linear.app/pricing',
            'figma.com/pricing',
            'airtable.com/pricing',
            'clickup.com/pricing'
          ].map((example) => (
            <button
              key={example}
              onClick={() => setUrl('https://' + example)}
              className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Powered by Jina AI Reader with Browserless fallback for JavaScript-rendered pages
        </p>
      </div>
    </div>
  );
}
