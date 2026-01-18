import { X, Check, Minus, TrendingUp, TrendingDown } from 'lucide-react';

function PriceCell({ price, isLowest, isHighest }) {
  return (
    <div className={`
      px-3 py-2 rounded-lg text-center
      ${isLowest ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : ''}
      ${isHighest ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : ''}
      ${!isLowest && !isHighest ? 'bg-gray-50' : ''}
    `}>
      <span className="font-semibold">{price}</span>
      {isLowest && <TrendingDown className="w-3 h-3 inline ml-1" />}
      {isHighest && <TrendingUp className="w-3 h-3 inline ml-1" />}
    </div>
  );
}

function BooleanCell({ value }) {
  return (
    <div className="flex justify-center">
      {value ? (
        <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <Check className="w-4 h-4" />
        </span>
      ) : (
        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
          <Minus className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}

function TextCell({ value, highlight }) {
  return (
    <div className={`text-sm ${highlight ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
      {value || <span className="text-gray-400">-</span>}
    </div>
  );
}

function ListCell({ items, maxItems = 3 }) {
  if (!items || items.length === 0) {
    return <span className="text-sm text-gray-400">-</span>;
  }

  return (
    <div className="space-y-1">
      {items.slice(0, maxItems).map((item, i) => (
        <div key={i} className="text-xs text-gray-600 truncate">
          {item}
        </div>
      ))}
      {items.length > maxItems && (
        <div className="text-xs text-gray-400">+{items.length - maxItems} more</div>
      )}
    </div>
  );
}

export function ComparisonTable({ competitors, onRemove }) {
  if (!competitors || competitors.length < 2) {
    return (
      <div className="text-center py-12 text-gray-500">
        Select at least 2 competitors to compare
      </div>
    );
  }

  // Extract starting prices for comparison
  const getStartingPrice = (competitor) => {
    const paidTier = competitor.pricing?.tiers?.find(t => t.priceModel !== 'free' && t.priceModel !== 'contact_sales');
    if (!paidTier) return null;
    const priceNum = parseFloat(paidTier.price.replace(/[^0-9.]/g, ''));
    return { display: paidTier.price, value: priceNum, period: paidTier.billingPeriod };
  };

  const prices = competitors.map(getStartingPrice);
  const validPrices = prices.filter(p => p && !isNaN(p.value)).map(p => p.value);
  const minPrice = Math.min(...validPrices);
  const maxPrice = Math.max(...validPrices);

  const rows = [
    {
      label: 'Starting Price',
      key: 'startingPrice',
      render: (c, idx) => {
        const price = prices[idx];
        if (!price) return <TextCell value="N/A" />;
        const isLowest = price.value === minPrice && validPrices.length > 1;
        const isHighest = price.value === maxPrice && validPrices.length > 1 && minPrice !== maxPrice;
        return <PriceCell price={price.display} isLowest={isLowest} isHighest={isHighest} />;
      }
    },
    {
      label: 'Billing',
      key: 'billing',
      render: (c, idx) => {
        const price = prices[idx];
        return <TextCell value={price?.period || 'N/A'} />;
      }
    },
    {
      label: 'Free Tier',
      key: 'freeTier',
      render: (c) => <BooleanCell value={c.pricing?.hasFreeTier} />
    },
    {
      label: 'Trial Available',
      key: 'trial',
      render: (c) => <BooleanCell value={c.pricing?.trialAvailable} />
    },
    {
      label: 'Enterprise Tier',
      key: 'enterprise',
      render: (c) => <BooleanCell value={c.pricing?.hasEnterpriseTier} />
    },
    {
      label: 'Target Customers',
      key: 'targets',
      render: (c) => <ListCell items={c.positioning?.targetCustomers} />
    },
    {
      label: 'Key Differentiator',
      key: 'differentiator',
      render: (c) => <TextCell value={c.positioning?.differentiators?.[0]} highlight />
    },
    {
      label: 'Notable Customers',
      key: 'customers',
      render: (c) => <ListCell items={c.socialProof?.customerLogos} />
    },
    {
      label: 'Integrations',
      key: 'integrations',
      render: (c) => <ListCell items={c.socialProof?.partnerships} maxItems={4} />
    },
    {
      label: 'Primary CTA',
      key: 'cta',
      render: (c) => <TextCell value={c.callsToAction?.primary} />
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900 w-40 sticky left-0 bg-gray-50 z-10">
                Compare
              </th>
              {competitors.map((c) => (
                <th key={c.id} className="px-4 py-3 min-w-[180px]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{c.companyName}</div>
                      {c.positioning?.tagline && (
                        <div className="text-xs font-normal text-gray-500 truncate max-w-[150px]">
                          {c.positioning.tagline}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemove(c.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.key}
                className={`
                  border-b border-gray-100 last:border-0
                  ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                `}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-700 sticky left-0 bg-inherit z-10">
                  {row.label}
                </td>
                {competitors.map((c, idx) => (
                  <td key={c.id} className="px-4 py-3">
                    {row.render(c, idx)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
