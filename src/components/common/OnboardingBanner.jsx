import { X, Sparkles, Link, Save, GitCompare, FileText } from 'lucide-react';
import { useState } from 'react';

const STEPS = [
  {
    icon: Link,
    title: 'Enter a URL',
    description: 'Paste a competitor pricing or product page URL'
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Get instant pricing, positioning, and SWOT analysis'
  },
  {
    icon: Save,
    title: 'Build Library',
    description: 'Save competitors and track deal outcomes'
  },
  {
    icon: GitCompare,
    title: 'Compare',
    description: 'Compare competitors side-by-side with AI insights'
  }
];

const EXAMPLE_URLS = [
  'slack.com/pricing',
  'notion.so/pricing',
  'linear.app/pricing',
  'asana.com/pricing',
  'monday.com/pricing'
];

export function OnboardingBanner({ onDismiss, onTryExample }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleTryExample = (url) => {
    onTryExample?.(`https://${url}`);
  };

  return (
    <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-xl p-6 text-white mb-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Welcome to Intel Deck</h2>
        </div>
        <p className="text-white/80 text-sm mb-6">
          Transform competitor websites into actionable battlecards in seconds
        </p>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-white/70 text-xs">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Example URLs */}
        <div>
          <p className="text-white/80 text-xs mb-2">Try one of these examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_URLS.map((url) => (
              <button
                key={url}
                onClick={() => handleTryExample(url)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors"
              >
                {url}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
