import { useState } from 'react';
import { Trophy, XCircle, Minus, TrendingUp, ChevronDown } from 'lucide-react';

const OUTCOMES = [
  { id: 'win', label: 'Won', icon: Trophy, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'loss', label: 'Lost', icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'pending', label: 'Pending', icon: Minus, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' },
];

export function WinLossTracker({ competitorId, outcomes = [], onAddOutcome, onRemoveOutcome }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const wins = outcomes.filter(o => o.result === 'win').length;
  const losses = outcomes.filter(o => o.result === 'loss').length;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : null;

  const handleAddOutcome = (result) => {
    onAddOutcome?.({
      id: crypto.randomUUID(),
      result,
      date: new Date().toISOString(),
      competitorId
    });
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Win Rate Display */}
        {total > 0 && (
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${winRate >= 50 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${winRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {winRate}% win rate
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({wins}W / {losses}L)
            </span>
          </div>
        )}

        {/* Add Outcome Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Log Outcome
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* History Button */}
        {outcomes.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            {showHistory ? 'Hide' : 'Show'} history
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-2 space-y-1">
              {OUTCOMES.filter(o => o.id !== 'pending').map(outcome => {
                const Icon = outcome.icon;
                return (
                  <button
                    key={outcome.id}
                    onClick={() => handleAddOutcome(outcome.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${outcome.bg} ${outcome.color} hover:opacity-80 transition-opacity`}
                  >
                    <Icon className="w-4 h-4" />
                    {outcome.label} against this competitor
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* History */}
      {showHistory && outcomes.length > 0 && (
        <div className="mt-3 space-y-2">
          {outcomes.slice().reverse().map((outcome) => {
            const config = OUTCOMES.find(o => o.id === outcome.result);
            const Icon = config?.icon || Minus;
            return (
              <div
                key={outcome.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg ${config?.bg || 'bg-gray-100 dark:bg-gray-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config?.color}`} />
                  <span className={`text-sm font-medium ${config?.color}`}>
                    {config?.label || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(outcome.date).toLocaleDateString()}
                  </span>
                </div>
                {onRemoveOutcome && (
                  <button
                    onClick={() => onRemoveOutcome(outcome.id)}
                    className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function WinLossStats({ competitors }) {
  const allOutcomes = competitors.flatMap(c => (c.outcomes || []).map(o => ({ ...o, competitorName: c.companyName })));

  if (allOutcomes.length === 0) return null;

  const byCompetitor = competitors.map(c => {
    const outcomes = c.outcomes || [];
    const wins = outcomes.filter(o => o.result === 'win').length;
    const losses = outcomes.filter(o => o.result === 'loss').length;
    const total = wins + losses;
    return {
      name: c.companyName,
      wins,
      losses,
      total,
      winRate: total > 0 ? Math.round((wins / total) * 100) : null
    };
  }).filter(c => c.total > 0).sort((a, b) => (b.winRate || 0) - (a.winRate || 0));

  const totalWins = byCompetitor.reduce((sum, c) => sum + c.wins, 0);
  const totalLosses = byCompetitor.reduce((sum, c) => sum + c.losses, 0);
  const overallTotal = totalWins + totalLosses;
  const overallWinRate = overallTotal > 0 ? Math.round((totalWins / overallTotal) * 100) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Win/Loss Summary</h3>
        {overallWinRate !== null && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${overallWinRate >= 50 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <TrendingUp className={`w-4 h-4 ${overallWinRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            <span className={`text-sm font-medium ${overallWinRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {overallWinRate}% overall
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {byCompetitor.map((comp) => (
          <div key={comp.name} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{comp.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{comp.wins}W</span>
                <span className="text-gray-400">/</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{comp.losses}L</span>
              </div>
              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${comp.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${comp.winRate || 0}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-10 text-right ${comp.winRate >= 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {comp.winRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
