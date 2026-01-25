import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

// Parse price string to number
function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ''));
}

// Format date for display
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: '2-digit'
  });
}

export function PriceHistoryChart({ priceHistory, companyName }) {
  if (!priceHistory || priceHistory.length < 2) {
    return null;
  }

  // Get unique tier names across all history
  const allTiers = [...new Set(priceHistory.flatMap(h =>
    (h.tiers || []).map(t => t.name)
  ))];

  // Build data series for each tier
  const tierSeries = allTiers.map(tierName => {
    const points = priceHistory.map(h => {
      const tier = h.tiers?.find(t => t.name === tierName);
      return {
        date: h.date,
        price: tier ? parsePrice(tier.price) : null,
        priceStr: tier?.price || null
      };
    }).filter(p => p.price !== null);

    // Calculate change
    const firstPrice = points[0]?.price;
    const lastPrice = points[points.length - 1]?.price;
    const change = firstPrice && lastPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

    return {
      tierName,
      points,
      change,
      currentPrice: points[points.length - 1]?.priceStr
    };
  }).filter(s => s.points.length > 0);

  if (tierSeries.length === 0) {
    return null;
  }

  // Find min/max for scaling
  const allPrices = tierSeries.flatMap(s => s.points.map(p => p.price));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  // Colors for different tiers
  const colors = [
    { line: 'stroke-primary-500', dot: 'bg-primary-500', text: 'text-primary-600 dark:text-primary-400' },
    { line: 'stroke-indigo-500', dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
    { line: 'stroke-purple-500', dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
    { line: 'stroke-pink-500', dot: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Price History</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {priceHistory.length} snapshots
        </span>
      </div>

      {/* Chart */}
      <div className="relative h-40 mb-4">
        <svg className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25%" x2="100%" y2="25%" className="stroke-gray-100 dark:stroke-gray-700" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="stroke-gray-100 dark:stroke-gray-700" strokeWidth="1" />
          <line x1="0" y1="75%" x2="100%" y2="75%" className="stroke-gray-100 dark:stroke-gray-700" strokeWidth="1" />

          {/* Lines for each tier */}
          {tierSeries.map((series, seriesIdx) => {
            const color = colors[seriesIdx % colors.length];
            const pathPoints = series.points.map((point, i) => {
              const x = (i / (series.points.length - 1)) * 100;
              const y = 100 - ((point.price - minPrice) / priceRange) * 80 - 10; // 10-90% range
              return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
            }).join(' ');

            return (
              <g key={series.tierName}>
                <path
                  d={pathPoints}
                  fill="none"
                  className={color.line}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots */}
                {series.points.map((point, i) => {
                  const x = (i / (series.points.length - 1)) * 100;
                  const y = 100 - ((point.price - minPrice) / priceRange) * 80 - 10;
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      className={`${color.dot.replace('bg-', 'fill-')} stroke-white dark:stroke-gray-800`}
                      strokeWidth="2"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 dark:text-gray-500 -ml-1 py-2">
          <span>${Math.round(maxPrice)}</span>
          <span>${Math.round((maxPrice + minPrice) / 2)}</span>
          <span>${Math.round(minPrice)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-4 pl-6">
        <span>{formatDate(priceHistory[0].date)}</span>
        <span>{formatDate(priceHistory[priceHistory.length - 1].date)}</span>
      </div>

      {/* Legend with changes */}
      <div className="space-y-2">
        {tierSeries.map((series, idx) => {
          const color = colors[idx % colors.length];
          const isUp = series.change > 0;
          const isDown = series.change < 0;

          return (
            <div key={series.tierName} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color.dot}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">{series.tierName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {series.currentPrice}
                </span>
                {series.change !== 0 && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    isUp ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? '+' : ''}{series.change.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Price changes tracked across re-analyses of {companyName}
      </p>
    </div>
  );
}
