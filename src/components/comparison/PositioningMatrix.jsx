import { useMemo } from 'react';

// Parse price string to number
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ''));
}

// Calculate feature richness score based on analysis
function calculateFeatureScore(analysis) {
  let score = 0;

  // Pricing features
  if (analysis.pricing?.hasFreeTier) score += 10;
  if (analysis.pricing?.hasEnterpriseTier) score += 15;
  if (analysis.pricing?.trialAvailable) score += 5;
  if (analysis.pricing?.hasSeatTypes) score += 10;

  // Feature count
  const highlightedCount = analysis.features?.highlighted?.length || 0;
  score += Math.min(30, highlightedCount * 3);

  // Tier feature depth
  const tierFeatures = analysis.features?.byTier || {};
  const totalTierFeatures = Object.values(tierFeatures).reduce((sum, arr) => sum + arr.length, 0);
  score += Math.min(20, totalTierFeatures);

  // Integrations
  const integrations = analysis.socialProof?.partnerships?.length || 0;
  score += Math.min(10, integrations);

  return Math.min(100, score);
}

export function PositioningMatrix({ competitors, companyInfo }) {
  const positions = useMemo(() => {
    return competitors.map(comp => {
      // Get starting price (first paid tier)
      const paidTier = comp.pricing?.tiers?.find(t =>
        t.priceModel !== 'free' && t.priceModel !== 'contact_sales'
      );
      const price = parsePrice(paidTier?.price);
      const featureScore = calculateFeatureScore(comp);

      return {
        id: comp.id,
        name: comp.companyName,
        price,
        featureScore,
        // Normalize for positioning
        hasPrice: price !== null
      };
    }).filter(p => p.hasPrice);
  }, [competitors]);

  if (positions.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Need at least 2 competitors with pricing data to generate positioning matrix
        </p>
      </div>
    );
  }

  // Calculate bounds for normalization
  const prices = positions.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const features = positions.map(p => p.featureScore);
  const minFeature = Math.min(...features);
  const maxFeature = Math.max(...features);
  const featureRange = maxFeature - minFeature || 1;

  // Normalize positions to 0-100 scale
  const normalizedPositions = positions.map(p => ({
    ...p,
    x: ((p.price - minPrice) / priceRange) * 80 + 10, // 10-90 range
    y: 90 - ((p.featureScore - minFeature) / featureRange) * 80 // Inverted, 10-90 range
  }));

  const colors = [
    'bg-primary-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Competitive Positioning Matrix</h3>

      <div className="relative">
        {/* Matrix Container */}
        <div className="relative w-full aspect-square max-w-lg mx-auto">
          {/* Background Grid */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-green-50/50 dark:bg-green-900/10 border-r border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Premium Value</span>
            </div>
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Premium Price</span>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Budget</span>
            </div>
            <div className="bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Basic</span>
            </div>
          </div>

          {/* Axis Labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Lower Price</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Higher Price</span>
          </div>
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 -rotate-90 origin-center">More Features</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -rotate-90 origin-center">Fewer Features</span>
          </div>

          {/* Company Positions */}
          {normalizedPositions.map((pos, i) => (
            <div
              key={pos.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} text-white flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-white dark:ring-gray-800 cursor-pointer hover:scale-110 transition-transform`}>
                {pos.name.substring(0, 2).toUpperCase()}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                <div className="font-medium">{pos.name}</div>
                <div className="text-gray-300">${pos.price}/mo</div>
              </div>
            </div>
          ))}

          {/* Your Company (if configured) */}
          {companyInfo?.name && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xl ring-4 ring-white dark:ring-gray-800 cursor-pointer hover:scale-110 transition-transform">
                YOU
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {companyInfo.name}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {normalizedPositions.map((pos, i) => (
            <div key={pos.id} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${colors[i % colors.length]}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{pos.name}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
        Position based on starting price and feature richness analysis
      </p>
    </div>
  );
}
