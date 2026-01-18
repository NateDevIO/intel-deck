const styles = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-red-100 text-red-800'
};

export function ConfidenceBadge({ level, showLabel = true }) {
  if (!level) return null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${styles[level] || styles.low}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {showLabel && (level.charAt(0).toUpperCase() + level.slice(1))}
    </span>
  );
}
