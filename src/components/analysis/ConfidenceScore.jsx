import { useState } from 'react';
import { Shield, ShieldCheck, ShieldAlert, X, Check, AlertCircle } from 'lucide-react';

export function ConfidenceScore({ confidence }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!confidence) return null;

  const { score, level, label, missing = [], present = [] } = confidence;

  const getIcon = () => {
    switch (level) {
      case 'high':
        return <ShieldCheck className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      default:
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          bar: 'bg-green-500'
        };
      case 'medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          text: 'text-amber-700 dark:text-amber-300',
          bar: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          bar: 'bg-red-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg text-sm cursor-pointer hover:opacity-90 transition-opacity`}
        title="Click to see details"
      >
        {getIcon()}
        <span className="font-medium">{label}</span>
        <div className="w-16 h-1.5 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bar} rounded-full transition-all`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-xs opacity-75">{score}%</span>
      </button>

      {/* Details Popover */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">Confidence Breakdown</h4>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
              {present.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Found ({present.length})
                  </p>
                  <div className="space-y-1">
                    {present.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-3 h-3" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {missing.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Missing ({missing.length})
                  </p>
                  <div className="space-y-1">
                    {missing.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-3 h-3" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {level === 'high'
                  ? 'Great extraction! Most data points were found.'
                  : level === 'medium'
                    ? 'Partial extraction. Try pasting more content for better results.'
                    : 'Limited data found. Consider using a different source page.'
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
