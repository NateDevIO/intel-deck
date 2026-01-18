import { useState, useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  Building2,
  Trash2,
  ChevronRight,
  Clock,
  Plus,
  FolderOpen,
  GitCompare,
  Check,
  Square,
  CheckSquare,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Button } from '../common/Button';

function CompetitorItem({
  competitor,
  isSelected,
  isCompareMode,
  isCheckedForCompare,
  onSelect,
  onDelete,
  onToggleCompare
}) {
  const [showDelete, setShowDelete] = useState(false);

  const analyzedDate = new Date(competitor.analyzedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const tierCount = competitor.pricing?.tiers?.length || 0;

  const handleClick = () => {
    if (isCompareMode) {
      onToggleCompare(competitor.id);
    } else {
      onSelect(competitor.id);
    }
  };

  return (
    <div
      className={`
        group relative p-3 rounded-lg cursor-pointer transition-all
        ${isSelected && !isCompareMode
          ? 'bg-primary-50 border border-primary-200'
          : isCheckedForCompare
            ? 'bg-indigo-50 border border-indigo-200'
            : 'hover:bg-gray-50 border border-transparent'
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox for compare mode */}
        {isCompareMode ? (
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${isCheckedForCompare ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}
          `}>
            {isCheckedForCompare ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </div>
        ) : (
          <div className={`
            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            <Building2 className="w-4 h-4" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${
            isSelected && !isCompareMode ? 'text-primary-900' :
            isCheckedForCompare ? 'text-indigo-900' : 'text-gray-900'
          }`}>
            {competitor.companyName}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {analyzedDate}
            </span>
            {tierCount > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                {tierCount} tiers
              </span>
            )}
          </div>
        </div>

        {!isCompareMode && (
          <ChevronRight className={`
            w-4 h-4 flex-shrink-0 transition-transform
            ${isSelected ? 'text-primary-600' : 'text-gray-400'}
          `} />
        )}
      </div>

      {/* Delete button - only show when not in compare mode */}
      {showDelete && !isCompareMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(competitor.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Has Free Tier' },
  { id: 'enterprise', label: 'Has Enterprise' },
  { id: 'trial', label: 'Has Trial' },
  { id: 'recent', label: 'Last 7 Days' }
];

export const Sidebar = forwardRef(function Sidebar({
  competitors,
  selectedId,
  onSelect,
  onDelete,
  onNewAnalysis,
  compareIds,
  onToggleCompare,
  isCompareMode,
  onToggleCompareMode,
  onStartComparison
}, ref) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);

  // Expose focusSearch method to parent
  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      searchInputRef.current?.focus();
    }
  }));

  const filteredCompetitors = useMemo(() => {
    let result = competitors;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.companyName?.toLowerCase().includes(query) ||
        c.positioning?.tagline?.toLowerCase().includes(query)
      );
    }

    // Apply filter
    if (activeFilter !== 'all') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      result = result.filter(c => {
        switch (activeFilter) {
          case 'free':
            return c.pricing?.hasFreeTier;
          case 'enterprise':
            return c.pricing?.hasEnterpriseTier;
          case 'trial':
            return c.pricing?.trialAvailable;
          case 'recent':
            return new Date(c.analyzedAt) >= sevenDaysAgo;
          default:
            return true;
        }
      });
    }

    return result;
  }, [competitors, searchQuery, activeFilter]);

  const selectedForCompare = compareIds?.length || 0;

  return (
    <aside className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">Saved Analyses</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {competitors.length}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={onNewAnalysis}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New
          </Button>
          {competitors.length >= 2 && (
            <Button
              variant={isCompareMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={onToggleCompareMode}
              title="Compare competitors"
            >
              <GitCompare className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Compare mode header */}
        {isCompareMode && (
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-900">
                Compare Mode
              </span>
              <span className="text-xs text-indigo-600">
                {selectedForCompare} selected
              </span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              disabled={selectedForCompare < 2}
              onClick={onStartComparison}
            >
              {selectedForCompare < 2
                ? `Select ${2 - selectedForCompare} more`
                : `Compare ${selectedForCompare} competitors`
              }
            </Button>
          </div>
        )}

        {/* Search and Filter */}
        {competitors.length > 0 && !isCompareMode && (
          <div className="mt-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search competitors... (/)"
                className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors
                  ${activeFilter !== 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <Filter className="w-3 h-3" />
                Filter
                {activeFilter !== 'all' && (
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                )}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-1">
                {FILTER_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setActiveFilter(option.id);
                      if (option.id !== 'all') setShowFilters(false);
                    }}
                    className={`px-2 py-1 text-xs rounded-md transition-colors
                      ${activeFilter === option.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Competitors List */}
      <div className="flex-1 overflow-y-auto p-2">
        {competitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <FolderOpen className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              No saved analyses yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Analyze a competitor to save it here
            </p>
          </div>
        ) : filteredCompetitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Search className="w-8 h-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No matches found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="text-xs text-primary-600 hover:text-primary-700 mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredCompetitors.map(competitor => (
              <CompetitorItem
                key={competitor.id}
                competitor={competitor}
                isSelected={selectedId === competitor.id}
                isCompareMode={isCompareMode}
                isCheckedForCompare={compareIds?.includes(competitor.id)}
                onSelect={onSelect}
                onDelete={onDelete}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});
