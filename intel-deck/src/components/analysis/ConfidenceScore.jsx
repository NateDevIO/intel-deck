import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

export function ConfidenceScore({ confidence }) {
  if (!confidence) return null;

  const { score, level, label } = confidence;

  const getIcon = () => {
    switch (level) {
      case 'high':
        return <ShieldCheck className="w-4 h-4" />;
      case 'medium':
        return <Shield className="w-4 h-4" />;
      default:
        return <ShieldAlert className="w-4 h-4" />;
    }
  };

  const getColors = () => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          bar: 'bg-green-500'
        };
      case 'medium':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-700',
          bar: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          bar: 'bg-red-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} ${colors.text} rounded-lg text-sm`}>
      {getIcon()}
      <span className="font-medium">{label}</span>
      <div className="w-16 h-1.5 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs opacity-75">{score}%</span>
    </div>
  );
}
