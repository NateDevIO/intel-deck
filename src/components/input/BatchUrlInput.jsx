import { useState } from 'react';
import { Link, Loader2, AlertCircle, Plus, X, Play } from 'lucide-react';
import { Button } from '../common/Button';

const EXAMPLE_URLS = [
  'asana.com/pricing',
  'slack.com/pricing',
  'monday.com/pricing',
  'notion.so/pricing',
  'linear.app/pricing',
  'figma.com/pricing',
  'airtable.com/pricing'
];

export function BatchUrlInput({ onBatchAnalyze, isLoading }) {
  const [urls, setUrls] = useState(['']);
  const [errors, setErrors] = useState({});

  const addUrl = () => {
    if (urls.length < 10) {
      setUrls([...urls, '']);
    }
  };

  const removeUrl = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);

    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    const validUrls = urls.filter(url => url.trim());
    if (validUrls.length === 0) return;

    onBatchAnalyze(validUrls);
  };

  const validUrlCount = urls.filter(url => url.trim()).length;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Link className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                placeholder={`https://competitor${index + 1}.com/pricing`}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           placeholder:text-gray-400
                           ${errors[index] ? 'border-red-300' : 'border-gray-200'}`}
                disabled={isLoading}
              />
            </div>
            {urls.length > 1 && (
              <button
                onClick={() => removeUrl(index)}
                className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Some URLs failed to fetch. Check and try again.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={addUrl}
          disabled={urls.length >= 10 || isLoading}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add another URL
        </button>

        <Button
          onClick={handleSubmit}
          disabled={validUrlCount === 0 || isLoading}
          isLoading={isLoading}
          leftIcon={isLoading ? null : <Play className="w-4 h-4" />}
        >
          {isLoading
            ? 'Analyzing...'
            : `Analyze ${validUrlCount} URL${validUrlCount !== 1 ? 's' : ''}`}
        </Button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Note:</strong> Analysis takes 20-30 seconds per URL. For {validUrlCount || 1} URL{validUrlCount !== 1 ? 's' : ''}, expect approximately {Math.ceil((validUrlCount || 1) * 0.5)}-{(validUrlCount || 1)} minute{(validUrlCount || 1) > 1 ? 's' : ''} total.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example URLs:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_URLS.map((example) => (
            <button
              key={example}
              onClick={() => {
                const emptyIndex = urls.findIndex(u => !u.trim());
                if (emptyIndex >= 0) {
                  updateUrl(emptyIndex, 'https://' + example);
                } else if (urls.length < 10) {
                  setUrls([...urls, 'https://' + example]);
                }
              }}
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
