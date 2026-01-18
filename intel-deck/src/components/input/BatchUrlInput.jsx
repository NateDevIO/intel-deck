import { useState } from 'react';
import { Link, Loader2, AlertCircle, Plus, X, Play } from 'lucide-react';
import { Button } from '../common/Button';

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

      <p className="text-xs text-gray-400">
        Add up to 10 competitor URLs to analyze in batch
      </p>
    </div>
  );
}
