import { Star, Layers } from 'lucide-react';
import { Card } from '../common/Card';

export function FeaturesCard({ features }) {
  if (!features) return null;

  const hasContent = features.highlighted?.length > 0 || Object.keys(features.byTier || {}).length > 0;
  if (!hasContent) return null;

  return (
    <Card title="Features">
      <div className="space-y-6">
        {/* Highlighted Features */}
        {features.highlighted?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-medium text-gray-700">Highlighted Features</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.highlighted.map((feature, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features by Tier */}
        {features.byTier && Object.keys(features.byTier).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-primary-600" />
              <h4 className="text-sm font-medium text-gray-700">Features by Tier</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(features.byTier).map(([tierName, tierFeatures]) => (
                <div key={tierName} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">{tierName}</h5>
                  <ul className="space-y-1">
                    {tierFeatures.slice(0, 5).map((feature, i) => (
                      <li key={i} className="text-xs text-gray-600">
                        - {feature}
                      </li>
                    ))}
                    {tierFeatures.length > 5 && (
                      <li className="text-xs text-gray-400">
                        +{tierFeatures.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
