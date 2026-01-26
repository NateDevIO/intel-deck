import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';

export function SwotCard({ swot, isLoading }) {
  if (isLoading) {
    return (
      <Card title="SWOT Analysis" icon={<Target className="w-5 h-5" />}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!swot) return null;

  const quadrants = [
    {
      title: 'Strengths',
      items: swot.strengths || [],
      icon: <TrendingUp className="w-4 h-4" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      title: 'Weaknesses',
      items: swot.weaknesses || [],
      icon: <TrendingDown className="w-4 h-4" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-600'
    },
    {
      title: 'Opportunities',
      items: swot.opportunities || [],
      icon: <Target className="w-4 h-4" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Threats',
      items: swot.threats || [],
      icon: <AlertTriangle className="w-4 h-4" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600'
    }
  ];

  return (
    <Card title="SWOT Analysis" icon={<Target className="w-5 h-5" />}>
      {swot.summary && (
        <p className="text-gray-600 mb-4 pb-4 border-b border-gray-100">
          {swot.summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.title}
            className={`${quadrant.bgColor} ${quadrant.borderColor} border rounded-lg p-4`}
          >
            <div className={`flex items-center gap-2 ${quadrant.iconColor} mb-3`}>
              {quadrant.icon}
              <h4 className="font-semibold">{quadrant.title}</h4>
            </div>
            <ul className="space-y-2">
              {quadrant.items.map((item, idx) => (
                <li key={idx} className={`text-sm ${quadrant.textColor}`}>
                  • {item}
                </li>
              ))}
              {quadrant.items.length === 0 && (
                <li className="text-sm text-gray-400 italic">No items identified</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
