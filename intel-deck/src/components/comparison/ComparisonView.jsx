import { X, Copy, Check, Sparkles, Loader2, Target, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { ComparisonTable } from './ComparisonTable';
import { PositioningMatrix } from './PositioningMatrix';
import { generateComparisonSummary } from '../../services/aiGenerators';

export function ComparisonView({ competitors, onRemove, onClose, companyInfo }) {
  const [copied, setCopied] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const handleCopyMarkdown = () => {
    const markdown = generateComparisonMarkdown(competitors);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      const summary = await generateComparisonSummary(competitors, companyInfo);
      setAiSummary(summary);
    } catch (err) {
      console.error('Failed to generate comparison summary:', err);
      setSummaryError(err.message || 'Failed to generate summary. Check your API key in settings.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Auto-generate summary when view opens
  useEffect(() => {
    if (competitors.length >= 2 && !aiSummary && !summaryError) {
      handleGenerateSummary();
    }
  }, [competitors.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Competitor Comparison
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Comparing {competitors.length} competitors side by side
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
            >
              {isGeneratingSummary ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              AI Summary
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyMarkdown}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Table
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
              Exit Compare
            </Button>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {(aiSummary || isGeneratingSummary || summaryError) && (
        <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-lg border border-primary-200 dark:border-primary-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Competitive Summary</h3>
          </div>

          {isGeneratingSummary ? (
            <div className="flex items-center gap-3 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              <span className="text-gray-600 dark:text-gray-400">Analyzing competitive landscape...</span>
            </div>
          ) : summaryError ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-400 mb-3">{summaryError}</p>
              <Button variant="secondary" size="sm" onClick={handleGenerateSummary}>
                Try Again
              </Button>
            </div>
          ) : aiSummary && (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {aiSummary.executiveSummary}
                </p>
              </div>

              {/* Key Differences */}
              {aiSummary.keyDifferences?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Differences</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {aiSummary.keyDifferences.map((diff, i) => (
                      <div key={i} className="bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                          {diff.dimension}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{diff.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {aiSummary.recommendations?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Recommendations</h4>
                  </div>
                  <div className="space-y-2">
                    {aiSummary.recommendations.map((rec, i) => (
                      <div key={i} className="bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Against {rec.against}:
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{rec.emphasize}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comparison Table */}
      <ComparisonTable competitors={competitors} onRemove={onRemove} />

      {/* Positioning Matrix */}
      <PositioningMatrix competitors={competitors} companyInfo={companyInfo} />

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 ring-1 ring-green-200 dark:ring-green-800" />
            <span className="text-gray-600 dark:text-gray-400">Lowest price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/30 ring-1 ring-amber-200 dark:ring-amber-800" />
            <span className="text-gray-600 dark:text-gray-400">Highest price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">Feature available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate markdown comparison table
function generateComparisonMarkdown(competitors) {
  if (!competitors.length) return '';

  // Header row
  let md = `# Competitor Comparison\n\n`;
  md += `| | ${competitors.map(c => c.companyName).join(' | ')} |\n`;
  md += `|---|${competitors.map(() => '---').join('|')}|\n`;

  // Starting price
  md += `| Starting Price | ${competitors.map(c => {
    const paid = c.pricing?.tiers?.find(t => t.priceModel !== 'free' && t.priceModel !== 'contact_sales');
    return paid ? paid.price : 'N/A';
  }).join(' | ')} |\n`;

  // Free tier
  md += `| Free Tier | ${competitors.map(c =>
    c.pricing?.hasFreeTier ? 'Yes' : 'No'
  ).join(' | ')} |\n`;

  // Enterprise
  md += `| Enterprise | ${competitors.map(c =>
    c.pricing?.hasEnterpriseTier ? 'Yes' : 'No'
  ).join(' | ')} |\n`;

  // Key differentiator
  md += `| Differentiator | ${competitors.map(c =>
    c.positioning?.differentiators?.[0] || 'N/A'
  ).join(' | ')} |\n`;

  // Top customer
  md += `| Notable Customer | ${competitors.map(c =>
    c.socialProof?.customerLogos?.[0] || 'N/A'
  ).join(' | ')} |\n`;

  // Integrations
  md += `| Integrations | ${competitors.map(c =>
    c.socialProof?.partnerships?.slice(0, 3).join(', ') || 'N/A'
  ).join(' | ')} |\n`;

  return md;
}
