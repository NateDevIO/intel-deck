import { RefreshCw, Calendar, Link as LinkIcon, Save, Check, Target, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '../common/Button';
import { ExportMenu } from '../export/ExportMenu';
import { PricingCard } from './PricingCard';
import { PositioningCard } from './PositioningCard';
import { SocialProofCard } from './SocialProofCard';
import { FeaturesCard } from './FeaturesCard';
import { CtaCard } from './CtaCard';
import { SwotCard } from './SwotCard';
import { TalkingPointsCard } from './TalkingPointsCard';
import { TrendCard } from './TrendCard';
import { ConfidenceScore } from './ConfidenceScore';

export function AnalysisView({
  analysis,
  onReanalyze,
  onSave,
  onExportComplete,
  onGenerateSwot,
  onGenerateTalkingPoints,
  onShare,
  isSaved = false,
  swot = null,
  talkingPoints = null,
  isGeneratingSwot = false,
  isGeneratingTalkingPoints = false,
  trendChanges = null,
  previousAnalysisDate = null,
  confidence = null
}) {
  if (!analysis) return null;

  const {
    companyName,
    analyzedAt,
    sourceUrl,
    pricing,
    positioning,
    features,
    socialProof,
    callsToAction
  } = analysis;

  const formattedDate = analyzedAt
    ? new Date(analyzedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{companyName}</h2>
              {isSaved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Saved
                </span>
              )}
              {confidence && <ConfidenceScore confidence={confidence} />}
            </div>
            {positioning?.tagline && (
              <p className="text-gray-600 mt-1 italic">"{positioning.tagline}"</p>
            )}

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </div>
              )}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary-600"
                >
                  <LinkIcon className="w-4 h-4" />
                  Source
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSave && !isSaved && (
              <Button variant="primary" size="sm" onClick={onSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
            )}
            {onGenerateSwot && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onGenerateSwot}
                disabled={isGeneratingSwot}
                title="Generate SWOT Analysis"
              >
                <Target className="w-4 h-4" />
              </Button>
            )}
            {onGenerateTalkingPoints && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onGenerateTalkingPoints}
                disabled={isGeneratingTalkingPoints}
                title="Generate Talking Points"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
            {onShare && (
              <Button variant="secondary" size="sm" onClick={onShare} title="Share Analysis">
                <Share2 className="w-4 h-4" />
              </Button>
            )}
            {onReanalyze && (
              <Button variant="secondary" size="sm" onClick={onReanalyze} title="Re-analyze">
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            <ExportMenu analysis={analysis} onExportComplete={onExportComplete} />
          </div>
        </div>
      </div>

      {/* Trend Changes */}
      {trendChanges && trendChanges.length > 0 && (
        <TrendCard changes={trendChanges} previousDate={previousAnalysisDate} />
      )}

      {/* Analysis Cards */}
      <PricingCard pricing={pricing} />
      <PositioningCard positioning={positioning} />
      <SocialProofCard socialProof={socialProof} />
      <FeaturesCard features={features} />
      <CtaCard callsToAction={callsToAction} />

      {/* AI-Generated Insights */}
      {(swot || isGeneratingSwot) && (
        <SwotCard swot={swot} isLoading={isGeneratingSwot} />
      )}
      {(talkingPoints || isGeneratingTalkingPoints) && (
        <TalkingPointsCard talkingPoints={talkingPoints} isLoading={isGeneratingTalkingPoints} />
      )}
    </div>
  );
}
