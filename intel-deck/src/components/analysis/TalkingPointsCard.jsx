import { MessageSquare, Shield, HelpCircle, Trophy } from 'lucide-react';
import { Card } from '../common/Card';

export function TalkingPointsCard({ talkingPoints, isLoading }) {
  if (isLoading) {
    return (
      <Card title="Sales Talking Points" icon={<MessageSquare className="w-5 h-5" />}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!talkingPoints) return null;

  return (
    <Card title="Sales Talking Points" icon={<MessageSquare className="w-5 h-5" />}>
      {/* Elevator Pitch */}
      {talkingPoints.elevatorPitch && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
          <h4 className="text-sm font-semibold text-primary-700 mb-2">30-Second Pitch</h4>
          <p className="text-sm text-primary-900">{talkingPoints.elevatorPitch}</p>
        </div>
      )}

      {/* Win Themes */}
      {talkingPoints.winThemes?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <h4 className="font-medium text-gray-900">Win Themes</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {talkingPoints.winThemes.map((theme, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Differentiators */}
      {talkingPoints.keyDifferentiators?.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Key Differentiators</h4>
          <div className="space-y-3">
            {talkingPoints.keyDifferentiators.map((diff, idx) => (
              <div key={idx} className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="font-medium text-green-800 text-sm">{diff.point}</p>
                {diff.proof && (
                  <p className="text-xs text-green-600 mt-1">Proof: {diff.proof}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Objection Handlers */}
      {talkingPoints.objectionHandlers?.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-gray-900">Objection Handlers</h4>
          </div>
          <div className="space-y-3">
            {talkingPoints.objectionHandlers.map((handler, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    "{handler.objection}"
                  </p>
                </div>
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-600">{handler.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Questions */}
      {talkingPoints.competitiveQuestions?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-gray-900">Questions to Ask Prospects</h4>
          </div>
          <ul className="space-y-2">
            {talkingPoints.competitiveQuestions.map((question, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-purple-500 mt-0.5">?</span>
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
