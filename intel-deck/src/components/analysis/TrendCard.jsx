import { TrendingUp, TrendingDown, Plus, Minus, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';

export function TrendCard({ changes, previousDate }) {
  if (!changes || changes.length === 0) return null;

  const getChangeIcon = (change) => {
    switch (change.type) {
      case 'price_change':
        return change.impact === 'price_increase'
          ? <TrendingUp className="w-4 h-4 text-red-500" />
          : <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'tier_added':
      case 'feature_added':
      case 'differentiator_added':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'tier_removed':
      case 'feature_removed':
      case 'differentiator_removed':
        return <Minus className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
    }
  };

  const getChangeLabel = (change) => {
    switch (change.type) {
      case 'price_change':
        return `${change.tier} price changed from ${change.oldValue} to ${change.newValue}`;
      case 'tier_added':
        return `New pricing tier: ${change.tier} at ${change.newValue}`;
      case 'tier_removed':
        return `Removed pricing tier: ${change.tier}`;
      case 'feature_added':
        return `New feature: ${change.newValue}`;
      case 'feature_removed':
        return `Removed feature: ${change.oldValue}`;
      case 'tagline_changed':
        return `Tagline changed to: "${change.newValue}"`;
      case 'differentiator_added':
        return `New differentiator: ${change.newValue}`;
      case 'differentiator_removed':
        return `Removed differentiator: ${change.oldValue}`;
      default:
        return 'Unknown change';
    }
  };

  const getChangeBgColor = (change) => {
    if (change.type.includes('added') || change.impact === 'price_decrease') {
      return 'bg-green-50 border-green-100';
    }
    if (change.type.includes('removed') || change.impact === 'price_increase') {
      return 'bg-red-50 border-red-100';
    }
    return 'bg-blue-50 border-blue-100';
  };

  const formattedDate = previousDate
    ? new Date(previousDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'previous analysis';

  return (
    <Card
      title="Changes Detected"
      icon={<RefreshCw className="w-5 h-5" />}
      badge={`${changes.length} change${changes.length !== 1 ? 's' : ''}`}
      badgeColor="blue"
    >
      <p className="text-sm text-gray-500 mb-4">
        Compared to {formattedDate}
      </p>

      <div className="space-y-2">
        {changes.map((change, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getChangeBgColor(change)}`}
          >
            <div className="mt-0.5">
              {getChangeIcon(change)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {getChangeLabel(change)}
              </p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {change.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
