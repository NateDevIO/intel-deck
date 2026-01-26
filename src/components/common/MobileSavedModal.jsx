import { X, Building2, Clock, Trash2 } from 'lucide-react';

export function MobileSavedModal({ isOpen, onClose, competitors, onSelect, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Saved Analyses ({competitors.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {competitors.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No saved analyses yet
            </p>
          ) : (
            <div className="space-y-2">
              {competitors.map(competitor => {
                const analyzedDate = new Date(competitor.analyzedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={competitor.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <button
                      onClick={() => {
                        onSelect(competitor.id);
                        onClose();
                      }}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {competitor.companyName}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {analyzedDate}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => onDelete(competitor.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
