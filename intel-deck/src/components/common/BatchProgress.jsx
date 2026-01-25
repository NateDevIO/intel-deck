import { Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export function BatchProgress({
  progress,
  currentUrl,
  onCancel,
  failedUrls = [],
  onRetryFailed
}) {
  if (!progress) return null;

  const { current, total } = progress;
  const percentage = Math.round((current / total) * 100);
  const isComplete = current === total;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {!isComplete ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
          ) : failedUrls.length > 0 ? (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {isComplete
                ? failedUrls.length > 0
                  ? `Completed with ${failedUrls.length} error${failedUrls.length > 1 ? 's' : ''}`
                  : 'Batch analysis complete!'
                : `Analyzing ${current} of ${total} URLs...`
              }
            </h3>
            {currentUrl && !isComplete && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-md">
                {currentUrl.replace(/^https?:\/\//, '').split('/')[0]}
              </p>
            )}
          </div>
        </div>
        {!isComplete && onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete && failedUrls.length === 0
              ? 'bg-green-500'
              : isComplete && failedUrls.length > 0
                ? 'bg-amber-500'
                : 'bg-primary-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {percentage}% complete
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {current}/{total} URLs
        </span>
      </div>

      {/* Failed URLs */}
      {failedUrls.length > 0 && isComplete && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Failed URLs ({failedUrls.length})
            </span>
            {onRetryFailed && (
              <Button variant="secondary" size="sm" onClick={onRetryFailed}>
                Retry Failed
              </Button>
            )}
          </div>
          <div className="space-y-1">
            {failedUrls.map((url, i) => (
              <div key={i} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded truncate">
                {url}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
