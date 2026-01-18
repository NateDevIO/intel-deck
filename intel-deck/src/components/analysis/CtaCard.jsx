import { MousePointer, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';

export function CtaCard({ callsToAction }) {
  if (!callsToAction) return null;

  const hasContent = callsToAction.primary || callsToAction.secondary?.length > 0;
  if (!hasContent) return null;

  return (
    <Card title="Calls to Action">
      <div className="flex flex-wrap gap-6">
        {callsToAction.primary && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-4 h-4 text-primary-600" />
              <h4 className="text-sm font-medium text-gray-700">Primary CTA</h4>
            </div>
            <span className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg font-medium text-sm">
              {callsToAction.primary}
            </span>
          </div>
        )}

        {callsToAction.secondary?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Secondary CTAs</h4>
            <div className="flex flex-wrap gap-2">
              {callsToAction.secondary.map((cta, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {cta}
                </span>
              ))}
            </div>
          </div>
        )}

        {callsToAction.urgencyLanguage && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-medium text-gray-700">Urgency Language</h4>
            </div>
            <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              "{callsToAction.urgencyLanguage}"
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
