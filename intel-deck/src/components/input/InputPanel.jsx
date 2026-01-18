import { useState, useEffect } from 'react';
import { FileText, Sparkles, ClipboardPaste, Link, Layers } from 'lucide-react';
import { TextPasteArea } from './TextPasteArea';
import { UrlInput } from './UrlInput';
import { BatchUrlInput } from './BatchUrlInput';
import { Button } from '../common/Button';
import { sampleTestContent } from '../../data/sampleAnalysis';

const TABS = [
  { id: 'url', label: 'Enter URL', icon: Link },
  { id: 'batch', label: 'Batch URLs', icon: Layers },
  { id: 'paste', label: 'Paste Text', icon: ClipboardPaste },
];

export function InputPanel({ onAnalyze, onBatchAnalyze, isLoading }) {
  const [activeTab, setActiveTab] = useState('url');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState(null);

  // Keyboard shortcut for Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && content.trim() && !isLoading) {
        onAnalyze(content, sourceUrl);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, sourceUrl, onAnalyze, isLoading]);

  const handleLoadExample = () => {
    setActiveTab('paste');
    setContent(sampleTestContent);
    setSourceUrl(null);
  };

  const handleSubmit = () => {
    if (content.trim() && !isLoading) {
      onAnalyze(content, sourceUrl);
    }
  };

  const handleUrlContentFetched = (fetchedContent, url) => {
    setContent(fetchedContent);
    setSourceUrl(url);
    // Auto-trigger analysis after URL fetch
    onAnalyze(fetchedContent, url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Analyze Competitor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Paste content or enter a URL to analyze pricing and positioning
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadExample}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Load Example
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 pt-4">
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 pt-4">
        {activeTab === 'url' && (
          <UrlInput
            onContentFetched={handleUrlContentFetched}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'batch' && (
          <BatchUrlInput
            onBatchAnalyze={onBatchAnalyze}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'paste' && (
          <>
            <TextPasteArea
              value={content}
              onChange={(val) => {
                setContent(val);
                setSourceUrl(null);
              }}
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Tip: The more detailed the content, the better the extraction
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                isLoading={isLoading}
                leftIcon={isLoading ? null : <FileText className="w-4 h-4" />}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Content'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
