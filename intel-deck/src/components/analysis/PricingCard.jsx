import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../common/Card';
import { ConfidenceBadge } from './ConfidenceBadge';

function PricingTier({ tier }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${tier.name}: ${tier.price}${tier.billingPeriod ? ` (${tier.billingPeriod})` : ''}\n${tier.targetCustomer}\n\nKey Features:\n${tier.keyFeatures?.map(f => `- ${f}`).join('\n') || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-primary-300 dark:hover:border-primary-600 transition-colors group bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">{tier.name}</h4>
        <ConfidenceBadge level={tier.confidence} />
      </div>

      <p className="text-3xl font-bold text-primary-600">{tier.price}</p>
      {tier.billingPeriod && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tier.billingPeriod}</p>
      )}

      {tier.seatPrices && Object.keys(tier.seatPrices).length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">By seat type</p>
          <div className="space-y-1">
            {Object.entries(tier.seatPrices).map(([seatType, price]) => (
              <div key={seatType} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{seatType}</span>
                <span className="font-medium text-gray-900 dark:text-white">{price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        {tier.targetCustomer}
      </p>

      {tier.keyFeatures?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Features</p>
          <ul className="space-y-1.5">
            {tier.keyFeatures.slice(0, 4).map((feature, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                {feature}
              </li>
            ))}
            {tier.keyFeatures.length > 4 && (
              <li className="text-xs text-gray-400">
                +{tier.keyFeatures.length - 4} more
              </li>
            )}
          </ul>
        </div>
      )}

      {tier.limitations?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Limitations</p>
          <ul className="space-y-1.5">
            {tier.limitations.slice(0, 2).map((limit, i) => (
              <li key={i} className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">-</span>
                {limit}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleCopy}
        className="mt-4 w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy tier
          </>
        )}
      </button>
    </div>
  );
}

export function PricingCard({ pricing }) {
  if (!pricing?.tiers?.length) return null;

  const quickFacts = [];
  if (pricing.hasFreeTier) quickFacts.push('Free tier');
  if (pricing.trialAvailable) quickFacts.push(`${pricing.trialDuration || 'Trial'} available`);
  if (pricing.hasEnterpriseTier) quickFacts.push('Enterprise tier');
  if (pricing.hasSeatTypes && pricing.seatTypes?.length > 0) {
    quickFacts.push(`${pricing.seatTypes.length} seat types`);
  }

  return (
    <Card title="Pricing" subtitle={quickFacts.length > 0 ? quickFacts.join(' | ') : null}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pricing.tiers.map((tier, idx) => (
          <PricingTier key={idx} tier={tier} />
        ))}
      </div>
    </Card>
  );
}
