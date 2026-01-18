import { Copy, Check, Target, Zap, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function PositioningCard({ positioning }) {
  const [copied, setCopied] = useState(false);

  if (!positioning) return null;

  const handleCopy = () => {
    let text = '';
    if (positioning.tagline) text += `Tagline: "${positioning.tagline}"\n\n`;
    if (positioning.targetCustomers?.length) {
      text += `Target Customers: ${positioning.targetCustomers.join(', ')}\n\n`;
    }
    if (positioning.differentiators?.length) {
      text += `Key Differentiators:\n${positioning.differentiators.map(d => `- ${d}`).join('\n')}\n\n`;
    }
    if (positioning.valuePropositions?.length) {
      text += `Value Propositions:\n${positioning.valuePropositions.map(v => `- ${v}`).join('\n')}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="Positioning"
      action={
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Customers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary-600" />
            <h4 className="text-sm font-medium text-gray-700">Target Customers</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {positioning.targetCustomers?.map((customer, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {customer}
              </span>
            ))}
            {(!positioning.targetCustomers || positioning.targetCustomers.length === 0) && (
              <span className="text-sm text-gray-400">Not identified</span>
            )}
          </div>
        </div>

        {/* Differentiators */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary-600" />
            <h4 className="text-sm font-medium text-gray-700">Key Differentiators</h4>
          </div>
          <ul className="space-y-2">
            {positioning.differentiators?.map((diff, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary-500 mt-1">-</span>
                {diff}
              </li>
            ))}
            {(!positioning.differentiators || positioning.differentiators.length === 0) && (
              <li className="text-sm text-gray-400">Not identified</li>
            )}
          </ul>
        </div>

        {/* Value Propositions */}
        {positioning.valuePropositions?.length > 0 && (
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-primary-600" />
              <h4 className="text-sm font-medium text-gray-700">Value Propositions</h4>
            </div>
            <ul className="space-y-2">
              {positioning.valuePropositions.map((prop, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-amber-500 mt-1">-</span>
                  {prop}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
