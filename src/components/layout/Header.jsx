import { Settings, BarChart3, Moon, Sun, Plus, FolderOpen } from 'lucide-react';

export function Header({
  onSettingsClick,
  isDark,
  onToggleDark,
  onNewAnalysis,
  onShowSaved,
  savedCount = 0,
  showMobileNav = false
}) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Intel Deck</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">AI Battlecard Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile nav buttons - only show on small screens */}
          {showMobileNav && (
            <>
              <button
                onClick={onNewAnalysis}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="New Analysis"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={onShowSaved}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative"
                title="Saved Analyses"
              >
                <FolderOpen className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {savedCount > 9 ? '9+' : savedCount}
                  </span>
                )}
              </button>
            </>
          )}
          <button
            onClick={onToggleDark}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
