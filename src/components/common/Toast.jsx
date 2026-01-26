import { useEffect } from 'react';
import { Check, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const types = {
  success: {
    icon: Check,
    className: 'bg-green-50 border-green-200 text-green-800'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800'
  }
};

export function Toast({ type = 'info', message, isVisible, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) return null;

  const { icon: Icon, className } = types[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${className}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 p-1 hover:bg-black/5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
