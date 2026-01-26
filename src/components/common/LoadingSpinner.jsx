import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'md', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );
}
