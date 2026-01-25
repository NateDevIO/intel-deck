/**
 * Intel Deck - Competitive Intelligence Tool
 * Coded by Nate
 *
 * This application analyzes competitor websites and generates structured
 * battlecards with pricing, positioning, features, and social proof data.
 */

import { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { InputPanel } from './components/input/InputPanel';
import { AnalysisView } from './components/analysis/AnalysisView';
import { ComparisonView } from './components/comparison/ComparisonView';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { EmptyState } from './components/common/EmptyState';
import { Toast } from './components/common/Toast';
import { SettingsModal } from './components/common/SettingsModal';
import { MobileSavedModal } from './components/common/MobileSavedModal';
import { Button } from './components/common/Button';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { BatchProgress } from './components/common/BatchProgress';
import { OnboardingBanner } from './components/common/OnboardingBanner';
import { analyzeContent } from './services/claudeApi';
import { generateSWOT, generateTalkingPoints } from './services/aiGenerators';
import { fetchUrlContent } from './services/urlFetcher';
import { sampleNotionAnalysis } from './data/sampleAnalysis';
import { useCompetitors } from './hooks/useCompetitors';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { compareAnalyses, calculateConfidenceScore } from './utils/trendAnalysis';
import { copyShareUrl, getSharedAnalysisFromUrl } from './utils/shareUtils';

function App() {
  // Dark mode
  const { isDark, toggle: toggleDark } = useDarkMode();

  // Refs
  const sidebarRef = useRef(null);

  // Use env variables if set, otherwise fall back to localStorage
  const envApiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
  const envBrowserlessToken = import.meta.env.VITE_BROWSERLESS_TOKEN || '';
  const [apiKey, setApiKey] = useLocalStorage('battlecard_api_key', envApiKey);
  const { competitors, addCompetitor, removeCompetitor, getCompetitor, updateCompetitor } = useCompetitors();

  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileSaved, setShowMobileSaved] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [pendingNewAnalysis, setPendingNewAnalysis] = useState(false);
  const [showOnboarding, setShowOnboarding] = useLocalStorage('battlecard_show_onboarding', true);
  const [exampleUrl, setExampleUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, type: 'info', message: '' });
  const [rawContent, setRawContent] = useState('');

  // Comparison mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // New feature states
  const [companyInfo, setCompanyInfo] = useLocalStorage('battlecard_company_info', null);
  const [customFields, setCustomFields] = useLocalStorage('battlecard_custom_fields', []);
  const [browserlessToken, setBrowserlessToken] = useLocalStorage('battlecard_browserless_token', envBrowserlessToken);
  const [swot, setSwot] = useState(null);
  const [talkingPoints, setTalkingPoints] = useState(null);
  const [isGeneratingSwot, setIsGeneratingSwot] = useState(false);
  const [isGeneratingTalkingPoints, setIsGeneratingTalkingPoints] = useState(false);
  const [trendChanges, setTrendChanges] = useState(null);
  const [previousAnalysisDate, setPreviousAnalysisDate] = useState(null);
  const [batchProgress, setBatchProgress] = useState(null);
  const [batchCurrentUrl, setBatchCurrentUrl] = useState(null);
  const [batchFailedUrls, setBatchFailedUrls] = useState([]);
  const [batchCancelled, setBatchCancelled] = useState(false);

  // Loading messages
  const loadingMessages = [
    'Extracting pricing information...',
    'Analyzing positioning language...',
    'Identifying social proof...',
    'Structuring battlecard data...'
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewAnalysis: () => {
      // Check if there's unsaved analysis
      if (currentAnalysis && !isCurrentAnalysisSaved) {
        setPendingNewAnalysis(true);
        setShowUnsavedConfirm(true);
      } else {
        performNewAnalysis();
      }
    },
    onSave: () => {
      if (currentAnalysis && !isCurrentAnalysisSaved) {
        const analysisToSave = {
          ...currentAnalysis,
          swot: swot || currentAnalysis.swot,
          talkingPoints: talkingPoints || currentAnalysis.talkingPoints
        };
        addCompetitor(analysisToSave);
        setSelectedCompetitorId(analysisToSave.id);
        showToast('success', `Saved ${currentAnalysis.companyName} to your analyses`);
      }
    },
    onFocusSearch: () => {
      sidebarRef.current?.focusSearch();
    },
    onCloseModal: () => {
      setShowSettings(false);
      setShowKeyboardHelp(false);
      setShowUnsavedConfirm(false);
    },
    onShowHelp: () => {
      setShowKeyboardHelp(true);
    },
    canSave: currentAnalysis && !competitors.some(c => c.id === currentAnalysis.id),
    isModalOpen: showSettings || showKeyboardHelp || showUnsavedConfirm
  });

  // Helper to actually perform new analysis
  const performNewAnalysis = () => {
    setCurrentAnalysis(null);
    setSelectedCompetitorId(null);
    setRawContent('');
    setError(null);
    setShowComparison(false);
    setIsCompareMode(false);
    setCompareIds([]);
    setSwot(null);
    setTalkingPoints(null);
  };

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Check for shared analysis on load
  useEffect(() => {
    const sharedAnalysis = getSharedAnalysisFromUrl();
    if (sharedAnalysis) {
      setCurrentAnalysis({
        ...sharedAnalysis,
        id: crypto.randomUUID()
      });
      showToast('info', `Viewing shared analysis for ${sharedAnalysis.companyName}`);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Check if current analysis is saved
  const isCurrentAnalysisSaved = currentAnalysis
    ? competitors.some(c => c.id === currentAnalysis.id)
    : false;

  // Get competitors selected for comparison
  const competitorsToCompare = compareIds
    .map(id => getCompetitor(id))
    .filter(Boolean);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    showToast('success', 'API key saved');
  };

  const showToast = (type, message, duration = 3000) => {
    // Warnings and errors stay longer by default
    const actualDuration = duration || (type === 'warning' ? 6000 : type === 'error' ? 5000 : 3000);
    setToast({ show: true, type, message, duration: actualDuration });
  };

  const handleAnalyze = async (content, sourceUrl = null) => {
    // Store previous analysis for trend comparison
    const previousAnalysis = currentAnalysis;

    setIsLoading(true);
    setError(null);
    setLoadingMessageIndex(0);
    setRawContent(content);
    setSwot(null);
    setTalkingPoints(null);
    setTrendChanges(null);

    try {
      const result = await analyzeContent(content);

      const fullAnalysis = {
        id: crypto.randomUUID(),
        ...result,
        analyzedAt: new Date().toISOString(),
        sourceType: sourceUrl ? 'url' : 'paste',
        sourceUrl: sourceUrl,
        rawContent: content
      };

      // Check for changes if re-analyzing same company
      if (previousAnalysis && previousAnalysis.companyName?.toLowerCase() === result.companyName?.toLowerCase()) {
        const comparison = compareAnalyses(previousAnalysis, fullAnalysis);
        if (comparison.hasChanges) {
          setTrendChanges(comparison.changes);
          setPreviousAnalysisDate(previousAnalysis.analyzedAt);
        }
      }

      setCurrentAnalysis(fullAnalysis);
      setSelectedCompetitorId(null);
      setShowComparison(false);

      // Check if pricing data is sparse (especially for URL fetches)
      const hasPricingData = result.pricing?.tiers?.some(t =>
        t.price && t.price !== 'null' && !t.price.toLowerCase().includes('contact')
      );

      if (sourceUrl && !hasPricingData) {
        showToast('warning', `Analysis complete but pricing data may be incomplete. Try using "Paste Content" for better results.`);
      } else {
        showToast('success', `Analysis complete for ${result.companyName}. Generating SWOT & Talking Points...`);
      }

      // Auto-generate SWOT and Talking Points in background
      autoGenerateExtras(fullAnalysis);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message);
      showToast('error', 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate SWOT and Talking Points after analysis
  const autoGenerateExtras = async (analysis) => {
    setIsGeneratingSwot(true);
    setIsGeneratingTalkingPoints(true);

    try {
      // Generate both in parallel
      const [swotResult, talkingPointsResult] = await Promise.all([
        generateSWOT(analysis, companyInfo).catch(err => {
          console.error('SWOT generation failed:', err);
          return null;
        }),
        generateTalkingPoints(analysis, companyInfo).catch(err => {
          console.error('Talking points generation failed:', err);
          return null;
        })
      ]);

      // Update state
      setSwot(swotResult);
      setTalkingPoints(talkingPointsResult);

      // Update the analysis with generated content
      setCurrentAnalysis(prev => ({
        ...prev,
        swot: swotResult,
        talkingPoints: talkingPointsResult
      }));

      // Also save to the stored competitor if it exists
      if (analysis.id) {
        updateCompetitor(analysis.id, {
          swot: swotResult,
          talkingPoints: talkingPointsResult
        });
      }

      if (swotResult && talkingPointsResult) {
        showToast('success', 'SWOT & Talking Points generated');
      }
    } finally {
      setIsGeneratingSwot(false);
      setIsGeneratingTalkingPoints(false);
    }
  };

  const handleSaveAnalysis = () => {
    if (!currentAnalysis) return;

    // Include SWOT and Talking Points when saving
    const analysisToSave = {
      ...currentAnalysis,
      swot: swot || currentAnalysis.swot,
      talkingPoints: talkingPoints || currentAnalysis.talkingPoints
    };

    addCompetitor(analysisToSave);
    setSelectedCompetitorId(analysisToSave.id);
    showToast('success', `Saved ${currentAnalysis.companyName} to your analyses`);
  };

  const handleSelectCompetitor = (id) => {
    const competitor = getCompetitor(id);
    if (competitor) {
      setCurrentAnalysis(competitor);
      setSelectedCompetitorId(id);
      setRawContent(competitor.rawContent || '');
      setError(null);
      setShowComparison(false);
      // Restore saved SWOT and Talking Points
      setSwot(competitor.swot || null);
      setTalkingPoints(competitor.talkingPoints || null);
      setTrendChanges(null);
    }
  };

  const handleDeleteCompetitor = (id) => {
    const competitor = getCompetitor(id);
    removeCompetitor(id);

    // Remove from compare list if present
    setCompareIds(prev => prev.filter(cId => cId !== id));

    if (selectedCompetitorId === id) {
      setCurrentAnalysis(null);
      setSelectedCompetitorId(null);
      setRawContent('');
    }

    showToast('info', `Deleted ${competitor?.companyName || 'analysis'}`);
  };

  const handleNewAnalysis = () => {
    // Check if there's unsaved analysis
    if (currentAnalysis && !isCurrentAnalysisSaved) {
      setPendingNewAnalysis(true);
      setShowUnsavedConfirm(true);
    } else {
      performNewAnalysis();
    }
  };

  const handleConfirmNewAnalysis = () => {
    setShowUnsavedConfirm(false);
    if (pendingNewAnalysis) {
      performNewAnalysis();
      setPendingNewAnalysis(false);
    }
  };

  const handleSaveAndNew = () => {
    if (currentAnalysis) {
      const analysisToSave = {
        ...currentAnalysis,
        swot: swot || currentAnalysis.swot,
        talkingPoints: talkingPoints || currentAnalysis.talkingPoints
      };
      addCompetitor(analysisToSave);
      showToast('success', `Saved ${currentAnalysis.companyName}`);
    }
    setShowUnsavedConfirm(false);
    performNewAnalysis();
    setPendingNewAnalysis(false);
  };

  const handleReanalyze = async () => {
    if (!rawContent) {
      showToast('error', 'No content available for re-analysis');
      return;
    }
    await handleAnalyze(rawContent);
  };

  const handleLoadExample = () => {
    setCurrentAnalysis(sampleNotionAnalysis);
    setSelectedCompetitorId(null);
    setRawContent(sampleNotionAnalysis.rawContent || '');
    setShowComparison(false);
    showToast('info', 'Loaded example analysis for Notion');
  };

  const handleExportComplete = (format, action) => {
    const formatNames = {
      markdown: 'Markdown',
      slack: 'Slack message',
      json: 'JSON',
      pdf: 'PDF'
    };
    const actionText = action === 'copy' ? 'Copied' : 'Exported';
    showToast('success', `${actionText} as ${formatNames[format] || format}`);
  };

  // SWOT Generation
  const handleGenerateSwot = async () => {
    if (!currentAnalysis) return;

    setIsGeneratingSwot(true);
    setSwot(null);

    try {
      const result = await generateSWOT(currentAnalysis, companyInfo);
      setSwot(result);

      // Persist to saved competitor if it's saved
      if (selectedCompetitorId) {
        updateCompetitor(selectedCompetitorId, { swot: result });
      }

      showToast('success', 'SWOT analysis generated');
    } catch (err) {
      console.error('SWOT generation failed:', err);
      showToast('error', 'Failed to generate SWOT analysis');
    } finally {
      setIsGeneratingSwot(false);
    }
  };

  // Talking Points Generation
  const handleGenerateTalkingPoints = async () => {
    if (!currentAnalysis) return;

    setIsGeneratingTalkingPoints(true);
    setTalkingPoints(null);

    try {
      const result = await generateTalkingPoints(currentAnalysis, companyInfo);
      setTalkingPoints(result);

      // Persist to saved competitor if it's saved
      if (selectedCompetitorId) {
        updateCompetitor(selectedCompetitorId, { talkingPoints: result });
      }

      showToast('success', 'Talking points generated');
    } catch (err) {
      console.error('Talking points generation failed:', err);
      showToast('error', 'Failed to generate talking points');
    } finally {
      setIsGeneratingTalkingPoints(false);
    }
  };

  // Share Analysis
  const handleShare = async () => {
    if (!currentAnalysis) return;

    try {
      const url = await copyShareUrl(currentAnalysis);
      showToast('success', 'Share link copied to clipboard');
    } catch (err) {
      console.error('Share failed:', err);
      showToast('error', 'Failed to copy share link');
    }
  };

  // Cancel batch analysis
  const handleCancelBatch = () => {
    setBatchCancelled(true);
  };

  // Retry failed URLs
  const handleRetryFailed = () => {
    if (batchFailedUrls.length > 0) {
      handleBatchAnalyze(batchFailedUrls);
    }
  };

  // Batch URL Analysis
  const handleBatchAnalyze = async (urls) => {
    setIsLoading(true);
    setError(null);
    setBatchProgress({ current: 0, total: urls.length });
    setBatchFailedUrls([]);
    setBatchCancelled(false);

    const results = [];
    const failed = [];

    for (let i = 0; i < urls.length; i++) {
      // Check if cancelled
      if (batchCancelled) {
        showToast('info', `Batch cancelled. Analyzed ${results.length} of ${urls.length} URLs.`);
        break;
      }

      setBatchProgress({ current: i + 1, total: urls.length });
      setBatchCurrentUrl(urls[i]);

      try {
        // Fetch URL content
        const { content, url } = await fetchUrlContent(urls[i]);

        // Analyze content
        const result = await analyzeContent(content);

        const fullAnalysis = {
          id: crypto.randomUUID(),
          ...result,
          analyzedAt: new Date().toISOString(),
          sourceType: 'url',
          sourceUrl: url,
          rawContent: content
        };

        results.push(fullAnalysis);
        addCompetitor(fullAnalysis);
      } catch (err) {
        console.error(`Failed to analyze ${urls[i]}:`, err);
        failed.push(urls[i]);
      }
    }

    setIsLoading(false);
    setBatchCurrentUrl(null);
    setBatchFailedUrls(failed);

    if (results.length > 0) {
      const lastAnalysis = results[results.length - 1];
      setCurrentAnalysis(lastAnalysis);
      setSelectedCompetitorId(lastAnalysis.id);

      if (failed.length > 0) {
        showToast('warning', `Analyzed ${results.length}/${urls.length} URLs. ${failed.length} failed.`);
      } else {
        showToast('success', `Analyzed ${results.length} URLs. Now generating SWOT & Talking Points for all...`);
      }

      // Generate SWOT and Talking Points for ALL analyses in background
      generateSwotForAll(results);
    } else if (failed.length > 0) {
      showToast('error', `All ${failed.length} URLs failed to analyze.`);
    }

    // Clear batch progress after a delay if complete
    if (!batchCancelled) {
      setTimeout(() => {
        setBatchProgress(null);
      }, failed.length > 0 ? 5000 : 2000);
    } else {
      setBatchProgress(null);
    }
  };

  // Generate SWOT for all batch results
  const generateSwotForAll = async (analyses) => {
    setIsGeneratingSwot(true);
    setIsGeneratingTalkingPoints(true);

    for (let i = 0; i < analyses.length; i++) {
      const analysis = analyses[i];

      try {
        const [swotResult, talkingPointsResult] = await Promise.all([
          generateSWOT(analysis, companyInfo).catch(() => null),
          generateTalkingPoints(analysis, companyInfo).catch(() => null)
        ]);

        // Save to stored competitor
        updateCompetitor(analysis.id, {
          swot: swotResult,
          talkingPoints: talkingPointsResult
        });

        // If this is the currently displayed analysis, update the UI
        if (analysis.id === selectedCompetitorId) {
          setSwot(swotResult);
          setTalkingPoints(talkingPointsResult);
          setCurrentAnalysis(prev => ({
            ...prev,
            swot: swotResult,
            talkingPoints: talkingPointsResult
          }));
        }

        // Show progress
        if (i < analyses.length - 1) {
          showToast('info', `Generated SWOT for ${analysis.companyName} (${i + 1}/${analyses.length})`);
        }
      } catch (err) {
        console.error(`Failed to generate SWOT for ${analysis.companyName}:`, err);
      }
    }

    setIsGeneratingSwot(false);
    setIsGeneratingTalkingPoints(false);
    showToast('success', `SWOT & Talking Points generated for all ${analyses.length} competitors`);
  };

  // Comparison handlers
  const handleToggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    if (isCompareMode) {
      setCompareIds([]);
    }
  };

  const handleToggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(cId => cId !== id);
      }
      return [...prev, id];
    });
  };

  const handleStartComparison = () => {
    if (compareIds.length >= 2) {
      setShowComparison(true);
      setCurrentAnalysis(null);
      setSelectedCompetitorId(null);
    }
  };

  const handleExitComparison = () => {
    setShowComparison(false);
    setIsCompareMode(false);
    setCompareIds([]);
  };

  // Win/Loss tracking
  const handleAddOutcome = (outcome) => {
    if (!selectedCompetitorId) return;
    const competitor = getCompetitor(selectedCompetitorId);
    const outcomes = competitor?.outcomes || [];
    updateCompetitor(selectedCompetitorId, {
      outcomes: [...outcomes, outcome]
    });
    setCurrentAnalysis(prev => ({
      ...prev,
      outcomes: [...(prev.outcomes || []), outcome]
    }));
    showToast('success', `Logged ${outcome.result} against ${competitor?.companyName}`);
  };

  const handleRemoveOutcome = (outcomeId) => {
    if (!selectedCompetitorId) return;
    const competitor = getCompetitor(selectedCompetitorId);
    const outcomes = (competitor?.outcomes || []).filter(o => o.id !== outcomeId);
    updateCompetitor(selectedCompetitorId, { outcomes });
    setCurrentAnalysis(prev => ({
      ...prev,
      outcomes: (prev.outcomes || []).filter(o => o.id !== outcomeId)
    }));
  };

  const handleRemoveFromComparison = (id) => {
    setCompareIds(prev => prev.filter(cId => cId !== id));
    if (compareIds.length <= 2) {
      // If removing would leave less than 2, exit comparison
      setShowComparison(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header
        onSettingsClick={() => setShowSettings(true)}
        isDark={isDark}
        onToggleDark={toggleDark}
        onNewAnalysis={handleNewAnalysis}
        onShowSaved={() => setShowMobileSaved(true)}
        savedCount={competitors.length}
        showMobileNav={true}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          ref={sidebarRef}
          competitors={competitors}
          selectedId={selectedCompetitorId}
          onSelect={handleSelectCompetitor}
          onDelete={handleDeleteCompetitor}
          onNewAnalysis={handleNewAnalysis}
          isCompareMode={isCompareMode}
          compareIds={compareIds}
          onToggleCompareMode={handleToggleCompareMode}
          onToggleCompare={handleToggleCompare}
          onStartComparison={handleStartComparison}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Comparison View */}
            {showComparison && (
              <ComparisonView
                competitors={competitorsToCompare}
                onRemove={handleRemoveFromComparison}
                onClose={handleExitComparison}
                companyInfo={companyInfo}
              />
            )}

            {/* Onboarding Banner - show for first-time users */}
            {!showComparison && !currentAnalysis && !isLoading && showOnboarding && competitors.length === 0 && (
              <OnboardingBanner
                onDismiss={() => setShowOnboarding(false)}
                onTryExample={(url) => {
                  setExampleUrl(url);
                  setShowOnboarding(false);
                }}
              />
            )}

            {/* Input Panel */}
            {!showComparison && !currentAnalysis && !isLoading && (
              <InputPanel
                onAnalyze={handleAnalyze}
                onBatchAnalyze={handleBatchAnalyze}
                isLoading={isLoading}
                initialUrl={exampleUrl}
              />
            )}

            {/* Error State */}
            {!showComparison && error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">Analysis Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {!showComparison && isLoading && !batchProgress && (
              <div className="mt-8">
                <LoadingSpinner
                  size="lg"
                  message={loadingMessages[loadingMessageIndex]}
                />
              </div>
            )}

            {/* Batch Progress */}
            {!showComparison && batchProgress && (
              <div className="mt-8">
                <BatchProgress
                  progress={batchProgress}
                  currentUrl={batchCurrentUrl}
                  onCancel={isLoading ? handleCancelBatch : null}
                  failedUrls={batchFailedUrls}
                  onRetryFailed={batchFailedUrls.length > 0 && !isLoading ? handleRetryFailed : null}
                />
              </div>
            )}

            {/* Results */}
            {!showComparison && !isLoading && currentAnalysis && (
              <AnalysisView
                analysis={currentAnalysis}
                onExportComplete={handleExportComplete}
                onSave={handleSaveAnalysis}
                onReanalyze={rawContent ? handleReanalyze : null}
                onGenerateSwot={handleGenerateSwot}
                onGenerateTalkingPoints={handleGenerateTalkingPoints}
                onShare={handleShare}
                isSaved={isCurrentAnalysisSaved}
                swot={swot}
                talkingPoints={talkingPoints}
                isGeneratingSwot={isGeneratingSwot}
                isGeneratingTalkingPoints={isGeneratingTalkingPoints}
                trendChanges={trendChanges}
                previousAnalysisDate={previousAnalysisDate}
                confidence={calculateConfidenceScore(currentAnalysis)}
                onAddOutcome={handleAddOutcome}
                onRemoveOutcome={handleRemoveOutcome}
              />
            )}

            {/* Empty State */}
            {!showComparison && !isLoading && !currentAnalysis && !error && competitors.length === 0 && (
              <div className="mt-8">
                <EmptyState
                  icon={<Search className="w-full h-full" />}
                  title="Analyze your first competitor"
                  description="Paste competitor content above to generate a structured battlecard with pricing, positioning, and social proof."
                  action={
                    <Button variant="secondary" onClick={handleLoadExample}>
                      See Example Analysis
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        browserlessToken={browserlessToken}
        onSaveBrowserlessToken={setBrowserlessToken}
        companyInfo={companyInfo}
        onSaveCompanyInfo={setCompanyInfo}
        customFields={customFields}
        onSaveCustomFields={setCustomFields}
      />

      {/* Mobile Saved Analyses Modal */}
      <MobileSavedModal
        isOpen={showMobileSaved}
        onClose={() => setShowMobileSaved(false)}
        competitors={competitors}
        onSelect={handleSelectCompetitor}
        onDelete={handleDeleteCompetitor}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />

      {/* Unsaved Changes Confirmation */}
      <ConfirmDialog
        isOpen={showUnsavedConfirm}
        onClose={() => {
          setShowUnsavedConfirm(false);
          setPendingNewAnalysis(false);
        }}
        onConfirm={handleConfirmNewAnalysis}
        title="Unsaved Analysis"
        message={`You have an unsaved analysis for "${currentAnalysis?.companyName}". Do you want to discard it?`}
        confirmText="Discard"
        cancelText="Save First"
        variant="warning"
      />

      {/* Toast */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.show}
        duration={toast.duration}
        onDismiss={() => setToast({ ...toast, show: false })}
      />

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <span>Coded by Nate</span>
        <span className="mx-2">|</span>
        <span className="text-gray-300 dark:text-gray-600">
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">N</kbd> New
          <span className="mx-1.5">/</span>
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">S</kbd> Save
          <span className="mx-1.5">/</span>
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">/</kbd> Search
        </span>
      </footer>
    </div>
  );
}

export default App;
