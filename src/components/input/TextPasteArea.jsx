import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function TextPasteArea({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    // Auto-focus on mount
    textareaRef.current?.focus();
  }, []);

  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  const charCount = value.length;

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Paste competitor content here...\n\nExamples:\n- Pricing page content\n- Product descriptions\n- Marketing copy\n- Feature lists"}
        className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none
                   focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   placeholder:text-gray-400 text-sm leading-relaxed"
      />

      {/* Character count and clear button */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {value && (
          <button
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <span className="text-xs text-gray-400">
          {charCount.toLocaleString()} chars
        </span>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-2 text-xs text-gray-400">
        Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Ctrl+Enter</kbd> to analyze
      </div>
    </div>
  );
}
