import { Copy, Check, Building2, BarChart2, Handshake, Award } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export function SocialProofCard({ socialProof }) {
  const [copied, setCopied] = useState(false);

  if (!socialProof) return null;

  const hasContent =
    socialProof.customerLogos?.length > 0 ||
    socialProof.metricsClaimed?.length > 0 ||
    socialProof.partnerships?.length > 0 ||
    socialProof.caseStudies?.length > 0 ||
    socialProof.awards?.length > 0;

  if (!hasContent) return null;

  const handleCopy = () => {
    let text = 'Social Proof\n\n';
    if (socialProof.customerLogos?.length) {
      text += `Customers: ${socialProof.customerLogos.join(', ')}\n`;
    }
    if (socialProof.metricsClaimed?.length) {
      text += `Metrics: ${socialProof.metricsClaimed.join('; ')}\n`;
    }
    if (socialProof.partnerships?.length) {
      text += `Integrations: ${socialProof.partnerships.join(', ')}\n`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      title="Social Proof"
      action={
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Logos */}
        {socialProof.customerLogos?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Logos</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialProof.customerLogos.map((logo, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Claimed */}
        {socialProof.metricsClaimed?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Metrics Claimed</h4>
            </div>
            <ul className="space-y-2">
              {socialProof.metricsClaimed.map((metric, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 font-medium bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Partnerships */}
        {socialProof.partnerships?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Handshake className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Integrations</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialProof.partnerships.map((partner, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies */}
        {socialProof.caseStudies?.length > 0 && (
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Case Studies</h4>
            </div>
            <ul className="space-y-1">
              {socialProof.caseStudies.map((study, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                  - {study}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {socialProof.awards?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Awards</h4>
            </div>
            <ul className="space-y-1">
              {socialProof.awards.map((award, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                  - {award}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
