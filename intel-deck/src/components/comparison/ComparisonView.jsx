import { Download, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button';
import { ComparisonTable } from './ComparisonTable';

export function ComparisonView({ competitors, onRemove, onClose, onExport }) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const markdown = generateComparisonMarkdown(competitors);
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Competitor Comparison
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Comparing {competitors.length} competitors side by side
            </p>
          </div>

          <div className="flex items-center gap-2">
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

      {/* Comparison Table */}
      <ComparisonTable competitors={competitors} onRemove={onRemove} />

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 ring-1 ring-green-200" />
            <span className="text-gray-600">Lowest price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100 ring-1 ring-amber-200" />
            <span className="text-gray-600">Highest price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-gray-600">Feature available</span>
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
